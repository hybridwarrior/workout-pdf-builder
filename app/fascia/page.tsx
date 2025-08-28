'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import React from 'react';

const WorkoutPDFGenerator = dynamic(() => import('@/components/WorkoutPDFGenerator'), {
  ssr: false
});

// SVG animations for exercises
const animations: { [key: string]: React.ReactElement } = {
  'towel-curls': (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <g className="animate-pulse">
        {/* Stick figure on ball of foot */}
        <circle cx="100" cy="40" r="15" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="100" y1="55" x2="100" y2="100" stroke="currentColor" strokeWidth="2" />
        <line x1="100" y1="100" x2="100" y2="160" stroke="currentColor" strokeWidth="2" />
        {/* Foot on ball */}
        <line x1="95" y1="160" x2="105" y2="160" stroke="currentColor" strokeWidth="3" />
        {/* Towel under toes */}
        <rect x="85" y="155" width="30" height="5" fill="gray" opacity="0.5" className="animate-pulse" />
        {/* Curling toes indication */}
        <path d="M 95 160 Q 90 155 95 150" stroke="red" strokeWidth="2" fill="none" className="animate-pulse" />
        <path d="M 105 160 Q 110 155 105 150" stroke="red" strokeWidth="2" fill="none" className="animate-pulse" />
        {/* Glute activation */}
        <circle cx="100" cy="90" r="5" fill="orange" opacity="0.6" className="animate-pulse" />
      </g>
    </svg>
  ),
  'single-leg-swing': (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <g>
        {/* Stick figure standing on one leg */}
        <circle cx="100" cy="40" r="15" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="100" y1="55" x2="100" y2="100" stroke="currentColor" strokeWidth="2" />
        {/* Standing leg */}
        <line x1="100" y1="100" x2="100" y2="160" stroke="currentColor" strokeWidth="2" />
        <line x1="95" y1="160" x2="105" y2="160" stroke="currentColor" strokeWidth="3" />
        {/* Swinging leg */}
        <g className="origin-[100px_100px] animate-[swing_2s_ease-in-out_infinite]">
          <line x1="100" y1="100" x2="120" y2="140" stroke="currentColor" strokeWidth="2" />
          <line x1="120" y1="140" x2="125" y2="155" stroke="currentColor" strokeWidth="2" />
        </g>
        {/* Glute activation on standing side */}
        <circle cx="95" cy="90" r="5" fill="orange" opacity="0.6" className="animate-pulse" />
      </g>
      <style jsx>{`
        @keyframes swing {
          0%, 100% { transform: rotate(-20deg); }
          50% { transform: rotate(20deg); }
        }
      `}</style>
    </svg>
  ),
  'pogos': (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <g className="animate-[bounce_0.5s_ease-in-out_infinite]">
        {/* Stick figure */}
        <circle cx="100" cy="40" r="15" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="100" y1="55" x2="100" y2="100" stroke="currentColor" strokeWidth="2" />
        {/* Arms */}
        <line x1="100" y1="70" x2="80" y2="85" stroke="currentColor" strokeWidth="2" />
        <line x1="100" y1="70" x2="120" y2="85" stroke="currentColor" strokeWidth="2" />
        {/* Legs - on balls of feet */}
        <line x1="100" y1="100" x2="90" y2="140" stroke="currentColor" strokeWidth="2" />
        <line x1="100" y1="100" x2="110" y2="140" stroke="currentColor" strokeWidth="2" />
        {/* Feet - toes curled */}
        <path d="M 85 140 Q 85 135 90 135" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M 105 140 Q 105 135 110 135" stroke="currentColor" strokeWidth="2" fill="none" />
        {/* Ground reference */}
        <line x1="50" y1="160" x2="150" y2="160" stroke="gray" strokeWidth="1" strokeDasharray="5,5" />
      </g>
    </svg>
  ),
  'single-leg-pogos': (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <g className="animate-[bounce_0.5s_ease-in-out_infinite]">
        {/* Stick figure on one leg */}
        <circle cx="100" cy="40" r="15" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="100" y1="55" x2="100" y2="100" stroke="currentColor" strokeWidth="2" />
        {/* Arms for balance */}
        <line x1="100" y1="70" x2="70" y2="75" stroke="currentColor" strokeWidth="2" />
        <line x1="100" y1="70" x2="130" y2="75" stroke="currentColor" strokeWidth="2" />
        {/* Standing leg on ball of foot */}
        <line x1="100" y1="100" x2="100" y2="140" stroke="currentColor" strokeWidth="2" />
        <path d="M 95 140 Q 95 135 100 135" stroke="currentColor" strokeWidth="2" fill="none" />
        {/* Lifted leg */}
        <line x1="100" y1="100" x2="115" y2="120" stroke="currentColor" strokeWidth="2" />
        <line x1="115" y1="120" x2="115" y2="130" stroke="currentColor" strokeWidth="2" />
        {/* Ground reference */}
        <line x1="50" y1="160" x2="150" y2="160" stroke="gray" strokeWidth="1" strokeDasharray="5,5" />
        {/* Glute activation */}
        <circle cx="95" cy="90" r="5" fill="orange" opacity="0.6" className="animate-pulse" />
      </g>
    </svg>
  ),
  'barefoot-gripping': (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <g>
        {/* Foot from side view */}
        <path d="M 60 140 L 140 140 L 135 150 L 65 150 Z" stroke="currentColor" strokeWidth="2" fill="none" />
        {/* Toes gripping */}
        <g className="animate-pulse">
          <path d="M 135 150 Q 140 155 135 160" stroke="red" strokeWidth="2" fill="none" />
          <path d="M 125 150 Q 130 155 125 160" stroke="red" strokeWidth="2" fill="none" />
          <path d="M 115 150 Q 120 155 115 160" stroke="red" strokeWidth="2" fill="none" />
        </g>
        {/* Arch activation */}
        <path d="M 80 150 Q 100 145 120 150" stroke="orange" strokeWidth="3" fill="none" className="animate-pulse" />
        {/* Ground */}
        <line x1="40" y1="160" x2="160" y2="160" stroke="gray" strokeWidth="2" />
        {/* Connection lines to glutes */}
        <path d="M 100 145 Q 100 100 100 50" stroke="orange" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" className="animate-pulse" />
        <circle cx="100" cy="50" r="8" fill="orange" opacity="0.6" className="animate-pulse" />
        <text x="110" y="55" fontSize="12" fill="orange">Glute</text>
      </g>
    </svg>
  )
};

