'use client';

interface TranscriptEditorProps {
  transcript: string;
  onTranscriptChange: (transcript: string) => void;
}

export default function TranscriptEditor({ 
  transcript, 
  onTranscriptChange 
}: TranscriptEditorProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Edit Transcript
      </h2>
      
      <textarea
        value={transcript}
        onChange={(e) => onTranscriptChange(e.target.value)}
        placeholder="Your workout transcript will appear here after upload..."
        className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   placeholder-gray-500 dark:placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      
      {transcript && (
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {transcript.split(' ').length} words
          </span>
          <button
            onClick={() => navigator.clipboard.writeText(transcript)}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Copy to clipboard
          </button>
        </div>
      )}
    </div>
  );
}