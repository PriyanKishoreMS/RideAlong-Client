const express = require('express');
const connectDB = require('./config/db');
const port = 5000 || process.env.PORT;

const app = express();

connectDB();

app.use(express.json());

app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/ride', require('./routes/api/ride'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const io = require('socket.io')(server, {
  // pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000/',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', socket => {
  console.log(`user connected ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`user disconnected ${socket.id}`);
  });
});
