'use client';

import { useState, useRef } from 'react';

interface VideoUploaderProps {
  onVideoUploaded: (url: string) => void;
  onTranscriptGenerated: (transcript: string) => void;
  isTranscribing: boolean;
  setIsTranscribing: (value: boolean) => void;
}

export default function VideoUploader({ 
  onVideoUploaded, 
  onTranscriptGenerated,
  isTranscribing,
  setIsTranscribing
}: VideoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    const videoUrl = URL.createObjectURL(file);
    onVideoUploaded(videoUrl);

    const formData = new FormData();
    formData.append('video', file);

    try {
      setIsTranscribing(true);
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const data = await response.json();
      onTranscriptGenerated(data.transcript);
    } catch (error) {
      console.error('Error transcribing video:', error);
      alert('Failed to transcribe video. Please check your OpenAI API key.');
    } finally {
      setUploading(false);
      setIsTranscribing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Upload Workout Video
      </h2>
      
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileUpload}
          className="hidden"
          disabled={uploading || isTranscribing}
        />
        
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {uploading || isTranscribing ? (
            <span className="text-blue-600">
              {isTranscribing ? 'Transcribing video...' : 'Uploading...'}
            </span>
          ) : (
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-500"
              >
                Click to upload
              </button>
              {' '}or drag and drop
            </>
          )}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          MP4, MOV, AVI up to 100MB
        </p>
      </div>
    </div>
  );
}