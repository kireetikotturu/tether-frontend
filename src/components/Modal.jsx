import React from 'react';

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-darkcard rounded-lg shadow-lg p-6 max-w-sm w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-primary text-2xl font-bold"
        >×</button>
        {children}
      </div>
    </div>
  );
}