const exercises = [
  {
    name: 'Towel Curls',
    duration: '30-60 seconds per foot',
    description: 'Stand on ball of foot with towel under toes. Curl toes to grip towel without letting heel drop.',
    animation: 'towel-curls',
    focus: 'Foot to glute connection',
    technique: [
      'Stand on ball of foot',
      'Place towel under toes',
      'Curl toes to grip towel',
      'Keep heel elevated',
      'Feel connection in glutes'
    ]
  },
  {
    name: 'Single Leg Balance & Swing',
    duration: '30 seconds per side',
    description: 'Grip ground with one foot while swinging the other leg. Test foot-to-glute connection.',
    animation: 'single-leg-swing',
    focus: 'Balance and glute activation',
    technique: [
      'Grip ground with standing foot',
      'Swing opposite leg freely',
      'Should feel fatigue in glute, not quad',
      'If feeling in quad/calf, connection is poor'
    ]
  },
  {
    name: 'Fascial Pogos',
    duration: '20-30 reps',
    description: 'Small jumps on balls of feet with toes curled. Similar to skipping for fascial elasticity.',
    animation: 'pogos',
    focus: 'Fascial elasticity',
    technique: [
      'Stay on balls of feet',
      'Curl toes during jumps',
      'Small, quick jumps',
      'Similar to skipping motion',
      'Builds athletic power'
    ]
  },
  {
    name: 'Single Leg Pogos',
    duration: '15-20 reps per leg',
    description: 'Single leg jumps on ball of foot. Transfers between legs like skipping.',
    animation: 'single-leg-pogos',
    focus: 'Unilateral power',
    technique: [
      'Ball of foot position',
      'Toes curled',
      'Quick ground contact',
      'Transfer between legs smoothly',
      'Maintain balance'
    ]
  },
  {
    name: 'Barefoot Ground Gripping',
    duration: 'Throughout workout',
    description: 'Practice gripping the ground with feet during all exercises for better connection.',
    animation: 'barefoot-gripping',
    focus: 'Foundation',
    technique: [
      'Spread toes wide',
      'Grip ground actively',
      'Feel arch engagement',
      'Improves balance massively',
      'Essential for athletic performance'
    ]
  }
];

