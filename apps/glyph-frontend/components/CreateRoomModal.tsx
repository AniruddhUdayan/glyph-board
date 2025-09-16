"use client";

import { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { CreateRoomSchema, type CreateRoom } from '../lib/schemas';
import { z } from 'zod';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRoom) => Promise<void>;
  loading?: boolean;
}

export default function CreateRoomModal({ isOpen, onClose, onSubmit, loading = false }: CreateRoomModalProps) {
  const [formData, setFormData] = useState<CreateRoom>({ name: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = CreateRoomSchema.parse(formData);
      setErrors({});
      await onSubmit(validatedData);
      // Reset form on success
      setFormData({ name: '' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const handleClose = () => {
    setFormData({ name: '' });
    setErrors({});
    onClose();
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
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl transform scale-110"></div>
        
        <div className="relative bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform rotate-6 shadow-xl">
              <svg className="w-8 h-8 text-white transform -rotate-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Create New Board
            </h2>
            <p className="text-gray-400 text-sm">
              Give your collaborative workspace a unique name
            </p>
          </div>

          {/* Decorative elements around modal */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full animate-pulse"></div>
          <div className="absolute -top-2 -right-6 w-4 h-4 bg-gradient-to-r from-pink-500/30 to-orange-500/30 rounded-full animate-pulse delay-300"></div>
          <div className="absolute -bottom-4 -left-6 w-6 h-6 bg-gradient-to-r from-green-500/30 to-teal-500/30 rounded-full animate-pulse delay-500"></div>
          <div className="absolute -bottom-2 -right-4 w-5 h-5 bg-gradient-to-r from-violet-500/30 to-purple-500/30 rounded-full animate-pulse delay-700"></div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Input
                label="Board Name"
                type="text"
                placeholder="Enter a unique board name (e.g., my-awesome-board)"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={errors.name}
              />
              <div className="mt-2 text-xs text-gray-500">
                💡 This will be your board's unique identifier (slug)
              </div>
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
                variant="primary"
                className="flex-1"
                loading={loading}
              >
                Create Board
              </Button>
            </div>
          </form>

          {/* Creative visual elements */}
          <div className="absolute top-4 right-4 opacity-20">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
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
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm rounded-3xl flex items-center justify-center z-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <p className="text-white font-medium mb-2">Creating your board...</p>
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Additional floating elements around modal */}
        <div className="absolute -top-8 -left-8 w-6 h-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute -top-12 -right-4 w-4 h-8 bg-gradient-to-b from-pink-500/20 to-purple-500/20 rounded-lg transform rotate-15"></div>
        <div className="absolute -bottom-8 -right-8 w-8 h-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full animate-pulse delay-1200"></div>
        <div className="absolute -bottom-6 -left-10 w-5 h-5 border-2 border-dashed border-yellow-400/40 rounded transform rotate-45"></div>
      </div>
    </div>
  );
}
