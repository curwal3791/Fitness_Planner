import React, { useState, useMemo, useRef } from 'react';
import { Exercise } from '../types';
import { PlusIcon, TrashIcon, DragHandleIcon } from './icons';

interface ExerciseLibraryProps {
  exercises: Exercise[];
  onAddExercise: (exercise: Exercise) => void;
  onAddCustomExercise: (name: string, description: string) => void;
  onDeleteExercise: (exerciseId: string) => void;
  onReorderExercises: (reorderedExercises: Exercise[]) => void;
}

const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({ exercises, onAddExercise, onAddCustomExercise, onDeleteExercise, onReorderExercises }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseDesc, setNewExerciseDesc] = useState('');

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [exercises, searchTerm]);

  const handleSaveCustomExercise = () => {
    if (newExerciseName.trim() && newExerciseDesc.trim()) {
      onAddCustomExercise(newExerciseName.trim(), newExerciseDesc.trim());
      setNewExerciseName('');
      setNewExerciseDesc('');
      setIsModalOpen(false);
    }
  };

  const handleDelete = (e: React.MouseEvent, exercise: Exercise) => {
    e.stopPropagation();
    if(window.confirm(`Are you sure you want to delete the exercise "${exercise.name}"?`)) {
      onDeleteExercise(exercise.id);
    }
  };

  const canReorder = searchTerm === '';

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, position: number) => {
    dragItem.current = position;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLIElement>, position: number) => {
    dragOverItem.current = position;
  };

  const handleDrop = () => {
    if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) {
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }
    const reorderedList = [...exercises];
    const draggedItemContent = reorderedList.splice(dragItem.current, 1)[0];
    reorderedList.splice(dragOverItem.current, 0, draggedItemContent);
    
    onReorderExercises(reorderedList);

    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleDragEnd = () => {
    dragItem.current = null;
    dragOverItem.current = null;
  };


  return (
    <>
      <div className="bg-white rounded-xl shadow-md flex flex-col h-full print:hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-brand-dark">Exercise Library</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-brand-secondary text-brand-primary font-semibold text-sm rounded-md hover:bg-blue-200 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              <span>New Exercise</span>
            </button>
          </div>
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mt-3 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent"
          />
        </div>
        <div className="flex-grow overflow-y-auto p-2">
          <ul className="space-y-2" onDrop={canReorder ? handleDrop : undefined} onDragOver={e => e.preventDefault()}>
            {filteredExercises.map((exercise, index) => (
              <li 
                key={exercise.id}
                draggable={canReorder}
                onDragStart={canReorder ? (e) => handleDragStart(e, index) : undefined}
                onDragEnter={canReorder ? (e) => handleDragEnter(e, index) : undefined}
                onDragEnd={canReorder ? handleDragEnd : undefined}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="group flex items-center justify-between p-3 bg-brand-secondary rounded-lg hover:bg-blue-200 transition-colors">
                  <div 
                    className={`cursor-move text-gray-400 hover:text-gray-600 mr-3 ${!canReorder ? 'invisible' : ''}`}
                    title="Drag to reorder"
                  >
                    <DragHandleIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-grow mr-2">
                    <p className="font-semibold text-brand-dark">{exercise.name}</p>
                    <p className="text-sm text-gray-600">{exercise.description}</p>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <button
                      onClick={(e) => handleDelete(e, exercise)}
                      className="p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      aria-label={`Delete ${exercise.name}`}
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onAddExercise(exercise)}
                      className="p-2 rounded-full bg-brand-primary text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
                      aria-label={`Add ${exercise.name} to routine`}
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Add a New Exercise</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Exercise Name"
                value={newExerciseName}
                onChange={(e) => setNewExerciseName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                autoFocus
              />
              <textarea
                placeholder="Exercise Description"
                value={newExerciseDesc}
                onChange={(e) => setNewExerciseDesc(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent h-24"
              />
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium rounded-md hover:bg-gray-100">Cancel</button>
              <button onClick={handleSaveCustomExercise} className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-md hover:bg-blue-700">Save Exercise</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExerciseLibrary;
