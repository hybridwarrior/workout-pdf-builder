'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const WorkoutPDFGenerator = dynamic(() => import('@/components/WorkoutPDFGenerator'), {
  ssr: false
});

interface Exercise {
  id: number;
  name: string;
  type: 'treadmill' | 'strength';
  duration?: string;
  speed?: string;
  sets?: string;
  description: string;
  details: string[];
  svgAnimation?: string;
}

const exercises: Exercise[] = [
  {
    id: 1,
    name: "Deep Lunges & Knee Jumps",
    type: "treadmill",
    duration: "3 minutes",
    speed: "Level 3",
    description: "Dynamic warm-up with deep lunges and knee jumps",
    details: [
      "Start with deep lunges to warm up hip flexors",
      "Incorporate knee jumps for activation",
      "Maintain steady pace at Level 3",
      "Focus on full range of motion"
    ],
    svgAnimation: "lunge"
  },
  {
    id: 2,
    name: "Sidestep Gallop",
    type: "treadmill",
    duration: "2 minutes",
    speed: "Level 6",
    description: "Lateral movement pattern with stance switches",
    details: [
      "2 sidesteps to the right",
      "Switch stance quickly",
      "2 sidesteps to the left",
      "Maintain galloping rhythm throughout"
    ],
    svgAnimation: "sidestep"
  },
  {
    id: 3,
    name: "Steady State Run",
    type: "treadmill",
    duration: "3 minutes",
    speed: "Level 12",
    description: "Moderate intensity running phase",
    details: [
      "Build up to Level 12 pace",
      "Focus on breathing rhythm",
      "Maintain consistent form",
      "Prepare for intensity increases"
    ],
    svgAnimation: "run"
  },
  {
    id: 4,
    name: "High Intensity Interval",
    type: "treadmill",
    duration: "2 minutes",
    speed: "Level 15",
    description: "First high-intensity push",
    details: [
      "Increase to Level 15",
      "Maintain form under fatigue",
      "Focus on powerful strides",
      "Control breathing pattern"
    ],
    svgAnimation: "run"
  },
  {
    id: 5,
    name: "Recovery Run",
    type: "treadmill",
    duration: "2 minutes",
    speed: "Level 12",
    description: "Active recovery at moderate pace",
    details: [
      "Drop back to Level 12",
      "Recover breathing",
      "Maintain running form",
      "Prepare for next interval"
    ],
    svgAnimation: "run"
  },
  {
    id: 6,
    name: "Maximum Sprint",
    type: "treadmill",
    duration: "2 minutes",
    speed: "Level 17 (100%)",
    description: "First maximum effort sprint",
    details: [
      "Level 17 is your 100% max speed",
      "Full effort sprint",
      "Maintain form despite fatigue",
      "Push through mental barriers"
    ],
    svgAnimation: "sprint"
  },
  {
    id: 7,
    name: "Lower Recovery",
    type: "treadmill",
    duration: "2 minutes",
    speed: "Level 11",
    description: "Extended recovery phase",
    details: [
      "Drop to Level 11",
      "Focus on deep breathing",
      "Prepare for final sprint",
      "Stay mentally engaged"
    ],
    svgAnimation: "run"
  },
  {
    id: 8,
    name: "Final Maximum Sprint",
    type: "treadmill",
    duration: "2 minutes",
    speed: "Level 17 (100%)",
    description: "Second maximum effort sprint",
    details: [
      "Return to 100% max speed",
      "Final all-out effort",
      "Dig deep for last push",
      "Maintain sprint mechanics"
    ],
    svgAnimation: "sprint"
  },
  {
    id: 9,
    name: "Cool Down",
    type: "treadmill",
    duration: "Until recovered",
    speed: "Level 7",
    description: "Active recovery cool down",
    details: [
      "Gradual pace reduction",
      "Allow heart rate to drop",
      "Light jogging or walking",
      "Prepare for strength work"
    ],
    svgAnimation: "walk"
  },
  {
    id: 10,
    name: "Single & Double Leg Press",
    type: "strength",
    sets: "4 sets",
    description: "Progressive leg press with varied techniques",
    details: [
      "Weight: 25-30kg (30% of max)",
      "Set 1: 4 reps left, 4 reps right, 5 both legs",
      "Set 2: 5 both legs, 10 explosive",
      "Set 3: 5 negative, 10 explosive",
      "Set 4: 5 explosive, 5 left leg, 5 right leg"
    ],
    svgAnimation: "press"
  },
  {
    id: 11,
    name: "Hip Thrust Machine",
    type: "strength",
    sets: "4 sets × 10 reps",
    description: "Glute-focused hip thrusts",
    details: [
      "Set up with shoulders on pad",
      "Drive through heels",
      "Full hip extension at top",
      "Control the negative portion"
    ],
    svgAnimation: "thrust"
  },
  {
    id: 12,
    name: "Cable Rope Rotation",
    type: "strength",
    sets: "3-4 sets",
    description: "Single-arm rotational pulls",
    details: [
      "Weight similar to bench press",
      "Alternate arms each rep",
      "Focus on rotation, not bicep",
      "Keep core engaged throughout"
    ],
    svgAnimation: "rotation"
  },
  {
    id: 13,
    name: "Back Extension",
    type: "strength",
    sets: "3-4 sets",
    description: "Lower back and posterior chain strengthening",
    details: [
      "Lower body locked in place",
      "Bend forward with control",
      "Lift to parallel or slightly above",
      "Optional: hold weight plate"
    ],
    svgAnimation: "extension"
  },
  {
    id: 14,
    name: "Dynamic Stretching",
    type: "strength",
    duration: "5-10 minutes",
    description: "Complete workout with mobility work",
    details: [
      "Focus on legs and hips",
      "Include dynamic movements",
      "Gradually reduce intensity",
      "Full body stretch routine"
    ],
    svgAnimation: "stretch"
  }
];

