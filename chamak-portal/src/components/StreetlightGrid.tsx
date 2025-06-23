import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import IssueModal from './IssueModal';
import { LightStatus, Streetlight } from '../types';

interface StreetlightItemProps {
  light: Streetlight;
  onStatusChange: (id: string, status: LightStatus, reason?: string) => void;
}

const StreetlightItem: React.FC<StreetlightItemProps> = ({ light, onStatusChange }) => {
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [tempStatus, setTempStatus] = useState<LightStatus | null>(null);
  
  const getStatusColor = (status: LightStatus) => {
    switch (status) {
      case 'working': return 'bg-emerald-500';
      case 'maintenance': return 'bg-amber-500';
      case 'off': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };
  
  const handleStatusChange = (newStatus: LightStatus) => {
    if (newStatus !== 'working') {
      setTempStatus(newStatus);
      setShowIssueModal(true);
    } else {
      onStatusChange(light.id, newStatus);
    }
  };
  
  const handleIssueSubmit = (reason: string) => {
    if (tempStatus) {
      onStatusChange(light.id, tempStatus, reason);
      setTempStatus(null);
    }
    setShowIssueModal(false);
  };
  
  const handleIssueCancel = () => {
    setTempStatus(null);
    setShowIssueModal(false);
  };
  
  return (
    <>
      <div className="relative group">
        <div 
          className={`h-20 w-20 md:h-24 md:w-24 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-105 ${getStatusColor(light.status)} shadow-md`}
          onClick={() => handleStatusChange(light.status === 'working' ? 'off' : 'working')}
        >
          <div className="h-4 w-4 bg-white rounded-full"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-black bg-opacity-70 rounded-full h-full w-full flex items-center justify-center">
            <div className="flex flex-col gap-1">
              <button 
                className={`p-1 rounded-full ${light.status === 'working' ? 'bg-emerald-500' : 'bg-white'}`} 
                onClick={() => handleStatusChange('working')}
              >
                <CheckCircle className="h-4 w-4 text-white" />
              </button>
              <button 
                className={`p-1 rounded-full ${light.status === 'maintenance' ? 'bg-amber-500' : 'bg-white'}`} 
                onClick={() => handleStatusChange('maintenance')}
              >
                <AlertCircle className="h-4 w-4 text-amber-500" />
              </button>
              <button 
                className={`p-1 rounded-full ${light.status === 'off' ? 'bg-red-500' : 'bg-white'}`} 
                onClick={() => handleStatusChange('off')}
              >
                <AlertCircle className="h-4 w-4 text-red-500" />
              </button>
            </div>
          </div>
        </div>
        
        {light.reason && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-0.5 bg-gray-800 text-white text-xs rounded-full">
            ⓘ
          </div>
        )}
      </div>
      
      {showIssueModal && (
        <IssueModal 
          onSubmit={handleIssueSubmit} 
          onCancel={handleIssueCancel} 
          statusType={tempStatus || 'off'}
        />
      )}
    </>
  );
};

const StreetlightGrid: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { selectedArea } = state;
  
  if (!selectedArea) return null;
  
  const nonWorkingLights = selectedArea.lights.filter(light => light.status !== 'working');
  const nonWorkingCount = nonWorkingLights.length;
  
  const handleStatusChange = (lightId: string, status: LightStatus, reason?: string) => {
    dispatch({ 
      type: 'UPDATE_LIGHT_STATUS', 
      payload: { lightId, status, reason }
    });
  };
  
  const handleBack = () => {
    dispatch({ type: 'RETURN_HOME' });
  };
  
  const handleAssignTasks = () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    setTimeout(() => {
      dispatch({ type: 'SHOW_TASK_ASSIGNMENT' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 500);
  };
  
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              {selectedArea.name}
            </h2>
            
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <span className="text-red-500 font-medium">{nonWorkingCount}</span>
              <span className="text-gray-600"> lights need attention</span>
            </div>
          </div>
          
          {nonWorkingCount > 0 ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mr-2" />
                <p className="text-red-700">
                  Attention needed: {nonWorkingCount} lights require maintenance in this area.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-6">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mr-2" />
                <p className="text-emerald-700">
                  All lights are working properly in this area.
                </p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-5 gap-4 justify-items-center mb-8">
            {selectedArea.lights.map(light => (
              <StreetlightItem 
                key={light.id} 
                light={light} 
                onStatusChange={handleStatusChange} 
              />
            ))}
          </div>
          
          {nonWorkingCount > 0 && (
            <div className="flex justify-end">
              <button 
                onClick={handleAssignTasks}
                className="flex items-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-colors"
              >
                Assign Tasks
                <ChevronRight className="h-5 w-5 ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StreetlightGrid;