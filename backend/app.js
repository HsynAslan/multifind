const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require("./routes/productRoutes");
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use("/api/products", productRoutes);
module.exports = app;
