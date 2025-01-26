import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL;

console.log({SOCKET_URL});


export const useSocket = (event: string) => {
   const [data, setData] = useState<any[]>([]);

   useEffect(() => {
      const socket: Socket = io(SOCKET_URL);

      // Listen for real-time updates
      socket.on(event, (newData) => {
         setData(() => [newData]);
      });

      return () => {
         socket.disconnect();
      };
   }, [event]);

   return data;
};
