import React from 'react';
import { useAppContext } from './context/AppContext';
import Home from './components/Home';
import AreaSelection from './components/AreaSelection';
import StreetlightGrid from './components/StreetlightGrid';
import TaskAssignment from './components/TaskAssignment';

function App() {
  const { state } = useAppContext();
  const { selectedArea, isLoading, showAreaSelection, showTaskAssignment } = state;
  
  const LoadingOverlay = () => (
    isLoading ? (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    ) : null
  );
  
  const renderScreen = () => {
    if (showTaskAssignment && selectedArea) {
      return <TaskAssignment />;
    }
    
    if (showAreaSelection) {
      return <AreaSelection />;
    }
    
    if (selectedArea) {
      return <StreetlightGrid />;
    }
    
    return <Home />;
  };
  
  return (
    <>
      {renderScreen()}
      <LoadingOverlay />
    </>
  );
}

export default App;