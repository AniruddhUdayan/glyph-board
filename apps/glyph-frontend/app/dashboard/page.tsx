"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Button } from '../../components/ui/Button';
import CreateRoomModal from '../../components/CreateRoomModal';
import JoinRoomModal from '../../components/JoinRoomModal';
import DeleteRoomModal from '../../components/DeleteRoomModal';
import RoomCard from '../../components/RoomCard';
import { api, roomsApi } from '../../lib/api';
import { type CreateRoom } from '../../lib/schemas';
import { Loader } from '../../components/ui/Loader';
import { useToast } from '../../components/ui/Toast';

interface Room {
  id: string;
  slug: string;
  createdAt: string;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [isDeletingRoom, setIsDeletingRoom] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [error, setError] = useState<string>('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleCreateRoom = async (data: CreateRoom) => {
    try {
      setIsCreatingRoom(true);
      setError('');
      
      const response = await roomsApi.createRoom(data);
      
      // Refresh the rooms list to include the new room
      await refreshRooms();
      
      // Close the modal
      setShowCreateModal(false);
      setIsCreatingRoom(false);
      
      // Show success toast
      showToast({
        message: `Board "${data.name}" created successfully!`,
        type: 'success'
      });
      
      // Redirect to the created room using the returned roomId
      router.push(`/canvas/${response.roomId}`);
    } catch (error: any) {
      console.error('Error creating room:', error);
      setError(error.message || 'Failed to create room. Please try again.');
      setIsCreatingRoom(false);
      
      showToast({
        message: 'Failed to create room. Please try again.',
        type: 'error'
      });
    }
  };

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
    setError('');
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setError('');
    setIsCreatingRoom(false);
  };

  const handleOpenJoinModal = () => {
    setShowJoinModal(true);
    setError('');
  };

  const handleCloseJoinModal = () => {
    setShowJoinModal(false);
    setError('');
    setIsJoiningRoom(false);
  };

  const handleJoinRoom = async (roomId: string) => {
    try {
      setIsJoiningRoom(true);
      setError('');
      
      // Validate room exists
      const response = await roomsApi.getRoomById(roomId);
      
      // Close modal and redirect to room
      setShowJoinModal(false);
      setIsJoiningRoom(false);
      
      // Redirect to the room
      router.push(`/canvas/${roomId}`);
    } catch (error: any) {
      console.error('Error joining room:', error);
      setError(error.message || 'Failed to join room. Please check the room ID.');
      setIsJoiningRoom(false);
      throw error; // Re-throw so modal can handle it
    }
  };

  const handleOpenDeleteModal = (room: Room) => {
    setRoomToDelete(room);
    setShowDeleteModal(true);
    setError('');
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setRoomToDelete(null);
    setError('');
    setIsDeletingRoom(false);
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      setIsDeletingRoom(true);
      setError('');
      
      const roomName = roomToDelete?.slug || 'Board';
      
      // Delete the room
      await roomsApi.deleteRoom(roomId);
      
      // Refresh the rooms list
      await refreshRooms();
      
      // Close modal
      setShowDeleteModal(false);
      setRoomToDelete(null);
      setIsDeletingRoom(false);
      
      // Show success toast
      showToast({
        message: `"${roomName}" has been deleted successfully`,
        type: 'success'
      });
      
      console.log('Room deleted successfully');
    } catch (error: any) {
      console.error('Error deleting room:', error);
      setError(error.message || 'Failed to delete room. Please try again.');
      setIsDeletingRoom(false);
      
      // Show error toast
      showToast({
        message: 'Failed to delete room. Please try again.',
        type: 'error'
      });
      
      throw error; // Re-throw so modal can handle it
    }
  };

  // Fetch user rooms on component mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoadingRooms(true);
        const response = await roomsApi.getUserRooms();
        setRooms(response.rooms);
      } catch (error: any) {
        console.error('Error fetching rooms:', error);
        setError('Failed to load your boards');
      } finally {
        setLoadingRooms(false);
      }
    };

    if (user) {
      fetchRooms();
    }
  }, [user]);

  // Refresh rooms after creating a new one
  const refreshRooms = async () => {
    try {
      const response = await roomsApi.getUserRooms();
      setRooms(response.rooms);
    } catch (error) {
      console.error('Error refreshing rooms:', error);
    }
  };


  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Artistic Background Elements */}
        <div className="absolute inset-0">
          {/* Dynamic Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.05]">
            <div className="h-full w-full" style={{
              backgroundImage: `
                linear-gradient(rgba(139, 92, 246, 0.4) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 92, 246, 0.4) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }} />
          </div>

          {/* Floating Creative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Top area - Paint brushes and palettes */}
            <div className="absolute top-20 left-[10%] w-32 h-20 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-3xl transform rotate-12 animate-pulse">
              <div className="p-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-pink-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
            </div>
            
            <div className="absolute top-32 right-[15%] w-24 h-24 bg-gradient-to-r from-blue-500/10 to-teal-500/10 rounded-full animate-bounce delay-300">
              <div className="p-6 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>

            {/* Middle area - Geometric shapes */}
            <div className="absolute top-[40%] left-[5%] w-28 h-16 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl transform -rotate-6 animate-pulse delay-500">
              <div className="p-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <div className="absolute bottom-32 right-[8%] w-36 h-24 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-3xl transform rotate-12 animate-pulse delay-700">
              <div className="p-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>

            {/* Connecting artistic lines */}
            <svg className="absolute top-[30%] left-[20%] w-40 h-32" viewBox="0 0 160 120">
              <path
                d="M20 60 Q60 20 100 60 T140 60"
                stroke="rgba(139, 92, 246, 0.2)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
            </svg>
          </div>
        </div>

        {/* Modern Header */}
        <header className="relative z-10 bg-gradient-to-r from-slate-800/50 to-purple-800/50 backdrop-blur-xl border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              {/* Logo and Brand */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center transform rotate-12 shadow-2xl">
                  <span className="text-white font-bold text-xl transform -rotate-12">G</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Glyph Board
                  </h1>
                  <p className="text-sm text-gray-400">Creative Workspace</p>
                </div>
              </div>
              
              {/* User Info and Actions */}
              <div className="flex items-center space-x-6">
                <div className="text-white font-medium">
                  Welcome, {user?.name || 'Creative User'}
                </div>
                <Button
                  variant="elegant"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight block">
                Your Creative
              </span>
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent leading-tight block">
                Universe
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Where ideas take shape and collaboration comes alive. 
              <span className="text-purple-300">Create stunning visuals</span>, 
              <span className="text-blue-300"> share knowledge</span>, and 
              <span className="text-pink-300"> inspire together</span>.
            </p>
          </div>

          {/* Quick Actions - Redesigned */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
            {/* Create New Board - Enhanced */}
            <div className="group relative bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-8 hover:border-blue-400/40 transition-all duration-500">
              {/* Floating creative elements */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl rotate-12 animate-pulse" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-bounce delay-300" />
              
              <div className="relative">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="text-3xl font-bold text-white mb-2">Create New Board</h3>
                    <p className="text-blue-200 font-medium">Start your artistic journey</p>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                  Launch a fresh canvas where imagination meets collaboration. 
                  Perfect for brainstorming, designing, and bringing ideas to life.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm text-blue-200">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    <span>Unlimited drawing tools</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-purple-200">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-100" />
                    <span>Real-time collaboration</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-pink-200">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-200" />
                    <span>Auto-save & sync</span>
                  </div>
                </div>
                
                <Button
                  variant="artistic"
                  onClick={handleOpenCreateModal}
                  className="w-full mt-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Board
                </Button>
              </div>
            </div>

            {/* Join Existing Board - Enhanced */}
            <div className="group relative bg-gradient-to-br from-green-900/30 to-teal-900/30 backdrop-blur-xl border border-green-500/20 rounded-3xl p-8 hover:border-green-400/40 transition-all duration-500">
              {/* Floating creative elements */}
              <div className="absolute -top-2 -right-6 w-10 h-10 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-2xl rotate-45 animate-pulse delay-200" />
              <div className="absolute -bottom-4 -left-3 w-6 h-6 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-full animate-bounce delay-500" />
              
              <div className="relative">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-2xl">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="text-3xl font-bold text-white mb-2">Join Existing Board</h3>
                    <p className="text-green-200 font-medium">Connect with others</p>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                  Jump into an ongoing creative session. Share knowledge, 
                  contribute ideas, and learn from collaborative minds.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm text-green-200">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>Live collaboration</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-teal-200">
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse delay-100" />
                    <span>Knowledge sharing</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-cyan-200">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-200" />
                    <span>Instant access</span>
                  </div>
                </div>
                
                <Button
                  variant="creative"
                  onClick={handleOpenJoinModal}
                  className="w-full mt-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Join Existing Board
                </Button>
              </div>
            </div>
          </div>

        </section>

        {/* Your Creative Boards Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
          <div className="relative">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Your Creative Boards
                </h2>
                <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse delay-300" />
              </div>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Your digital canvases where creativity flows and collaboration thrives
              </p>
            </div>

            {/* Boards Content */}
            {loadingRooms ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mb-6 animate-pulse">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <Loader size="lg" variant="primary" text="Loading your creative universe..." />
              </div>
            ) : rooms.length > 0 ? (
              <div>
                {/* Stats Bar */}
                <div className="flex items-center justify-between mb-8 p-4 bg-gradient-to-r from-slate-800/50 to-purple-800/50 backdrop-blur-xl rounded-2xl border border-purple-500/20">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{rooms.length}</span>
                      </div>
                      <span className="text-white font-medium">
                        {rooms.length === 1 ? 'Board' : 'Boards'} Created
                      </span>
                    </div>
                    <div className="hidden md:flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-green-300 text-sm">All boards active</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    Creative since {user?.name ? 'joining' : 'today'}
                  </div>
                </div>

                {/* Boards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {rooms.map((room) => (
                    <RoomCard 
                      key={room.id} 
                      room={room}
                      onDelete={() => handleOpenDeleteModal(room)}
                      onCopyRoomId={(roomId) => {
                        showToast({
                          message: 'Room ID copied to clipboard!',
                          type: 'success'
                        });
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                {/* Empty State - Artistic */}
                <div className="relative max-w-md mx-auto">
                  {/* Floating art elements */}
                  <div className="absolute -top-8 -left-8 w-16 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl rotate-12 animate-pulse" />
                  <div className="absolute -top-4 -right-6 w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-bounce delay-300" />
                  <div className="absolute -bottom-6 -left-4 w-12 h-8 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-xl rotate-45 animate-pulse delay-500" />
                  <div className="absolute -bottom-8 -right-8 w-6 h-6 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full animate-bounce delay-700" />
                  
                  <div className="relative bg-gradient-to-br from-slate-800/50 to-purple-800/30 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-12">
                    {/* Empty state icon */}
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    
                    <h3 className="text-3xl font-bold text-white mb-4">
                      Ready to Create?
                    </h3>
                    <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                      Your creative journey begins with a single stroke. 
                      Create your first board and watch ideas come to life.
                    </p>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center justify-center space-x-3 text-sm text-blue-200">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                        <span>Infinite canvas awaits</span>
                      </div>
                      <div className="flex items-center justify-center space-x-3 text-sm text-purple-200">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-100" />
                        <span>Collaborate in real-time</span>
                      </div>
                      <div className="flex items-center justify-center space-x-3 text-sm text-pink-200">
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-200" />
                        <span>Share and inspire</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="artistic"
                      onClick={handleOpenCreateModal}
                      className="px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Your First Board
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Error Display */}
        {error && (
          <div className="fixed top-4 right-4 z-50 max-w-md">
            <div className="bg-red-500/20 border-2 border-red-500 rounded-lg backdrop-blur-sm p-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-200 text-sm font-medium flex-1">{error}</p>
                <button
                  onClick={() => setError('')}
                  className="text-red-300 hover:text-red-100 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Room Modal */}
        <CreateRoomModal
          isOpen={showCreateModal}
          onClose={handleCloseCreateModal}
          onSubmit={handleCreateRoom}
          loading={isCreatingRoom}
        />

        {/* Join Room Modal */}
        <JoinRoomModal
          isOpen={showJoinModal}
          onClose={handleCloseJoinModal}
          onJoin={handleJoinRoom}
          loading={isJoiningRoom}
        />

        {/* Delete Room Modal */}
        <DeleteRoomModal
          isOpen={showDeleteModal}
          room={roomToDelete}
          onClose={handleCloseDeleteModal}
          onDelete={handleDeleteRoom}
          loading={isDeletingRoom}
        />
        
        {/* Toast Container */}
        <ToastContainer />
      </div>
    </ProtectedRoute>
  );
}
