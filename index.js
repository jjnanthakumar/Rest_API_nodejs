require('dotenv').config();
const port = process.env.PORT || 3000;
const express = require('express');
const cors = require('cors');
const app = express()
const authRoute = require('./Routes/auth');
const postRoute = require('./Routes/posts');
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const conn = mongoose.connection;
conn.on('open', () => console.log("Connected to database"))

app.use(cors());
app.use(express.json());
// Route Middlewares
app.use('/api/users/', authRoute);
app.use('/api/users/posts', postRoute);


app.listen(port, () => console.log("Server running"));