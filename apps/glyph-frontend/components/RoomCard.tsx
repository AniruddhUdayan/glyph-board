"use client";

import { useRouter } from 'next/navigation';

interface Room {
  id: string;
  slug: string;
  createdAt: string;
}

interface RoomCardProps {
  room: Room;
  onDelete?: () => void;
  onCopyRoomId?: (roomId: string) => void;
}

export default function RoomCard({ room, onDelete, onCopyRoomId }: RoomCardProps) {
  const router = useRouter();

  const handleJoinRoom = () => {
    router.push(`/canvas/${room.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays <= 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  const getLastUpdated = () => {
    // Since we don't have updatedAt, use createdAt for now
    return formatDate(room.createdAt);
  };

  const getCreated = () => {
    return formatDate(room.createdAt);
  };

  return (
    <div className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300">
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header with room icon and actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* Room icon */}
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            
            {/* Room details */}
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                {room.slug}
              </h3>
              <p className="text-sm text-gray-400">
                Created {getCreated()}
              </p>
            </div>
          </div>

        </div>

        {/* Room stats */}
        <div className="space-y-3">
          {/* Room ID with copy button */}
          <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <span className="text-xs text-gray-400">Room ID:</span>
              <code className="text-xs text-blue-300 font-mono bg-blue-500/10 px-1 py-0.5 rounded">
                {room.id.slice(0, 8)}...
              </code>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(room.id);
                onCopyRoomId?.(room.id);
              }}
              className="text-gray-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg p-2 transition-all duration-200 hover:scale-110"
              title="Copy room ID"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Last updated {getLastUpdated()}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-400">Active</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-gray-700/50">
          <div className="flex space-x-3">
          {/* Join Room Button */}
          <button
            onClick={handleJoinRoom}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm border border-blue-500/40 text-blue-100 hover:from-blue-500/40 hover:to-purple-500/40 hover:border-blue-400/60 hover:text-white font-medium rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group/join"
          >
            <svg className="w-4 h-4 group-hover/join:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm">Join Board</span>
          </button>

          {/* Delete Room Button */}
          {onDelete && (
            <button
              onClick={onDelete}
              className="flex items-center justify-center px-4 py-3 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-200 hover:bg-red-500/30 hover:border-red-400/50 hover:text-red-100 font-medium rounded-xl transition-all duration-300 hover:scale-[1.02] group/delete"
              title="Delete room"
            >
              <svg className="w-4 h-4 group-hover/delete:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
          </div>
        </div>

        {/* Visual elements */}
        <div className="absolute top-2 right-2 opacity-20">
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-100" />
            <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce delay-200" />
          </div>
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute -top-1 -left-1 w-3 h-3 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}
