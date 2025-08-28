'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';

interface PDFExporterProps {
  transcript: string;
  generatedImages: Map<number, string>;
}

export default function PDFExporter({ transcript, generatedImages }: PDFExporterProps) {
  const [title, setTitle] = useState('Workout Guide');
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    setIsExporting(true);
    
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - (margin * 2);
      let yPosition = margin;
      
      pdf.setFontSize(20);
      pdf.text(title, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;
      
      pdf.setFontSize(12);
      const lines = pdf.splitTextToSize(transcript, maxWidth);
      
      for (let i = 0; i < lines.length; i++) {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        
        pdf.text(lines[i], margin, yPosition);
        yPosition += 7;
        
        const imageAtPosition = generatedImages.get(Math.floor(i / 10));
        if (imageAtPosition && i % 10 === 0) {
          if (yPosition + 60 > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          
          try {
            pdf.addImage(imageAtPosition, 'PNG', margin, yPosition, 80, 60);
            yPosition += 65;
          } catch (error) {
            console.error('Error adding image to PDF:', error);
          }
        }
      }
      
      pdf.save(`${title.toLowerCase().replace(/ /g, '-')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Export to PDF
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            PDF Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          onClick={exportToPDF}
          disabled={isExporting || !transcript}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg 
                   hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                   transition-colors"
        >
          {isExporting ? 'Exporting...' : 'Export to PDF'}
        </button>
        
        {generatedImages.size > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            PDF will include {generatedImages.size} generated image(s)
          </p>
        )}
      </div>
    </div>
  );
}