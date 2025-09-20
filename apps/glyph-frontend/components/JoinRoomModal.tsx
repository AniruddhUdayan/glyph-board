"use client";

import { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://api.glyph-board.xyz';

interface Room {
  id: string;
  slug: string;
  createdAt: string;
  adminId: string;
  admin: {
    name: string;
    email: string;
  };
}

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (roomId: string) => Promise<void>;
  loading?: boolean;
}

export default function JoinRoomModal({ isOpen, onClose, onJoin, loading = false }: JoinRoomModalProps) {
  const [roomId, setRoomId] = useState('');
  const [roomInfo, setRoomInfo] = useState<Room | null>(null);
  const [error, setError] = useState<string>('');
  const [isValidating, setIsValidating] = useState(false);

  const handleInputChange = (value: string) => {
    setRoomId(value);
    setError('');
    setRoomInfo(null);
  };

  const validateRoomId = async () => {
    if (!roomId.trim()) {
      setError('Please enter a room ID');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/room/${roomId.trim()}`, {
        headers: {
          'Authorization': localStorage.getItem('auth_token') || '',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRoomInfo(data.room);
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Room not found');
        setRoomInfo(null);
      }
    } catch (error) {
      console.error('Error validating room:', error);
      setError('Failed to validate room. Please check your connection.');
      setRoomInfo(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roomInfo) {
      await validateRoomId();
      return;
    }

    try {
      await onJoin(roomId.trim());
      // Reset form on success
      setRoomId('');
      setRoomInfo(null);
      setError('');
    } catch (error: any) {
      setError(error.message || 'Failed to join room');
    }
  };

  const handleClose = () => {
    setRoomId('');
    setRoomInfo(null);
    setError('');
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-md mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-teal-600/20 rounded-3xl blur-2xl transform scale-110"></div>
        
        <div className="relative bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform rotate-6 shadow-xl">
              <svg className="w-8 h-8 text-white transform -rotate-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Join Existing Board
            </h2>
            <p className="text-gray-400 text-sm">
              Enter the room ID to join a collaborative session
            </p>
          </div>

          {/* Decorative elements around modal */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-green-500/30 to-teal-500/30 rounded-full animate-pulse"></div>
          <div className="absolute -top-2 -right-6 w-4 h-4 bg-gradient-to-r from-teal-500/30 to-cyan-500/30 rounded-full animate-pulse delay-300"></div>
          <div className="absolute -bottom-4 -left-6 w-6 h-6 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full animate-pulse delay-500"></div>
          <div className="absolute -bottom-2 -right-4 w-5 h-5 bg-gradient-to-r from-blue-500/30 to-green-500/30 rounded-full animate-pulse delay-700"></div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Input
                label="Room ID"
                type="text"
                placeholder="Enter room ID (e.g., abc123...)"
                value={roomId}
                onChange={(e) => handleInputChange(e.target.value)}
                error={error}
              />
              <div className="mt-2 text-xs text-gray-500">
                💡 Ask the room admin to share the room ID with you
              </div>
              
              {/* Validate button */}
              {roomId.trim() && !roomInfo && !error && (
                <div className="mt-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={validateRoomId}
                    loading={isValidating}
                    className="w-full text-sm"
                  >
                    Validate Room ID
                  </Button>
                </div>
              )}
            </div>

            {/* Room Information Display */}
            {roomInfo && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-green-200 font-semibold text-sm mb-1">Room Found!</h3>
                    <div className="space-y-1 text-xs text-green-300">
                      <div><span className="text-green-400">Board Name:</span> {roomInfo.slug}</div>
                      <div><span className="text-green-400">Created by:</span> {roomInfo.admin.name}</div>
                      <div><span className="text-green-400">Created:</span> {formatDate(roomInfo.createdAt)}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                variant="primary"
                className="flex-1"
                loading={loading}
                disabled={!roomId.trim()}
              >
                {roomInfo ? 'Join Board' : 'Validate & Join'}
              </Button>
            </div>
          </form>

          {/* Creative visual elements */}
          <div className="absolute top-4 right-4 opacity-20">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200"></div>
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
        <div className="absolute -top-8 -left-8 w-6 h-6 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute -top-12 -right-4 w-4 h-8 bg-gradient-to-b from-teal-500/20 to-cyan-500/20 rounded-lg transform rotate-15"></div>
        <div className="absolute -bottom-8 -right-8 w-8 h-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full animate-pulse delay-1200"></div>
        <div className="absolute -bottom-6 -left-10 w-5 h-5 border-2 border-dashed border-green-400/40 rounded transform rotate-45"></div>
      </div>
    </div>
  );
}
