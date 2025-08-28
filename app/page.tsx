'use client';

import { useState } from 'react';
import Link from 'next/link';
import VideoUploader from '@/components/VideoUploader';
import TranscriptEditor from '@/components/TranscriptEditor';
import PDFExporter from '@/components/PDFExporter';
import ImageGenerator from '@/components/ImageGenerator';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [transcript, setTranscript] = useState<string>('');
  const [generatedImages, setGeneratedImages] = useState<Map<number, string>>(new Map());
  const [isTranscribing, setIsTranscribing] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Workout PDF Builder
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Upload workout videos, transcribe, edit, and export to PDF
              </p>
            </div>
            <div className="flex gap-2">
              <Link 
                href="/video-library" 
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Video Library
              </Link>
              <Link 
                href="/workout-plan" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Warm-Up Plan
              </Link>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <VideoUploader 
              onVideoUploaded={setVideoUrl}
              onTranscriptGenerated={setTranscript}
              isTranscribing={isTranscribing}
              setIsTranscribing={setIsTranscribing}
            />
            
            {videoUrl && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Video Preview
                </h2>
                <video 
                  controls 
                  className="w-full rounded"
                  src={videoUrl}
                />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <TranscriptEditor 
              transcript={transcript}
              onTranscriptChange={setTranscript}
            />
            
            {transcript && (
              <>
                <ImageGenerator 
                  transcript={transcript}
                  generatedImages={generatedImages}
                  onImagesGenerated={setGeneratedImages}
                />
                
                <PDFExporter 
                  transcript={transcript}
                  generatedImages={generatedImages}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}