const SVGAnimation = ({ type }: { type: string }) => {
  const animations: { [key: string]: React.ReactElement } = {
    lunge: (
      <svg width="120" height="120" viewBox="0 0 120 120" className="animate-pulse">
        <circle cx="60" cy="20" r="8" fill="currentColor"/>
        <line x1="60" y1="28" x2="60" y2="50" stroke="currentColor" strokeWidth="2"/>
        <line x1="60" y1="50" x2="75" y2="70" stroke="currentColor" strokeWidth="2"/>
        <line x1="75" y1="70" x2="75" y2="95" stroke="currentColor" strokeWidth="2"/>
        <line x1="60" y1="50" x2="40" y2="70" stroke="currentColor" strokeWidth="2"/>
        <line x1="40" y1="70" x2="35" y2="95" stroke="currentColor" strokeWidth="2"/>
        <line x1="60" y1="35" x2="45" y2="45" stroke="currentColor" strokeWidth="2"/>
        <line x1="60" y1="35" x2="75" y2="25" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    sidestep: (
      <svg width="120" height="120" viewBox="0 0 120 120" className="animate-bounce">
        <circle cx="60" cy="25" r="8" fill="currentColor"/>
        <line x1="60" y1="33" x2="60" y2="55" stroke="currentColor" strokeWidth="2"/>
        <line x1="60" y1="55" x2="45" y2="80" stroke="currentColor" strokeWidth="2"/>
        <line x1="45" y1="80" x2="42" y2="100" stroke="currentColor" strokeWidth="2"/>
        <line x1="60" y1="55" x2="75" y2="80" stroke="currentColor" strokeWidth="2"/>
        <line x1="75" y1="80" x2="78" y2="100" stroke="currentColor" strokeWidth="2"/>
        <line x1="60" y1="40" x2="40" y2="35" stroke="currentColor" strokeWidth="2"/>
        <line x1="60" y1="40" x2="80" y2="35" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    run: (
      <svg width="120" height="120" viewBox="0 0 120 120" className="animate-pulse">
        <circle cx="60" cy="25" r="8" fill="currentColor"/>
        <line x1="60" y1="33" x2="57" y2="55" stroke="currentColor" strokeWidth="2"/>
        <line x1="57" y1="55" x2="45" y2="75" stroke="currentColor" strokeWidth="2"/>
        <line x1="45" y1="75" x2="42" y2="95" stroke="currentColor" strokeWidth="2"/>
        <line x1="57" y1="55" x2="70" y2="72" stroke="currentColor" strokeWidth="2"/>
        <line x1="70" y1="72" x2="68" y2="92" stroke="currentColor" strokeWidth="2"/>
        <line x1="58" y1="40" x2="70" y2="48" stroke="currentColor" strokeWidth="2"/>
        <line x1="58" y1="40" x2="45" y2="32" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    sprint: (
      <svg width="120" height="120" viewBox="0 0 120 120" className="animate-spin-slow">
        <circle cx="60" cy="20" r="8" fill="currentColor"/>
        <line x1="60" y1="28" x2="55" y2="50" stroke="currentColor" strokeWidth="2"/>
        <line x1="55" y1="50" x2="35" y2="70" stroke="currentColor" strokeWidth="2"/>
        <line x1="35" y1="70" x2="30" y2="95" stroke="currentColor" strokeWidth="2"/>
        <line x1="55" y1="50" x2="75" y2="65" stroke="currentColor" strokeWidth="2"/>
        <line x1="75" y1="65" x2="70" y2="90" stroke="currentColor" strokeWidth="2"/>
        <line x1="57" y1="35" x2="75" y2="40" stroke="currentColor" strokeWidth="2"/>
        <line x1="57" y1="35" x2="40" y2="25" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    walk: (
      <svg width="120" height="120" viewBox="0 0 120 120" className="animate-pulse">
        <circle cx="60" cy="25" r="8" fill="currentColor"/>
        <line x1="60" y1="33" x2="60" y2="60" stroke="currentColor" strokeWidth="2"/>
        <line x1="60" y1="60" x2="55" y2="85" stroke="currentColor" strokeWidth="2"/>
        <line x1="55" y1="85" x2="55" y2="100" stroke="currentColor" strokeWidth="2"/>
        <line x1="60" y1="60" x2="65" y2="85" stroke="currentColor" strokeWidth="2"/>
        <line x1="65" y1="85" x2="65" y2="100" stroke="currentColor" strokeWidth="2"/>
        <line x1="60" y1="45" x2="50" y2="55" stroke="currentColor" strokeWidth="2"/>
        <line x1="60" y1="45" x2="70" y2="55" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    press: (
      <svg width="120" height="120" viewBox="0 0 120 120" className="animate-pulse">
        <circle cx="60" cy="85" r="8" fill="currentColor"/>
        <line x1="60" y1="77" x2="60" y2="50" stroke="currentColor" strokeWidth="2"/>
        <line x1="60" y1="50" x2="50" y2="30" stroke="currentColor" strokeWidth="2"/>
        <line x1="50" y1="30" x2="45" y2="15" stroke="currentColor" strokeWidth="2"/>
        <line x1="60" y1="50" x2="70" y2="30" stroke="currentColor" strokeWidth="2"/>
        <line x1="70" y1="30" x2="75" y2="15" stroke="currentColor" strokeWidth="2"/>
        <line x1="60" y1="60" x2="48" y2="65" stroke="currentColor" strokeWidth="2"/>
        <line x1="60" y1="60" x2="72" y2="65" stroke="currentColor" strokeWidth="2"/>
        <rect x="40" y="10" width="40" height="4" fill="currentColor"/>
      </svg>
    ),
    thrust: (
      <svg width="120" height="120" viewBox="0 0 120 120" className="animate-pulse">
        <circle cx="40" cy="60" r="8" fill="currentColor"/>
        <line x1="48" y1="60" x2="80" y2="60" stroke="currentColor" strokeWidth="2"/>
        <line x1="80" y1="60" x2="95" y2="80" stroke="currentColor" strokeWidth="2"/>
        <line x1="95" y1="80" x2="95" y2="100" stroke="currentColor" strokeWidth="2"/>
        <line x1="55" y1="63" x2="50" y2="75" stroke="currentColor" strokeWidth="2"/>
        <line x1="65" y1="63" x2="60" y2="75" stroke="currentColor" strokeWidth="2"/>
        <rect x="25" y="68" width="40" height="3" fill="currentColor"/>
      </svg>
    ),
    rotation: (
      <svg width="120" height="120" viewBox="0 0 120 120" className="animate-spin-slow">
        <circle cx="60" cy="30" r="8" fill="currentColor"/>
        <line x1="60" y1="38" x2="60" y2="70" stroke="currentColor" strokeWidth="2"/>
        <line x1="60" y1="70" x2="52" y2="95" stroke="currentColor" strokeWidth="2"/>
        <line x1="52" y1="95" x2="52" y2="110" stroke="currentColor" strokeWidth="2"/>
        <line x1="60" y1="70" x2="68" y2="95" stroke="currentColor" strokeWidth="2"/>
        <line x1="68" y1="95" x2="68" y2="110" stroke="currentColor" strokeWidth="2"/>
        <line x1="60" y1="50" x2="80" y2="45" stroke="currentColor" strokeWidth="2"/>
        <line x1="80" y1="45" x2="95" y2="40" stroke="currentColor" strokeWidth="2"/>
        <line x1="95" y1="40" x2="110" y2="30" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2"/>
      </svg>
    ),
    extension: (
      <svg width="120" height="120" viewBox="0 0 120 120" className="animate-pulse">
        <circle cx="45" cy="50" r="8" fill="currentColor"/>
        <line x1="53" y1="53" x2="85" y2="65" stroke="currentColor" strokeWidth="2"/>
        <line x1="85" y1="65" x2="95" y2="85" stroke="currentColor" strokeWidth="2"/>
        <line x1="95" y1="85" x2="98" y2="105" stroke="currentColor" strokeWidth="2"/>
        <line x1="55" y1="56" x2="45" y2="40" stroke="currentColor" strokeWidth="2"/>
        <line x1="55" y1="56" x2="45" y2="70" stroke="currentColor" strokeWidth="2"/>
        <rect x="80" y="68" width="30" height="4" fill="currentColor"/>
      </svg>
    ),
    stretch: (
      <svg width="120" height="120" viewBox="0 0 120 120" className="animate-pulse">
        <circle cx="60" cy="25" r="8" fill="currentColor"/>
        <line x1="60" y1="33" x2="60" y2="60" stroke="currentColor" strokeWidth="2"/>
        <line x1="60" y1="60" x2="45" y2="80" stroke="currentColor" strokeWidth="2"/>
        <line x1="45" y1="80" x2="35" y2="95" stroke="currentColor" strokeWidth="2"/>
        <line x1="60" y1="60" x2="75" y2="80" stroke="currentColor" strokeWidth="2"/>
        <line x1="75" y1="80" x2="70" y2="100" stroke="currentColor" strokeWidth="2"/>
        <line x1="60" y1="40" x2="35" y2="30" stroke="currentColor" strokeWidth="2"/>
        <line x1="35" y1="30" x2="30" y2="45" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )
  };

  return animations[type] || animations.run;
};

export default function JTRunLegsWorkout() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [activeSection, setActiveSection] = useState<'treadmill' | 'strength' | 'all'>('all');

  const treadmillExercises = exercises.filter(e => e.type === 'treadmill');
  const strengthExercises = exercises.filter(e => e.type === 'strength');
  const displayExercises = activeSection === 'all' ? exercises : 
                           activeSection === 'treadmill' ? treadmillExercises : strengthExercises;

  const totalTreadmillTime = treadmillExercises
    .filter(e => e.duration && e.duration !== "Until recovered")
    .reduce((acc, e) => acc + parseInt(e.duration || '0'), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <style jsx>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 3s linear infinite;
          }
        `}</style>
        
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
            JT Run-Legs Workout
          </h1>
          <p className="text-xl text-gray-300">
            High-intensity treadmill intervals combined with leg strength training
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Treadmill: {totalTreadmillTime} minutes | Strength: 20-25 minutes | Total: ~45-50 minutes
          </p>
        </header>

        <div className="flex justify-center mb-6">
          <WorkoutPDFGenerator
            workoutName="JT Run-Legs Workout"
            exercises={exercises}
            totalDuration="~45-50 minutes total"
            focusAreas="High-intensity treadmill intervals combined with leg strength training"
            workoutType="training"
          />
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveSection('all')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeSection === 'all' 
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All Exercises
          </button>
          <button
            onClick={() => setActiveSection('treadmill')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeSection === 'treadmill' 
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            🏃 Treadmill ({totalTreadmillTime} min)
          </button>
          <button
            onClick={() => setActiveSection('strength')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeSection === 'strength' 
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            💪 Strength Training
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayExercises.map((exercise) => (
            <div
              key={exercise.id}
              className={`rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 cursor-pointer border-2 ${
                exercise.type === 'treadmill' 
                  ? 'bg-gradient-to-br from-orange-900 to-red-900 border-orange-700 hover:border-orange-500' 
                  : 'bg-gradient-to-br from-purple-900 to-indigo-900 border-purple-700 hover:border-purple-500'
              }`}
              onClick={() => setSelectedExercise(exercise)}
            >
              <div className="relative h-32 flex items-center justify-center bg-black/30">
                <div className="text-orange-400">
                  <SVGAnimation type={exercise.svgAnimation || 'run'} />
                </div>
                {exercise.speed && (
                  <div className="absolute top-2 right-2 bg-red-600/80 px-2 py-1 rounded text-xs font-bold">
                    {exercise.speed}
                  </div>
                )}
                {exercise.sets && (
                  <div className="absolute top-2 right-2 bg-purple-600/80 px-2 py-1 rounded text-xs font-bold">
                    {exercise.sets}
                  </div>
                )}
                {exercise.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs">
                    {exercise.duration}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{exercise.name}</h3>
                <p className="text-sm text-gray-300">{exercise.description}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedExercise && (
          <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedExercise(null)}
          >
            <div 
              className={`rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ${
                selectedExercise.type === 'treadmill'
                  ? 'bg-gradient-to-br from-orange-900 to-gray-900'
                  : 'bg-gradient-to-br from-purple-900 to-gray-900'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{selectedExercise.name}</h2>
                    <p className="text-gray-300">{selectedExercise.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedExercise(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-black/50 rounded-lg p-8 flex items-center justify-center">
                    <div className="text-orange-400 scale-150">
                      <SVGAnimation type={selectedExercise.svgAnimation || 'run'} />
                    </div>
                  </div>
                  
                  <div>
                    {selectedExercise.duration && (
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold mb-2 text-orange-400">Duration</h3>
                        <p className="text-lg">{selectedExercise.duration}</p>
                      </div>
                    )}
                    
                    {selectedExercise.speed && (
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold mb-2 text-red-400">Speed</h3>
                        <p className="text-lg">{selectedExercise.speed}</p>
                      </div>
                    )}
                    
                    {selectedExercise.sets && (
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold mb-2 text-purple-400">Sets</h3>
                        <p className="text-lg">{selectedExercise.sets}</p>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-blue-400">
                        {selectedExercise.type === 'treadmill' ? 'Technique Points' : 'Exercise Details'}
                      </h3>
                      <ul className="space-y-2">
                        {selectedExercise.details.map((detail, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-400 mr-2 mt-1">•</span>
                            <span className="text-gray-300">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 bg-gradient-to-r from-orange-900 to-red-900 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">📋 Workout Notes</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-orange-400 mb-2">Treadmill Speed Reference</h3>
              <p className="text-sm">Level 17 = 100% of your maximum treadmill speed</p>
              <p className="text-sm">Adjust other levels proportionally to your fitness</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-orange-400 mb-2">Leg Press Weight</h3>
              <p className="text-sm">Use 25-30kg or 30% of your max lift</p>
              <p className="text-sm">Focus on control and explosive power</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}