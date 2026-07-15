const { createServer } = require('node:http');
const next = require('next');
const { Server } = require('socket.io');

const dev =
  process.env.NODE_ENV !== 'production' &&
  process.env.npm_lifecycle_event !== 'start';
const hostname = process.env.HOST || 'localhost';
const port = Number(process.env.PORT || 3000);

const app = next({
  dev,
  hostname,
  port,
  webpack: dev,
  turbopack: false,
});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('discussion:join', ({ discussionId }) => {
      if (!discussionId) return;
      socket.join(`discussion:${discussionId}`);
    });

    socket.on('discussion:message', ({ discussionId, message }) => {
      if (!discussionId || !message) return;
      socket.to(`discussion:${discussionId}`).emit('discussion:message', message);
    });

    socket.on('call:start', ({ discussionId, participantName }) => {
      if (!discussionId) return;
      io.to(`discussion:${discussionId}`).emit('call:started', { discussionId, participantName });
    });

    socket.on('call:end', ({ discussionId, participantName }) => {
      if (!discussionId) return;
      io.to(`discussion:${discussionId}`).emit('call:ended', { discussionId, participantName });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });

  httpServer.listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
