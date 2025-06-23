import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, AreaData, LightStatus, Notification, Streetlight } from '../types';
import { generateLights } from '../utils/dataGenerator';
import { initialAreas, initialWorkers } from '../data/initialData';

const initialState: AppState = {
  areas: initialAreas,
  workers: initialWorkers,
  selectedArea: null,
  notifications: [],
  isLoading: false,
  showNotifications: false,
  showAreaSelection: false,
  showTaskAssignment: false
};

type ActionType = 
  | { type: 'SELECT_AREA'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_LIGHT_STATUS'; payload: { lightId: string; status: LightStatus; reason?: string } }
  | { type: 'TOGGLE_NOTIFICATIONS' }
  | { type: 'MARK_NOTIFICATIONS_READ' }
  | { type: 'ASSIGN_WORKER'; payload: { workerId: string } }
  | { type: 'RETURN_HOME' }
  | { type: 'SHOW_AREA_SELECTION' }
  | { type: 'SHOW_TASK_ASSIGNMENT' };

interface AppContextProps {
  state: AppState;
  dispatch: React.Dispatch<ActionType>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const appReducer = (state: AppState, action: ActionType): AppState => {
  switch (action.type) {
    case 'SELECT_AREA': {
      if (action.payload === '') {
        return {
          ...state,
          showAreaSelection: true
        };
      }

      const areaId = action.payload;
      const area = state.areas.find(a => a.id === areaId);
      
      if (!area) return state;
      
      const areaData: AreaData = {
        id: area.id,
        name: area.name,
        lights: generateLights(15, area.id)
      };
      
      const nonWorkingLights = areaData.lights.filter(light => light.status !== 'working');
      
      if (nonWorkingLights.length > 0) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          areaId: area.id,
          areaName: area.name,
          count: nonWorkingLights.length,
          timestamp: Date.now(),
          read: false
        };
        
        return {
          ...state,
          selectedArea: areaData,
          showAreaSelection: false,
          showTaskAssignment: false,
          notifications: [newNotification, ...state.notifications]
        };
      }
      
      return {
        ...state,
        selectedArea: areaData,
        showAreaSelection: false,
        showTaskAssignment: false
      };
    }
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
      
    case 'UPDATE_LIGHT_STATUS': {
      if (!state.selectedArea) return state;
      
      const { lightId, status, reason } = action.payload;
      const updatedLights = state.selectedArea.lights.map(light => 
        light.id === lightId ? { ...light, status, reason } : light
      );
      
      const updatedArea = { ...state.selectedArea, lights: updatedLights };
      
      const nonWorkingLights = updatedLights.filter(light => light.status !== 'working');
      let updatedNotifications = [...state.notifications];
      
      const existingNotificationIndex = updatedNotifications.findIndex(
        n => n.areaId === state.selectedArea!.id
      );
      
      if (nonWorkingLights.length > 0) {
        const notificationData = {
          id: Date.now().toString(),
          areaId: state.selectedArea.id,
          areaName: state.selectedArea.name,
          count: nonWorkingLights.length,
          timestamp: Date.now(),
          read: false
        };
        
        if (existingNotificationIndex >= 0) {
          updatedNotifications[existingNotificationIndex] = notificationData;
        } else {
          updatedNotifications = [notificationData, ...updatedNotifications];
        }
      } else if (existingNotificationIndex >= 0) {
        updatedNotifications.splice(existingNotificationIndex, 1);
      }
      
      return {
        ...state,
        selectedArea: updatedArea,
        notifications: updatedNotifications
      };
    }
    
    case 'TOGGLE_NOTIFICATIONS':
      return {
        ...state,
        showNotifications: !state.showNotifications
      };
      
    case 'MARK_NOTIFICATIONS_READ': {
      const updatedNotifications = state.notifications.map(notification => ({
        ...notification,
        read: true
      }));
      
      return {
        ...state,
        notifications: updatedNotifications
      };
    }
    
    case 'ASSIGN_WORKER': {
      return {
        ...state,
        selectedArea: null,
        showAreaSelection: false,
        showTaskAssignment: false
      };
    }
    
    case 'RETURN_HOME':
      return {
        ...state,
        selectedArea: null,
        showAreaSelection: false,
        showTaskAssignment: false
      };

    case 'SHOW_AREA_SELECTION':
      return {
        ...state,
        showAreaSelection: true,
        showTaskAssignment: false
      };

    case 'SHOW_TASK_ASSIGNMENT':
      return {
        ...state,
        showTaskAssignment: true
      };
      
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};