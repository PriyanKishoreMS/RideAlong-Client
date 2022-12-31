const express = require('express');
const connectDB = require('./config/db');
const port = 5000 || process.env.PORT;
var admin = require('firebase-admin');
var serviceAccount = require('./config/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
connectDB();

const app = express();

app.use(express.json());

app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/ride', require('./routes/api/ride'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
