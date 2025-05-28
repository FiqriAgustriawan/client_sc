import { useState, useEffect } from 'react';
import Pusher from 'pusher-js';

export default function PusherTest() {
  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState(null);
  
  useEffect(() => {
    try {
      // Use the hardcoded key for testing
      const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY || "07483a9f18725ee88599";
      const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap1";
      
      setStatus(`Trying to connect with key: ${pusherKey}`);
      
      // Enable Pusher logging
      Pusher.logToConsole = true;
      
      const pusher = new Pusher(pusherKey, {
        cluster: pusherCluster,
        encrypted: true
      });
      
      pusher.connection.bind('connected', () => {
        setStatus('Connected to Pusher successfully!');
      });
      
      pusher.connection.bind('error', (err) => {
        setStatus('Connection Error!');
        setError(JSON.stringify(err));
      });
      
      // Subscribe to a test channel
      const channel = pusher.subscribe('test-channel');
      
      channel.bind('pusher:subscription_succeeded', () => {
        setStatus(prev => prev + ' Subscribed to test-channel.');
      });
      
      channel.bind('pusher:subscription_error', (err) => {
        setStatus('Subscription Error!');
        setError(JSON.stringify(err));
      });
      
      return () => {
        pusher.disconnect();
      };
    } catch (err) {
      setStatus('Initialization Error!');
      setError(err.message);
    }
  }, []);
  
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-bold mb-2">Pusher Test</h2>
      <p className="mb-2">Status: <span className={error ? 'text-red-500' : 'text-green-500'}>{status}</span></p>
      {error && (
        <div className="bg-red-50 p-3 rounded border border-red-200 text-sm whitespace-pre-wrap">
          {error}
        </div>
      )}
    </div>
  );
}