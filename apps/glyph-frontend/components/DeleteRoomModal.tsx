"use client";

import { useState } from 'react';
import { Button } from './ui/Button';

interface Room {
  id: string;
  slug: string;
  createdAt: string;
}

interface DeleteRoomModalProps {
  isOpen: boolean;
  room: Room | null;
  onClose: () => void;
  onDelete: (roomId: string) => Promise<void>;
  loading?: boolean;
}

export default function DeleteRoomModal({ isOpen, room, onClose, onDelete, loading = false }: DeleteRoomModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState<string>('');

  const expectedText = room?.slug || '';
  const isConfirmValid = confirmText === expectedText;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!room) return;
    
    if (!isConfirmValid) {
      setError('Please type the board name exactly to confirm deletion');
      return;
    }

    try {
      setError('');
      await onDelete(room.id);
      // Reset form on success
      setConfirmText('');
    } catch (error: any) {
      setError(error.message || 'Failed to delete room');
    }
  };

  const handleClose = () => {
    setConfirmText('');
    setError('');
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-md mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-3xl blur-2xl transform scale-110"></div>
        
        <div className="relative bg-gray-800/90 backdrop-blur-xl border border-red-700/50 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform rotate-6 shadow-xl">
              <svg className="w-8 h-8 text-white transform -rotate-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Delete Board
            </h2>
            <p className="text-gray-400 text-sm">
              This action cannot be undone
            </p>
          </div>

          {/* Decorative elements around modal */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-full animate-pulse"></div>
          <div className="absolute -top-2 -right-6 w-4 h-4 bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-full animate-pulse delay-300"></div>
          <div className="absolute -bottom-4 -left-6 w-6 h-6 bg-gradient-to-r from-red-500/30 to-pink-500/30 rounded-full animate-pulse delay-500"></div>
          <div className="absolute -bottom-2 -right-4 w-5 h-5 bg-gradient-to-r from-pink-500/30 to-red-500/30 rounded-full animate-pulse delay-700"></div>

          {/* Warning Message */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-red-200 font-semibold text-sm mb-1">Warning: Permanent Deletion</h3>
                <div className="space-y-1 text-xs text-red-300">
                  <div>• Board "<strong>{room.slug}</strong>" will be permanently deleted</div>
                  <div>• All drawings and shapes will be lost forever</div>
                  <div>• This action cannot be undone</div>
                  <div>• Created on {formatDate(room.createdAt)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type the board name to confirm deletion:
              </label>
              <div className="mb-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
                <code className="text-sm text-blue-300 font-mono">{expectedText}</code>
              </div>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => {
                  setConfirmText(e.target.value);
                  setError('');
                }}
                placeholder={`Type "${expectedText}" to confirm`}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200"
                disabled={loading}
              />
              {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex space-x-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                loading={loading}
                disabled={!isConfirmValid}
              >
                Delete Forever
              </Button>
            </div>
          </form>

          {/* Creative visual elements */}
          <div className="absolute top-4 right-4 opacity-20">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-60"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Additional floating elements around modal */}
        <div className="absolute -top-8 -left-8 w-6 h-6 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute -top-12 -right-4 w-4 h-8 bg-gradient-to-b from-orange-500/20 to-red-500/20 rounded-lg transform rotate-15"></div>
        <div className="absolute -bottom-8 -right-8 w-8 h-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full animate-pulse delay-1200"></div>
        <div className="absolute -bottom-6 -left-10 w-5 h-5 border-2 border-dashed border-red-400/40 rounded transform rotate-45"></div>
      </div>
    </div>
  );
}
