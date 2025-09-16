// Debug utility for WebSocket connection testing
// Use this in browser console to test WebSocket connection

export function testWebSocketConnection(token?: string) {
  const testToken = token || localStorage.getItem('auth_token') || 'test-token';
  const wsUrl = `ws://localhost:8081?token=${encodeURIComponent(testToken)}`;
  
  console.log('Testing WebSocket connection...');
  console.log('URL:', wsUrl);
  console.log('Token:', testToken ? 'Present' : 'Missing');
  
  const ws = new WebSocket(wsUrl);
  
  ws.onopen = () => {
    console.log('✅ WebSocket connection successful!');
    
    // Test joining a room
    ws.send(JSON.stringify({
      type: 'join_room',
      roomId: 'test-room'
    }));
  };
  
  ws.onmessage = (event) => {
    console.log('📨 Received message:', JSON.parse(event.data));
  };
  
  ws.onerror = (error) => {
    console.error('❌ WebSocket error:', error);
  };
  
  ws.onclose = (event) => {
    console.log('🔌 WebSocket closed:', {
      code: event.code,
      reason: event.reason,
      wasClean: event.wasClean
    });
  };
  
  // Close connection after 5 seconds
  setTimeout(() => {
    if (ws.readyState === WebSocket.OPEN) {
      console.log('Closing test connection...');
      ws.close();
    }
  }, 5000);
  
  return ws;
}

// Make it available globally for console testing
if (typeof window !== 'undefined') {
  (window as any).testWebSocketConnection = testWebSocketConnection;
}
