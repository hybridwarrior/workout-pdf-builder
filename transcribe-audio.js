const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function transcribeAudio(audioPath) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    console.log(`Transcribing: ${audioPath}`);
    
    const audioFile = fs.createReadStream(audioPath);
    
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      response_format: 'verbose_json',
      timestamp_granularities: ['segment']
    });

    // Format output with only start, end, and text
    const formattedSegments = transcription.segments?.map(segment => ({
      start: segment.start,
      end: segment.end,
      text: segment.text
    })) || [];

    const output = {
      file: path.basename(audioPath),
      duration: transcription.duration,
      segments: formattedSegments,
      full_text: transcription.text
    };

    // Save to JSON file
    const outputPath = audioPath.replace(/\.(mp3|mp4|wav|m4a)$/i, '_transcript.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    
    console.log('\nTranscription complete!');
    console.log(`Duration: ${transcription.duration}s`);
    console.log(`Segments: ${formattedSegments.length}`);
    console.log(`\nOutput saved to: ${outputPath}`);
    
    // Print segments to console
    console.log('\n--- SEGMENTS ---');
    formattedSegments.forEach((seg, i) => {
      console.log(`[${seg.start.toFixed(2)}s - ${seg.end.toFixed(2)}s]: ${seg.text}`);
    });

    return output;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
}

// Check if file path provided
const audioPath = process.argv[2];

if (!audioPath) {
  console.log('Usage: node transcribe-audio.js <path-to-audio-file>');
  console.log('Supported formats: MP3, MP4, WAV, M4A');
  process.exit(1);
}

if (!fs.existsSync(audioPath)) {
  console.error(`File not found: ${audioPath}`);
  process.exit(1);
}

// Run transcription
transcribeAudio(audioPath).catch(console.error);