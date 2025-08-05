
import React from 'react';
import { SavedRoutine } from '../types';
import { ChevronLeftIcon, TrashIcon } from './icons';

interface SavedRoutinesProps {
  routines: SavedRoutine[];
  onLoad: (id: number) => void;
  onDelete: (id: number) => void;
  onBack: () => void;
}

const SavedRoutines: React.FC<SavedRoutinesProps> = ({ routines, onLoad, onDelete, onBack }) => {
  return (
    <div className="bg-brand-light min-h-screen">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <header className="mb-8">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-brand-primary mb-4"
            >
              <ChevronLeftIcon className="w-5 h-5" />
              <span className="font-medium">Back to Class Selection</span>
            </button>
          <h1 className="text-4xl font-bold text-brand-dark">Saved Routines</h1>
          <p className="text-lg text-gray-600 mt-2">Load a previously saved lesson plan to use or edit it.</p>
        </header>

        {routines.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-brand-dark">No Saved Routines Yet</h2>
            <p className="text-gray-500 mt-2">Create a lesson plan and save it to see it here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {routines.map((routine) => (
              <div key={routine.id} className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between transition-shadow hover:shadow-lg">
                <div>
                  <h3 className="text-xl font-bold text-brand-dark">{routine.name}</h3>
                  <p className="text-gray-600">
                    <span className="font-semibold">{routine.classType}</span> - Saved on {new Date(routine.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">{routine.routine.length} exercises</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => onLoad(routine.id)}
                    className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                  >
                    Load
                  </button>
                  <button 
                    onClick={() => onDelete(routine.id)}
                    className="p-2 text-gray-500 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
                    aria-label="Delete routine"
                  >
                    <TrashIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedRoutines;
