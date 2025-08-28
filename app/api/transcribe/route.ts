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
    const video = formData.get('video') as File;
    
    if (!video) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    const bytes = await video.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const tempFilePath = join(tmpdir(), `${Date.now()}-${video.name}`);
    await writeFile(tempFilePath, buffer);

    try {
      const transcription = await openai.audio.transcriptions.create({
        file: await OpenAI.toFile(buffer, video.name),
        model: 'whisper-1',
        response_format: 'text',
      });

      await unlink(tempFilePath);

      return NextResponse.json({ 
        transcript: transcription,
        success: true 
      });
    } catch (error) {
      await unlink(tempFilePath);
      throw error;
    }
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe video' },
      { status: 500 }
    );
  }
}