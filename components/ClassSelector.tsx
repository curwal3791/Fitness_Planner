import React, { useState } from 'react';
import { ClassOption } from '../types';
import { FolderOpenIcon, PlusIcon, TrashIcon } from './icons';
import { INITIAL_CLASS_OPTIONS } from '../constants';

interface ClassSelectorProps {
  classOptions: ClassOption[];
  onSelectClass: (classType: string) => void;
  onAddNewClass: (className: string) => void;
  onShowSavedRoutines: () => void;
  onDeleteClass: (classType: string) => void;
}

const ClassSelector: React.FC<ClassSelectorProps> = ({ classOptions, onSelectClass, onAddNewClass, onShowSavedRoutines, onDeleteClass }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  
  const defaultClassTypes = new Set(INITIAL_CLASS_OPTIONS.map(c => c.type));

  const handleAddClass = () => {
    if (newClassName.trim()) {
      onAddNewClass(newClassName.trim());
      setNewClassName('');
      setIsModalOpen(false);
    }
  };
  
  const handleDeleteClass = (e: React.MouseEvent, classType: string) => {
    e.stopPropagation(); // Prevent the main button click event
    if (window.confirm(`Are you sure you want to delete the "${classType}" class? This will also remove all its associated exercises.`)) {
        onDeleteClass(classType);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-brand-light p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">Fitness Lesson Planner</h1>
          <p className="text-lg text-gray-600 mb-6">Choose a class type to start, or load a saved plan.</p>
          <button
            onClick={onShowSavedRoutines}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-accent text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
          >
            <FolderOpenIcon className="w-6 h-6" />
            <span>Load a Saved Routine</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
          {classOptions.map((option) => {
            const isDefault = defaultClassTypes.has(option.type);
            return (
              <div key={option.type} className="relative group">
                <button
                  onClick={() => onSelectClass(option.type)}
                  className="w-full text-left overflow-hidden rounded-lg shadow-lg transform transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-brand-primary focus:ring-opacity-50"
                >
                  <img src={option.image} alt={option.type} className="w-full h-80 object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
                  <div className={`absolute bottom-0 left-0 right-0 p-4 text-white ${option.color} bg-opacity-90`}>
                    <h2 className="text-2xl font-bold">{option.type}</h2>
                  </div>
                </button>
                {!isDefault && (
                  <button
                    onClick={(e) => handleDeleteClass(e, option.type)}
                    aria-label={`Delete ${option.type} class`}
                    className="absolute top-3 right-3 z-10 p-2 bg-white/70 backdrop-blur-sm rounded-full text-gray-700 hover:bg-red-500 hover:text-white transition-all scale-90 opacity-50 group-hover:scale-100 group-hover:opacity-100"
                  >
                    <TrashIcon className="w-5 h-5" />
  
                  </button>
                )}
              </div>
            )
          })}
          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-300 rounded-lg shadow-sm hover:border-brand-primary hover:text-brand-primary transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
            style={{ minHeight: '320px' }}
          >
            <PlusIcon className="w-12 h-12 text-gray-400 group-hover:text-brand-primary transition-colors" />
            <span className="mt-2 text-xl font-semibold text-gray-600 group-hover:text-brand-primary transition-colors">Add New Class</span>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Add a New Class Type</h2>
            <input
              type="text"
              placeholder="e.g., Yoga, Pilates..."
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              autoFocus
            />
            <div className="flex justify-end space-x-4 mt-6">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium rounded-md hover:bg-gray-100">Cancel</button>
              <button onClick={handleAddClass} className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-md hover:bg-blue-700">Add Class</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClassSelector;
