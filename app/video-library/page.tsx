'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface VideoClip {
  name: string;
  path: string;
  size: number;
  uploaded: string;
}

export default function VideoLibrary() {
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoClip | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    loadClips();
  }, []);

  const loadClips = async () => {
    try {
      const response = await fetch('/api/video-clips');
      const data = await response.json();
      setClips(data.clips || []);
    } catch (error) {
      console.error('Error loading clips:', error);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    setUploading(true);
    
    for (const file of files) {
      if (!file.type.startsWith('video/')) {
        alert(`${file.name} is not a video file`);
        continue;
      }

      const formData = new FormData();
      formData.append('video', file);

      try {
        const response = await fetch('/api/video-clips', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          await loadClips();
        } else {
          alert(`Failed to upload ${file.name}`);
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert(`Error uploading ${file.name}`);
      }
    }
    
    setUploading(false);
  };

  const deleteClip = async (clipName: string) => {
    if (!confirm(`Delete ${clipName}?`)) return;

    try {
      const response = await fetch(`/api/video-clips?name=${encodeURIComponent(clipName)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadClips();
      } else {
        alert('Failed to delete clip');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Video Clip Library
              </h1>
              <p className="text-gray-400">
                Manage your workout video clips for the training plan
              </p>
            </div>
            <div className="flex gap-4">
              <Link 
                href="/workout-plan" 
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                View Workout Plan
              </Link>
              <Link 
                href="/" 
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                PDF Builder
              </Link>
            </div>
          </div>
        </header>

        <div className="mb-8">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragActive 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            
            <svg 
              className="mx-auto h-16 w-16 text-gray-400 mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
              />
            </svg>
            
            <p className="text-lg mb-2">
              {uploading ? (
                <span className="text-blue-400">Uploading clips...</span>
              ) : (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Click to upload
                  </button>
                  {' '}or drag and drop video clips
                </>
              )}
            </p>
            <p className="text-sm text-gray-500">
              MP4, MOV, AVI files (clips will be saved to public/workout-clips)
            </p>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Stored Clips ({clips.length})
          </h2>
          
          {clips.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No clips uploaded yet. Upload some workout video clips to get started.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {clips.map((clip) => (
                <div
                  key={clip.path}
                  className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => setSelectedVideo(clip)}
                >
                  <div className="relative h-32 bg-black">
                    <video
                      src={clip.path}
                      className="w-full h-full object-cover"
                      muted
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteClip(clip.name);
                      }}
                      className="absolute top-2 right-2 bg-red-500/80 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm truncate">{clip.name}</h3>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>{formatFileSize(clip.size)}</span>
                      <span>{new Date(clip.uploaded).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedVideo && (
          <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedVideo(null)}
          >
            <div 
              className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedVideo.name}</h2>
                    <p className="text-gray-400 text-sm mt-1">
                      {formatFileSize(selectedVideo.size)} • Uploaded {new Date(selectedVideo.uploaded).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ✕
                  </button>
                </div>
                
                <video
                  src={selectedVideo.path}
                  className="w-full rounded-lg"
                  controls
                  autoPlay
                />
                
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedVideo.path);
                      alert('Path copied to clipboard!');
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Copy Path
                  </button>
                  <button
                    onClick={() => {
                      deleteClip(selectedVideo.name);
                      setSelectedVideo(null);
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete Clip
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}