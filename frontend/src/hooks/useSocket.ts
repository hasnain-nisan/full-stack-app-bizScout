import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000'; // Update with your backend URL

export const useSocket = (event: string) => {
   const [data, setData] = useState<any[]>([]);

   useEffect(() => {
      const socket: Socket = io(SOCKET_URL);

      // Listen for real-time updates
      socket.on(event, (newData) => {
         setData((prev) => [newData, ...prev]);
      });

      return () => {
         socket.disconnect();
      };
   }, [event]);

   return data;
};
