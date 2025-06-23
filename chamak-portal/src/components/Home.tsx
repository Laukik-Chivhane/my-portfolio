import React from 'react';
import { useAppContext } from '../context/AppContext';
import { BellRing, Lightbulb } from 'lucide-react';
import NotificationPanel from './NotificationPanel';

const Home: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { notifications, showNotifications } = state;
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleStartClick = () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    setTimeout(() => {
      dispatch({ type: 'SHOW_AREA_SELECTION' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 500);
  };
  
  const toggleNotifications = () => {
    dispatch({ type: 'TOGGLE_NOTIFICATIONS' });
    if (!showNotifications && unreadCount > 0) {
      dispatch({ type: 'MARK_NOTIFICATIONS_READ' });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="w-full py-6 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Lightbulb className="h-8 w-8 text-amber-500 mr-2" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Chamak Portal</h1>
        </div>
        
        <div className="relative">
          <button 
            className="p-2 rounded-full hover:bg-gray-200 transition-colors relative"
            onClick={toggleNotifications}
            aria-label="Notifications"
          >
            <BellRing className="h-6 w-6 text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          
          {showNotifications && <NotificationPanel />}
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 w-full max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Streetlight Monitoring System
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Monitor and manage public infrastructure with real-time updates and maintenance tracking.
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 w-full max-w-md text-center">
          <div className="bg-amber-100 rounded-full p-5 inline-block mb-6">
            <Lightbulb className="h-10 w-10 text-amber-500" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Chamak Portal</h3>
          <p className="text-gray-600 mb-8">
            Start by selecting an area to monitor the status of streetlights and assign maintenance tasks.
          </p>
          
          <button 
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleStartClick}
          >
            Begin Monitoring
          </button>
        </div>
      </main>
      
      <footer className="w-full py-6 text-center text-gray-500">
        <p>© 2025 Chamak Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;