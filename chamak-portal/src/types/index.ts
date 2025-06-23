export interface Area {
  id: string;
  name: string;
}

export interface Worker {
  id: string;
  name: string;
}

export type LightStatus = 'working' | 'maintenance' | 'off';

export interface Streetlight {
  id: string;
  status: LightStatus;
  reason?: string;
}

export interface AreaData {
  id: string;
  name: string;
  lights: Streetlight[];
}

export interface Notification {
  id: string;
  areaId: string;
  areaName: string;
  count: number;
  timestamp: number;
  read: boolean;
}

export interface AppState {
  areas: Area[];
  workers: Worker[];
  selectedArea: AreaData | null;
  notifications: Notification[];
  isLoading: boolean;
  showNotifications: boolean;
  showAreaSelection: boolean;
  showTaskAssignment: boolean;
}