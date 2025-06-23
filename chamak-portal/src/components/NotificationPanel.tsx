import React from 'react';
import { useAppContext } from '../context/AppContext';
import { formatDistanceToNow } from '../utils/dateFormatter';

const NotificationPanel: React.FC = () => {
  const { state } = useAppContext();
  const { notifications } = state;
  
  if (notifications.length === 0) {
    return (
      <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50">
        <div className="p-4 text-center text-gray-500">
          No notifications
        </div>
      </div>
    );
  }
  
  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50">
      <div className="p-3 bg-gray-50 border-b border-gray-200">
        <h3 className="font-medium text-gray-700">Notifications</h3>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.map(notification => (
          <div 
            key={notification.id}
            className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                </span>
              </div>
              
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {notification.areaName}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {notification.count} {notification.count === 1 ? 'light' : 'lights'} need attention
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {formatDistanceToNow(notification.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;