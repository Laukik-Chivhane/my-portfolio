import React, { useState, useRef, useEffect } from 'react';
import { LightStatus } from '../types';
import { AlertCircle, X } from 'lucide-react';

interface IssueModalProps {
  onSubmit: (reason: string) => void;
  onCancel: () => void;
  statusType: LightStatus;
}

const IssueModal: React.FC<IssueModalProps> = ({ onSubmit, onCancel, statusType }) => {
  const [reason, setReason] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    // Focus the input when modal opens
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Close on escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(reason);
  };
  
  const getStatusInfo = () => {
    switch (statusType) {
      case 'maintenance':
        return {
          title: 'Maintenance Required',
          color: 'text-amber-500',
          icon: <AlertCircle className="h-6 w-6 text-amber-500" />
        };
      case 'off':
        return {
          title: 'Light Out',
          color: 'text-red-500',
          icon: <AlertCircle className="h-6 w-6 text-red-500" />
        };
      default:
        return {
          title: 'Issue Report',
          color: 'text-gray-700',
          icon: <AlertCircle className="h-6 w-6 text-gray-500" />
        };
    }
  };
  
  const statusInfo = getStatusInfo();
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            {statusInfo.icon}
            <h3 className={`ml-2 text-lg font-semibold ${statusInfo.color}`}>
              {statusInfo.title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Please provide details about the issue:
            </label>
            <textarea
              ref={inputRef}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe the issue..."
              required
            />
          </div>
          
          <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueModal;