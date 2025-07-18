const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 4000;

const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // adjust as needed
    credentials: true
}));
app.use(cookieParser());

const dbConnect = require('./config/database');
dbConnect.connect();

const noteRoutes = require('./routes/noteRoutes');
const userRoutes = require('./routes/userRoutes');
const aiRoutes = require('./routes/aiRoutes');

app.use('/api/v1/notes', noteRoutes);
app.use('/api/v1/auth', userRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
    res.send(`<h1>This is homepage</h1>`);
});

app.listen(PORT, () => {
    console.log(`server is started successfully on port ${PORT}`);
});