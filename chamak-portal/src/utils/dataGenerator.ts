import { LightStatus, Streetlight } from '../types';

const getPredefinedStatus = (areaId: string, lightIndex: number): LightStatus => {
  if (areaId === '2' && lightIndex === 8) { // Pratap Nagar, 9th light
    return 'off';
  }
  if (areaId === '4' && lightIndex === 1) { // Vasant Nagar, 2nd light
    return 'maintenance';
  }
  return 'working';
};

export const generateLights = (count: number, areaId: string): Streetlight[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `light-${index + 1}`,
    status: getPredefinedStatus(areaId, index)
  }));
};