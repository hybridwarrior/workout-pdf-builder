'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const WorkoutPDFGenerator = dynamic(() => import('@/components/WorkoutPDFGenerator'), {
  ssr: false
});

interface Exercise {
  id: number;
  name: string;
  videoPath: string;
  duration: string;
  description: string;
  technique: string[];
}

const exercises: Exercise[] = [
  {
    id: 1,
    name: "Torso Twists",
    videoPath: "/workout-clips/01-twists.mp4",
    duration: "30 seconds",
    description: "Dynamic rotation to warm up the core and spine",
    technique: [
      "Plant your feet shoulder-width apart",
      "Keep your head still and facing forward",
      "Rotate shoulders while keeping hips in place",
      "Maintain controlled movement throughout"
    ]
  },
  {
    id: 2,
    name: "Knee Raises with Twists",
    videoPath: "/workout-clips/02-knee-twists.mp4",
    duration: "30 seconds",
    description: "Combines knee lifts with rotational movement for core activation",
    technique: [
      "Twist to your right, bring right knee up",
      "Twist to your left, bring left knee up",
      "Keep opposite arm engaged",
      "Feel the stretch through your back"
    ]
  },
  {
    id: 3,
    name: "Opposite Toe Touches",
    videoPath: "/workout-clips/03-toe-touches.mp4",
    duration: "30 seconds",
    description: "Cross-body stretching for flexibility and coordination",
    technique: [
      "Touch your toe with the opposite hand",
      "Keep legs straight if possible",
      "Alternate sides smoothly",
      "Engage core throughout the movement"
    ]
  },
  {
    id: 4,
    name: "Hip Circles",
    videoPath: "/workout-clips/04-hip-circles-new.mp4",
    duration: "30s clockwise, 30s counter",
    description: "Mobilizes hip joints and lower back",
    technique: [
      "Keep upper body relatively still",
      "Make large, controlled circles",
      "30 seconds clockwise",
      "30 seconds counterclockwise"
    ]
  },
  {
    id: 5,
    name: "Side Bends",
    videoPath: "/workout-clips/05-side-bends.mp4",
    duration: "30 seconds",
    description: "Lateral spine mobility and oblique stretching",
    technique: [
      "Go straight down the side",
      "Avoid leaning forward or back",
      "Push hips out to the opposite side",
      "Feel the stretch along your side"
    ]
  },
  {
    id: 6,
    name: "Forward & Back Bends",
    videoPath: "/workout-clips/06-forward-back-bends.mp4",
    duration: "30 seconds",
    description: "Full spine articulation and flexibility",
    technique: [
      "Reach up and extend back",
      "Fold forward touching the floor",
      "Curl your back like a Jefferson Curl",
      "Fully stretch front and back of body"
    ]
  },
  {
    id: 7,
    name: "Chest Opens & Back Slaps",
    videoPath: "/workout-clips/07-chest-back-slaps-new.mp4",
    duration: "30 seconds",
    description: "Upper body warm-up for chest and shoulders",
    technique: [
      "Palms facing forward, open chest wide",
      "Slap your back with alternating arms",
      "Alternate which arm goes over top",
      "Keep movement dynamic and fluid"
    ]
  },
  {
    id: 8,
    name: "Shoulder Circles",
    videoPath: "/workout-clips/08-shoulder-circles.mp4",
    duration: "30 seconds each direction",
    description: "Shoulder joint mobility and warming",
    technique: [
      "Big circles backwards",
      "Big circles forwards",
      "One arm forward, one back",
      "Switch directions smoothly"
    ]
  },
  {
    id: 9,
    name: "Pogos",
    videoPath: "/workout-clips/09-pogos-proper.mp4",
    duration: "30 seconds",
    description: "Plyometric bouncing for foot and ankle activation",
    technique: [
      "Curl your toes up (dorsiflexion)",
      "Stay on balls of feet",
      "Minimal ground contact time",
      "Keep hands on hips for balance"
    ]
  },
  {
    id: 10,
    name: "Jump Twists",
    videoPath: "/workout-clips/11-skaters.mp4",
    duration: "30 seconds",
    description: "Rotational jumping for coordination",
    technique: [
      "Keep toes curled up",
      "Jump and rotate hips",
      "Land softly on balls of feet",
      "Maintain same foot position"
    ]
  },
  {
    id: 11,
    name: "Skaters",
    videoPath: "/workout-clips/10-jump-twists.mp4",
    duration: "30 seconds",
    description: "Lateral plyometric movement for agility",
    technique: [
      "Jump side to side",
      "Land on one foot at a time",
      "Stay on balls of feet",
      "Use arms for balance"
    ]
  },
  {
    id: 12,
    name: "Single Leg Pogos",
    videoPath: "/workout-clips/12-single-leg-pogos.mp4",
    duration: "30 seconds each leg",
    description: "Unilateral plyometric for glute-foot connection",
    technique: [
      "One foot out, bounce on other",
      "Feel glute tension on standing leg",
      "Strengthens fascial connection",
      "Switch legs after 30 seconds"
    ]
  }
];

export default function WorkoutPlan() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Dynamic Warm-Up Routine
          </h1>
          <p className="text-xl text-gray-300">
            Complete fascia-focused warm-up for injury prevention and athleticism
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Total Duration: ~8 minutes | 12 exercises
          </p>
        </header>

        <div className="flex justify-center mb-8">
          <WorkoutPDFGenerator
            workoutName="Dynamic Warm-Up Routine"
            exercises={exercises}
            totalDuration="~8 minutes | 12 exercises"
            focusAreas="Fascia-focused warm-up for injury prevention and athleticism"
            workoutType="warm-up"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-700 hover:border-blue-500"
              onClick={() => setSelectedExercise(exercise)}
            >
              <div className="relative h-48 bg-black">
                <video
                  src={exercise.videoPath}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs">
                  {exercise.duration}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <h3 className="text-lg font-semibold">{exercise.name}</h3>
                </div>
              </div>
              <div className="p-4">
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
              className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{selectedExercise.name}</h2>
                    <p className="text-gray-400">{selectedExercise.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedExercise(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-black rounded-lg overflow-hidden">
                    <video
                      src={selectedExercise.videoPath}
                      className="w-full"
                      autoPlay
                      loop
                      muted
                      controls
                    />
                  </div>
                  
                  <div>
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold mb-2 text-blue-400">Duration</h3>
                      <p className="text-lg">{selectedExercise.duration}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-blue-400">Technique Points</h3>
                      <ul className="space-y-2">
                        {selectedExercise.technique.map((point, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-400 mr-2 mt-1">•</span>
                            <span className="text-gray-300">{point}</span>
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
      </div>
    </div>
  );
}