export default function FasciaPage() {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [filterFocus, setFilterFocus] = useState<string>('all');

  const filteredExercises = filterFocus === 'all' 
    ? exercises 
    : exercises.filter(ex => ex.focus.toLowerCase().includes(filterFocus.toLowerCase()));

  const workoutExercises = exercises.map((ex, index) => ({
    id: index + 1,
    name: ex.name,
    duration: ex.duration,
    description: ex.description,
    technique: ex.technique
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-purple-800 mb-4">
            Hyper-Arch Fascial Training
          </h1>
          <p className="text-gray-600 mb-6">
            Develop foot-to-glute connection and fascial elasticity for improved athleticism and injury prevention.
            Based on barefoot training principles and fascial sling activation.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-100 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-700 mb-2">Key Principles</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Barefoot or minimal shoes</li>
                <li>• Toe gripping activation</li>
                <li>• Fascial spring loading</li>
                <li>• Daily practice recommended</li>
              </ul>
            </div>
            <div className="bg-pink-100 p-4 rounded-lg">
              <h3 className="font-semibold text-pink-700 mb-2">Benefits</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Improved balance</li>
                <li>• Better athletic performance</li>
                <li>• Reduced injury risk</li>
                <li>• Enhanced proprioception</li>
              </ul>
            </div>
            <div className="bg-indigo-100 p-4 rounded-lg">
              <h3 className="font-semibold text-indigo-700 mb-2">Focus Areas</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Foot-to-glute connection</li>
                <li>• Fascial elasticity</li>
                <li>• Balance & stability</li>
                <li>• Athletic power transfer</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4">
            <WorkoutPDFGenerator 
              workoutName="Hyper-Arch Fascial Training"
              exercises={workoutExercises}
              totalDuration="10-15 minutes"
              focusAreas="Foot-to-glute connection, Fascial elasticity, Balance"
              workoutType="training"
            />
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilterFocus('all')}
            className={`px-4 py-2 rounded-lg ${
              filterFocus === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Exercises
          </button>
          <button
            onClick={() => setFilterFocus('connection')}
            className={`px-4 py-2 rounded-lg ${
              filterFocus === 'connection'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Connection
          </button>
          <button
            onClick={() => setFilterFocus('elasticity')}
            className={`px-4 py-2 rounded-lg ${
              filterFocus === 'elasticity'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Elasticity
          </button>
          <button
            onClick={() => setFilterFocus('balance')}
            className={`px-4 py-2 rounded-lg ${
              filterFocus === 'balance'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Balance
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedExercise(exercise.name)}
            >
              <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-4 flex items-center justify-center">
                {animations[exercise.animation]}
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{exercise.name}</h2>
              <p className="text-purple-600 font-medium mb-2">{exercise.duration}</p>
              <p className="text-gray-600 text-sm mb-3">{exercise.description}</p>
              <div className="bg-purple-50 px-3 py-1 rounded-full inline-block">
                <span className="text-xs font-medium text-purple-700">{exercise.focus}</span>
              </div>
            </div>
          ))}
        </div>

        {selectedExercise && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedExercise(null)}>
            <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  {exercises.find(ex => ex.name === selectedExercise)?.name}
                </h2>
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="h-64 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-6 flex items-center justify-center">
                {animations[exercises.find(ex => ex.name === selectedExercise)?.animation || '']}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Duration</h3>
                  <p className="text-purple-600 font-medium">
                    {exercises.find(ex => ex.name === selectedExercise)?.duration}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-600">
                    {exercises.find(ex => ex.name === selectedExercise)?.description}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Focus</h3>
                  <p className="text-gray-600">
                    {exercises.find(ex => ex.name === selectedExercise)?.focus}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Technique Points</h3>
                  <ul className="space-y-2">
                    {exercises.find(ex => ex.name === selectedExercise)?.technique.map((point, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span className="text-gray-600">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}