'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';

interface Exercise {
  id: number;
  name: string;
  duration?: string;
  speed?: string;
  sets?: string;
  description: string;
  details?: string[];
  technique?: string[];
  type?: 'treadmill' | 'strength';
  videoPath?: string;
}

interface WorkoutPDFGeneratorProps {
  workoutName: string;
  exercises: Exercise[];
  totalDuration?: string;
  focusAreas?: string;
  workoutType?: 'warm-up' | 'training';
}

export default function WorkoutPDFGenerator({ 
  workoutName, 
  exercises, 
  totalDuration,
  focusAreas,
  workoutType = 'training'
}: WorkoutPDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = () => {
    setIsGenerating(true);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set up mobile-friendly dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Color scheme
    const primaryColor: [number, number, number] = workoutType === 'warm-up' ? [66, 153, 225] : [251, 146, 60];
    const secondaryColor: [number, number, number] = workoutType === 'warm-up' ? [147, 51, 234] : [220, 38, 38];
    
    // Header with gradient effect
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    // Title
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text(workoutName, pageWidth / 2, 20, { align: 'center' });
    
    // Subtitle
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    if (totalDuration) {
      pdf.text(totalDuration, pageWidth / 2, 30, { align: 'center' });
    }
    
    yPosition = 50;

    // Summary box
    if (focusAreas) {
      pdf.setFillColor(240, 240, 240);
      pdf.roundedRect(margin, yPosition, contentWidth, 20, 3, 3, 'F');
      pdf.setTextColor(50, 50, 50);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const focusText = pdf.splitTextToSize(`Focus: ${focusAreas}`, contentWidth - 10);
      pdf.text(focusText, margin + 5, yPosition + 7);
      yPosition += 25;
    }

    // Exercise sections
    exercises.forEach((exercise, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = margin;
      }

      // Exercise number badge
      const badgeColor = exercise.type === 'treadmill' ? primaryColor : secondaryColor;
      pdf.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
      pdf.circle(margin + 5, yPosition + 5, 4, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(String(index + 1), margin + 5, yPosition + 7, { align: 'center' });

      // Exercise name
      pdf.setTextColor(30, 30, 30);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(exercise.name, margin + 15, yPosition + 7);

      // Duration/Speed/Sets badge
      if (exercise.duration || exercise.speed || exercise.sets) {
        const badgeText = exercise.duration || exercise.sets || '';
        const badgeWidth = pdf.getTextWidth(badgeText) + 6;
        const fillColor: [number, number, number] = exercise.type === 'treadmill' ? [254, 243, 199] : [237, 233, 254];
        pdf.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
        pdf.roundedRect(pageWidth - margin - badgeWidth - 5, yPosition + 2, badgeWidth, 8, 2, 2, 'F');
        const textColor: [number, number, number] = exercise.type === 'treadmill' ? [217, 119, 6] : [109, 40, 217];
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.text(badgeText, pageWidth - margin - 8, yPosition + 7, { align: 'right' });
      }

      yPosition += 12;

      // Description
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const descLines = pdf.splitTextToSize(exercise.description, contentWidth - 10);
      pdf.text(descLines, margin + 5, yPosition);
      yPosition += descLines.length * 5;

      // Speed info for treadmill exercises
      if (exercise.speed) {
        pdf.setFillColor(255, 237, 213);
        pdf.roundedRect(margin + 5, yPosition, contentWidth - 10, 8, 2, 2, 'F');
        pdf.setTextColor(194, 65, 12);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Speed: ${exercise.speed}`, margin + 8, yPosition + 5);
        yPosition += 10;
      }

      // Technique/Details points
      const points = exercise.technique || exercise.details || [];
      if (points.length > 0) {
        pdf.setTextColor(70, 70, 70);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        
        points.forEach(point => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = margin;
          }
          
          // Bullet point
          const bulletColor = exercise.type === 'treadmill' ? primaryColor : secondaryColor;
          pdf.setFillColor(bulletColor[0], bulletColor[1], bulletColor[2]);
          pdf.circle(margin + 7, yPosition + 2, 1, 'F');
          
          // Text
          const pointLines = pdf.splitTextToSize(point, contentWidth - 20);
          pdf.text(pointLines, margin + 12, yPosition + 4);
          yPosition += pointLines.length * 4 + 2;
        });
      }

      // Add space between exercises
      yPosition += 8;

      // Divider
      if (index < exercises.length - 1) {
        pdf.setDrawColor(220, 220, 220);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 5;
      }
    });

    // Footer on last page
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Generated by Workout PDF Builder', pageWidth / 2, pageHeight - 10, { align: 'center' });
    pdf.text(`© ${new Date().getFullYear()} Oracle Boxing`, pageWidth / 2, pageHeight - 6, { align: 'center' });

    // Save the PDF
    const filename = `${workoutName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
    
    setIsGenerating(false);
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className={`
        px-6 py-3 rounded-lg font-semibold transition-all
        ${isGenerating 
          ? 'bg-gray-400 cursor-not-allowed' 
          : workoutType === 'warm-up'
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
            : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
        }
      `}
    >
      {isGenerating ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating PDF...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF
        </span>
      )}
    </button>
  );
}