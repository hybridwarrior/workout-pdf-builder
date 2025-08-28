'use client';

import { useState } from 'react';

interface ImageGeneratorProps {
  transcript: string;
  generatedImages: Map<number, string>;
  onImagesGenerated: (images: Map<number, string>) => void;
}

export default function ImageGenerator({ 
  generatedImages, 
  onImagesGenerated 
}: ImageGeneratorProps) {
  const [selectedText, setSelectedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [imagePosition, setImagePosition] = useState<number>(0);

  const handleGenerateImage = async () => {
    if (!selectedText) {
      alert('Please select some text from the transcript first');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: selectedText,
          position: imagePosition 
        }),
      });

      if (!response.ok) {
        throw new Error('Image generation failed');
      }

      const data = await response.json();
      const newImages = new Map(generatedImages);
      newImages.set(imagePosition, data.imageUrl);
      onImagesGenerated(newImages);
      
      setSelectedText('');
      setImagePosition(imagePosition + 1);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please check your Gemini API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Generate Workout Images
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Describe the exercise or movement
          </label>
          <input
            type="text"
            value={selectedText}
            onChange={(e) => setSelectedText(e.target.value)}
            placeholder="E.g., 'Person doing push-ups' or copy text from transcript"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          onClick={handleGenerateImage}
          disabled={isGenerating || !selectedText}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg 
                   hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                   transition-colors"
        >
          {isGenerating ? 'Generating...' : 'Generate Image'}
        </button>
        
        {generatedImages.size > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Generated Images ({generatedImages.size})
            </p>
            <div className="grid grid-cols-2 gap-2">
              {Array.from(generatedImages.entries()).map(([pos, url]) => (
                <div key={pos} className="relative group">
                  <img 
                    src={url} 
                    alt={`Generated image ${pos + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    onClick={() => {
                      const newImages = new Map(generatedImages);
                      newImages.delete(pos);
                      onImagesGenerated(newImages);
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded 
                             opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}