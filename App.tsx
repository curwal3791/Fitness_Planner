import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ClassOption, Exercise, RoutineItem, SavedRoutine } from './types';
import { INITIAL_EXERCISES_BY_CLASS, INITIAL_CLASS_OPTIONS } from './constants';
import ClassSelector from './components/ClassSelector';
import ExerciseLibrary from './components/ExerciseLibrary';
import LessonPlanner from './components/LessonPlanner';
import SavedRoutines from './components/SavedRoutines';
import { PrintIcon, ChevronLeftIcon, SaveIcon } from './components/icons';

type View = 'class-selector' | 'planner' | 'saved-routines';

const App: React.FC = () => {
  const [view, setView] = useState<View>('class-selector');
  const [classOptions, setClassOptions] = useState<ClassOption[]>(() => {
    const saved = localStorage.getItem('fitness-planner-classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASS_OPTIONS;
  });
  const [exercisesByClass, setExercisesByClass] = useState<Record<string, Exercise[]>>(() => {
    const saved = localStorage.getItem('fitness-planner-exercises');
    return saved ? JSON.parse(saved) : INITIAL_EXERCISES_BY_CLASS;
  });
  const [savedRoutines, setSavedRoutines] = useState<SavedRoutine[]>(() => {
    const saved = localStorage.getItem('fitness-planner-routines');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [routine, setRoutine] = useState<RoutineItem[]>([]);
  const [classDate, setClassDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveRoutineName, setSaveRoutineName] = useState('');

  useEffect(() => {
    localStorage.setItem('fitness-planner-classes', JSON.stringify(classOptions));
  }, [classOptions]);

  useEffect(() => {
    localStorage.setItem('fitness-planner-exercises', JSON.stringify(exercisesByClass));
  }, [exercisesByClass]);

  useEffect(() => {
    localStorage.setItem('fitness-planner-routines', JSON.stringify(savedRoutines));
  }, [savedRoutines]);

  const handleSelectClass = useCallback((classType: string) => {
    setSelectedClass(classType);
    setRoutine([]);
    setClassDate(new Date().toISOString().split('T')[0]);
    setView('planner');
  }, []);
  
  const handleAddNewClass = (className: string) => {
    const newClass: ClassOption = {
      type: className,
      image: `https://picsum.photos/seed/${encodeURIComponent(className)}/400/300`,
      color: 'bg-teal-500',
    };
    setClassOptions(prev => [...prev, newClass]);
    setExercisesByClass(prev => ({...prev, [className]: [] }));
  };

  const handleDeleteClass = (classTypeToDelete: string) => {
    setClassOptions(prev => prev.filter(c => c.type !== classTypeToDelete));
    setExercisesByClass(prev => {
        const newExercises = {...prev};
        delete newExercises[classTypeToDelete];
        return newExercises;
    });
    if (selectedClass === classTypeToDelete) {
        handleBackToSelection();
    }
  };
  
  const handleAddCustomExercise = (name: string, description: string) => {
    if (!selectedClass) return;
    const newExercise: Exercise = {
      id: `${selectedClass.toLowerCase().slice(0,2)}${Date.now()}`,
      name,
      description,
    };
    setExercisesByClass(prev => ({
      ...prev,
      [selectedClass]: [...(prev[selectedClass] || []), newExercise]
    }));
  };

  const handleDeleteExercise = (exerciseIdToDelete: string) => {
    if (!selectedClass) return;
    setExercisesByClass(prev => ({
        ...prev,
        [selectedClass]: (prev[selectedClass] || []).filter(ex => ex.id !== exerciseIdToDelete),
    }));
  };

  const handleReorderExercises = (reorderedExercises: Exercise[]) => {
    if (!selectedClass) return;
    setExercisesByClass(prev => ({
      ...prev,
      [selectedClass]: reorderedExercises,
    }));
  };

  const handleBackToSelection = () => {
    setView('class-selector');
    setSelectedClass(null);
    setRoutine([]);
  };

  const handleAddExercise = useCallback((exercise: Exercise) => {
    const newRoutineItem: RoutineItem = {
      ...exercise,
      instanceId: Date.now() + Math.random(),
      duration: 60,
    };
    setRoutine(prevRoutine => [...prevRoutine, newRoutineItem]);
  }, []);

  const handleUpdateRoutine = useCallback((updatedRoutine: RoutineItem[]) => {
    setRoutine(updatedRoutine);
  }, []);
  
  const handleSaveRoutine = () => {
    if (!saveRoutineName.trim() || !selectedClass) return;
    const newSavedRoutine: SavedRoutine = {
      id: Date.now(),
      name: saveRoutineName,
      classType: selectedClass,
      routine: routine,
      date: classDate,
    };
    setSavedRoutines(prev => [...prev, newSavedRoutine]);
    setIsSaveModalOpen(false);
    setSaveRoutineName('');
  };

  const handleLoadRoutine = (routineId: number) => {
    const routineToLoad = savedRoutines.find(r => r.id === routineId);
    if (routineToLoad) {
      setSelectedClass(routineToLoad.classType);
      setRoutine(routineToLoad.routine);
      setClassDate(routineToLoad.date);
      setView('planner');
    }
  };

  const handleDeleteRoutine = (routineId: number) => {
    if (window.confirm('Are you sure you want to delete this routine?')) {
      setSavedRoutines(prev => prev.filter(r => r.id !== routineId));
    }
  };

  const exercisesForClass = useMemo(() => {
    return selectedClass ? exercisesByClass[selectedClass] || [] : [];
  }, [selectedClass, exercisesByClass]);

  const handlePrint = () => window.print();

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
  
  const renderContent = () => {
    switch(view) {
      case 'saved-routines':
        return <SavedRoutines 
          routines={savedRoutines}
          onLoad={handleLoadRoutine}
          onDelete={handleDeleteRoutine}
          onBack={() => setView('class-selector')}
        />;
      case 'planner':
        if (!selectedClass) {
          setView('class-selector');
          return null;
        }
        return (
          <div className="bg-brand-light min-h-screen font-sans">
            <header className="bg-white shadow-sm p-4 print:hidden">
              <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  <button onClick={handleBackToSelection} className="flex items-center space-x-2 text-gray-600 hover:text-brand-primary">
                    <ChevronLeftIcon className="w-5 h-5" />
                    <span className="font-medium">All Classes</span>
                  </button>
                  <h1 className="text-2xl font-bold text-brand-dark">{selectedClass}</h1>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <input type="date" value={classDate} onChange={e => setClassDate(e.target.value)} className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary"/>
                    <button onClick={() => setIsSaveModalOpen(true)} disabled={routine.length === 0} className="p-2 text-gray-600 rounded-lg hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed" aria-label="Save Routine"><SaveIcon className="w-6 h-6"/></button>
                    <button onClick={handlePrint} disabled={routine.length === 0} className="flex items-center space-x-2 px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                      <PrintIcon className="w-5 h-5" />
                      <span>Print</span>
                    </button>
                </div>
              </div>
            </header>

            <main className="p-4 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto print:block">
                <div className="print:hidden">
                  <ExerciseLibrary 
                    exercises={exercisesForClass} 
                    onAddExercise={handleAddExercise} 
                    onAddCustomExercise={handleAddCustomExercise} 
                    onDeleteExercise={handleDeleteExercise}
                    onReorderExercises={handleReorderExercises}
                   />
                </div>
                <div className="print:w-full print:shadow-none print:p-0">
                  <div className="hidden print:block mb-8">
                    <div className="flex justify-between items-baseline">
                        <h1 className="text-3xl font-bold text-brand-dark">{selectedClass} Lesson Plan</h1>
                        <p className="text-lg text-gray-600">{new Date(classDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <p className="text-xl text-gray-700 mt-2">Total Duration: <span className="font-bold">{formatTotalTime(totalDuration)}</span></p>
                    <hr className="my-4"/>
                  </div>
                  <LessonPlanner routine={routine} onUpdateRoutine={handleUpdateRoutine} className="print:shadow-none print:border-none" />
                </div>
              </div>
            </main>
          </div>
        );
      case 'class-selector':
      default:
        return <ClassSelector 
          classOptions={classOptions}
          onSelectClass={handleSelectClass} 
          onAddNewClass={handleAddNewClass}
          onDeleteClass={handleDeleteClass}
          onShowSavedRoutines={() => setView('saved-routines')} 
        />;
    }
  };

  return <>
    {renderContent()}
    {isSaveModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold text-brand-dark mb-4">Save Lesson Plan</h2>
          <input
            type="text"
            placeholder="e.g., Monday Morning Burn"
            value={saveRoutineName}
            onChange={(e) => setSaveRoutineName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            autoFocus
          />
          <div className="flex justify-end space-x-4 mt-6">
            <button onClick={() => setIsSaveModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium rounded-md hover:bg-gray-100">Cancel</button>
            <button onClick={handleSaveRoutine} className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-md hover:bg-blue-700">Save</button>
          </div>
        </div>
      </div>
    )}
  </>;
};

export default App;
