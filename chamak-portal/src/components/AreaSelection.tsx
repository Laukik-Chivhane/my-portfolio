import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, MapPin } from 'lucide-react';

const AreaSelection: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { areas, isLoading } = state;
  
  const handleAreaSelect = (areaId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate loading data
    setTimeout(() => {
      dispatch({ type: 'SELECT_AREA', payload: areaId });
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 800);
  };
  
  const handleBack = () => {
    dispatch({ type: 'RETURN_HOME' });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={handleBack}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>Back to Home</span>
        </button>
        
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Select an Area
          </h2>
          
          <p className="text-gray-600 mb-8">
            Choose an area to monitor streetlights and assign maintenance tasks.
          </p>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {areas.map(area => (
                <button
                  key={area.id}
                  onClick={() => handleAreaSelect(area.id)}
                  className="p-6 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm hover:shadow text-left"
                >
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="font-medium text-gray-800">{area.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AreaSelection;