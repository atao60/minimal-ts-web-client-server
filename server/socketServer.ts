import WebSocket, { Server } from 'ws';

export function sendToSocketClients(socketServer: Server, data: {}) {
  const stringifiedData = JSON.stringify(data);

  socketServer.clients.forEach((client: WebSocket) => {
    client.send(stringifiedData, console.error);
  });
}
export function getSocketServer(port: number): Server {
  const socketServer = new Server({ port: port, clientTracking: true });

  socketServer.on('connection', (client: WebSocket) => {
    console.log(`[ws] Client connected.`);

    client.on('close', () => {
      console.log(`[ws] Client disconnected`);
      client.terminate();
    });
  });

  return socketServer;
}
