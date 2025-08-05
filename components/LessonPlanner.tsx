import React, { useRef } from 'react';
import { RoutineItem } from '../types';
import { DragHandleIcon, TrashIcon } from './icons';

interface LessonPlannerProps {
  routine: RoutineItem[];
  onUpdateRoutine: (routine: RoutineItem[]) => void;
  className: string;
}

const RoutineItemCard: React.FC<{
  item: RoutineItem;
  index: number;
  onRemove: (instanceId: number) => void;
  onDurationChange: (instanceId: number, duration: number) => void;
  onDragStart: (e: React.DragEvent<HTMLLIElement>, index: number) => void;
  onDragEnter: (e: React.DragEvent<HTMLLIElement>, index: number) => void;
  onDragEnd: (e: React.DragEvent<HTMLLIElement>) => void;
}> = ({ item, index, onRemove, onDurationChange, onDragStart, onDragEnter, onDragEnd }) => {
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <li
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4"
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragEnter={(e) => onDragEnter(e, index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="cursor-move text-gray-400 hover:text-gray-600" title="Drag to reorder">
        <DragHandleIcon className="w-6 h-6" />
      </div>
      <div className="flex-grow">
        <p className="font-bold text-brand-dark">{item.name}</p>
        <p className="text-sm text-gray-500">{item.description}</p>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          min="0"
          max="600"
          value={item.duration}
          onChange={(e) => onDurationChange(item.instanceId, Math.min(600, parseInt(e.target.value, 10) || 0))}
          className="w-24 p-2 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-brand-primary focus:border-transparent"
          aria-label={`Duration for ${item.name} in seconds`}
        />
        <span className="text-gray-600">sec</span>
      </div>
      <div className="hidden print:block text-lg font-medium text-brand-dark">
        {formatTime(item.duration)}
      </div>
      <button
        onClick={() => onRemove(item.instanceId)}
        className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors print:hidden"
        aria-label={`Remove ${item.name}`}
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </li>
  );
};

const LessonPlanner: React.FC<LessonPlannerProps> = ({ routine, onUpdateRoutine, className }) => {
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, position: number) => {
    dragItem.current = position;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML); // For firefox
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLIElement>, position: number) => {
    dragOverItem.current = position;
  };

  const handleDrop = () => {
    if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) return;

    const newRoutine = [...routine];
    const dragItemContent = newRoutine.splice(dragItem.current, 1)[0];
    newRoutine.splice(dragOverItem.current, 0, dragItemContent);

    onUpdateRoutine(newRoutine);
  };

  const handleDragEnd = () => {
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleRemoveItem = (instanceId: number) => {
    const newRoutine = routine.filter(item => item.instanceId !== instanceId);
    onUpdateRoutine(newRoutine);
  };

  const handleDurationChange = (instanceId: number, duration: number) => {
    const newRoutine = routine.map(item =>
      item.instanceId === instanceId ? { ...item, duration } : item
    );
    onUpdateRoutine(newRoutine);
  };

  const totalDuration = routine.reduce((sum, item) => sum + item.duration, 0);
  const formatTotalTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    let timeString = '';
    if (hours > 0) timeString += `${hours}h `;
    if (minutes > 0 || hours > 0) timeString += `${minutes}m `;
    timeString += `${seconds}s`;
    return timeString.trim();
  };

  return (
    <div className={`${className} bg-gray-50 rounded-xl shadow-md flex flex-col h-full`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-brand-dark">Lesson Plan</h2>
          <div className="text-right">
            <p className="font-bold text-brand-dark text-lg">{formatTotalTime(totalDuration)}</p>
            <p className="text-sm text-gray-500">Total Duration</p>
          </div>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        {routine.length === 0 ? (
          <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Add exercises from the library to start.</p>
          </div>
        ) : (
          <ul className="space-y-4" onDrop={handleDrop} onDragOver={e => e.preventDefault()}>
            {routine.map((item, index) => (
              <RoutineItemCard
                key={item.instanceId}
                item={item}
                index={index}
                onRemove={handleRemoveItem}
                onDurationChange={handleDurationChange}
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
                onDragEnd={handleDragEnd}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LessonPlanner;
