import React from 'react';
import { CloseIcon } from './icons';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div 
                className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md space-y-4 transform transition-transform duration-300 scale-100"
                onClick={e => e.stopPropagation()} // Prevent clicks inside the modal from closing it
            >
                <div className="flex justify-between items-center">
                    <h2 id="modal-title" className="text-xl font-bold text-white">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
