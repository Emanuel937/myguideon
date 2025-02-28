
const path    = require('path');
const express = require('express');
const cors    = require('cors');

const app = express();

module.exports = {
  app,  

  PORT: 3030,

  jsonConfig: { limit: "50mb" },
  urlEncodedConfig: { limit: "50mb", extended: true },

 
  sessionConfig: {
    secret: 'emanuelabizimisecretkeyaid1234557',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 3600000, 
    },
  },

  corsMiddleware: cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),


  publicPath: path.join(__dirname, 'public'),
};
