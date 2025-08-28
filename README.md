# Workout PDF Builder

A Next.js application for creating workout PDFs from video transcripts using OpenAI Whisper for transcription and Google Gemini for image generation.

## Features

- Upload workout videos
- Automatic transcription using OpenAI Whisper
- Edit transcripts in real-time
- Generate workout illustrations with Google Gemini
- Export to PDF with embedded images

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure API keys in `.env.local`:
```
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Usage

1. **Upload Video**: Click the upload area to select a workout video
2. **Wait for Transcription**: The app will automatically transcribe the audio using OpenAI Whisper
3. **Edit Transcript**: Modify the generated transcript as needed
4. **Generate Images**: Enter exercise descriptions to generate placeholder illustrations
5. **Export PDF**: Click "Export to PDF" to download your workout guide

## Video Storage

Videos can be placed in the `public/videos` folder for easy access.

## Tech Stack

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- OpenAI API (Whisper)
- Google Generative AI (Gemini)
- jsPDF for PDF generation
