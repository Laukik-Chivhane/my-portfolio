import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, Users, CheckCircle } from 'lucide-react';

const TaskAssignment: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { workers, selectedArea } = state;
  const [selectedWorker, setSelectedWorker] = useState<string>('');
  const [success, setSuccess] = useState(false);
  
  if (!selectedArea) return null;
  
  const nonWorkingLights = selectedArea.lights.filter(light => light.status !== 'working');
  
  const handleBack = () => {
    dispatch({ type: 'RETURN_HOME' });
  };
  
  const handleWorkerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWorker(e.target.value);
  };
  
  const handleAssign = () => {
    if (!selectedWorker) return;
    
    // Show success message
    setSuccess(true);
    
    // Simulate API call
    setTimeout(() => {
      dispatch({ 
        type: 'ASSIGN_WORKER', 
        payload: { workerId: selectedWorker }
      });
    }, 1500);
  };
  
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-6">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Task Assigned Successfully!</h2>
          <p className="text-gray-600 mb-8">
            Maintenance task for {selectedArea.name} has been assigned. The worker will be notified.
          </p>
          <div className="animate-pulse mb-6 h-1 w-full bg-emerald-200 rounded"></div>
          <p className="text-sm text-gray-500">Redirecting to home screen...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={handleBack}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>Back</span>
        </button>
        
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Assign Maintenance Task
          </h2>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Area: {selectedArea.name}</h3>
            <p className="text-gray-600">
              {nonWorkingLights.length} {nonWorkingLights.length === 1 ? 'light needs' : 'lights need'} attention
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-8">
            <div className="flex items-start">
              <Users className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5 mr-2" />
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Assign Worker</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Select a maintenance worker to fix the identified issues in this area.
                </p>
                
                <div className="mt-2">
                  <select
                    value={selectedWorker}
                    onChange={handleWorkerChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select a worker</option>
                    {workers.map(worker => (
                      <option key={worker.id} value={worker.id}>
                        {worker.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleAssign}
              disabled={!selectedWorker}
              className={`py-2 px-6 font-medium rounded-lg shadow transition-colors ${
                selectedWorker 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Assign Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskAssignment;