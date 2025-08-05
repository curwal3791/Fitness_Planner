import { ClassType, Exercise, ClassOption } from './types';

export const INITIAL_CLASS_OPTIONS: ClassOption[] = [
  { type: ClassType.WATER_AEROBICS, image: 'https://images.pexels.com/photos/863977/pexels-photo-863977.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2', color: 'bg-blue-500' },
  { type: ClassType.CYCLING, image: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2', color: 'bg-red-500' },
  { type: ClassType.WEIGHTS, image: 'https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2', color: 'bg-gray-700' },
  { type: ClassType.HIIT, image: 'https://images.pexels.com/photos/3757374/pexels-photo-3757374.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2', color: 'bg-orange-500' },
];

export const INITIAL_EXERCISES_BY_CLASS: Record<string, Exercise[]> = {
  [ClassType.WATER_AEROBICS]: [
    { id: 'wa1', name: 'Water Jogging', description: 'Jog in place in the water.' },
    { id: 'wa2', name: 'Flutter Kicks', description: 'Hold onto the side and kick.' },
    { id: 'wa3', name: 'Water Jacks', description: 'Jumping jacks in the water.' },
    { id: 'wa4', name: 'Tuck Jumps', description: 'Bring knees to chest.' },
    { id: 'wa5', name: 'Leg Lifts', description: 'Raise one leg at a time.' },
    { id: 'wa6', name: 'Arm Curls', description: 'Use water resistance to curl arms.' },
    { id: 'wa7', name: 'Cross Country Ski', description: 'Mimic skiing motion.' },
  ],
  [ClassType.CYCLING]: [
    { id: 'cy1', name: 'Seated Flat', description: 'Warm-up pace, low resistance.' },
    { id: 'cy2', name: 'Seated Climb', description: 'High resistance, seated position.' },
    { id: 'cy3', name: 'Standing Climb', description: 'High resistance, standing.' },
    { id: 'cy4', name: 'Sprints', description: 'Low resistance, max speed.' },
    { id: 'cy5', name: 'Jumps', description: 'Transition between seated and standing.' },
    { id: 'cy6', name: 'Hill Repeats', description: 'Alternate climbs and recovery.' },
    { id: 'cy7', name: 'Cool Down', description: 'Easy pace, low resistance.' },
  ],
  [ClassType.WEIGHTS]: [
    { id: 'wt1', name: 'Bicep Curls', description: 'Dumbbell curls for biceps.' },
    { id: 'wt2', name: 'Tricep Extensions', description: 'Overhead tricep extensions.' },
    { id: 'wt3', name: 'Squats', description: 'Goblet or barbell squats.' },
    { id: 'wt4', name: 'Deadlifts', description: 'Conventional or Romanian deadlifts.' },
    { id: 'wt5', name: 'Bench Press', description: 'Flat or incline bench press.' },
    { id: 'wt6', name: 'Overhead Press', description: 'Standing or seated shoulder press.' },
    { id: 'wt7', name: 'Bent-Over Rows', description: 'Dumbbell or barbell rows.' },
  ],
  [ClassType.HIIT]: [
    { id: 'hi1', name: 'Burpees', description: 'Full body explosive movement.' },
    { id: 'hi2', name: 'High Knees', description: 'Run in place, lifting knees high.' },
    { id: 'hi3', name: 'Mountain Climbers', description: 'Plank position, alternating knee drives.' },
    { id: 'hi4', name: 'Jump Squats', description: 'Explosive squat jumps.' },
    { id: 'hi5', name: 'Kettlebell Swings', description: 'Hip-hinge explosive movement.' },
    { id: 'hi6', name: 'Push-ups', description: 'Standard or modified push-ups.' },
    { id: 'hi7', name: 'Plank', description: 'Hold a high or low plank position.' },
  ],
};
