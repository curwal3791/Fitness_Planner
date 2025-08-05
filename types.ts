export enum ClassType {
  WATER_AEROBICS = "Water Aerobics",
  CYCLING = "Cycling/Spin",
  WEIGHTS = "Weights",
  HIIT = "HIIT",
}

export interface ClassOption {
  type: string;
  image: string;
  color: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
}

export interface RoutineItem extends Exercise {
  instanceId: number;
  duration: number; // in seconds
}

export interface SavedRoutine {
  id: number;
  name: string;
  classType: string;
  routine: RoutineItem[];
  date: string; // ISO string
}
