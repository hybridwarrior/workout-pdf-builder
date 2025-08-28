import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

export async function POST(request: NextRequest) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
  });
  try {
    const formData = await request.formData();
    const file = formData.get('audio') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const tempFilePath = join(tmpdir(), `${Date.now()}-${file.name}`);
    await writeFile(tempFilePath, buffer);

    try {
      // Get verbose JSON transcription with timestamps
      const transcription = await openai.audio.transcriptions.create({
        file: await OpenAI.toFile(buffer, file.name),
        model: 'whisper-1',
        response_format: 'verbose_json',
        timestamp_granularities: ['segment']
      });

      await unlink(tempFilePath);

      // Format the response to only include start, end, and text
      const formattedSegments = transcription.segments?.map(segment => ({
        start: segment.start,
        end: segment.end,
        text: segment.text
      })) || [];

      return NextResponse.json({ 
        segments: formattedSegments,
        duration: transcription.duration,
        text: transcription.text,
        success: true 
      });
    } catch (error) {
      await unlink(tempFilePath);
      throw error;
    }
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe audio', details: error },
      { status: 500 }
    );
  }
}