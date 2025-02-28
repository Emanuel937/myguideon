const express = require('express');
const app     = express();
const ApiRouters = require('./app/routers/index');
const cors    = require('cors'); 
const path    = require('path');
const session = require('express-session');


app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


app.use('/public', express.static(path.join(__dirname, 'public')));


app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(session({
  secret: 'emanuelabizimisecretkeyaid1234557', 
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 3600000,
  }
}));

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true,
}));

// Utilisation du middleware pour parser le JSON
app.use(express.json());

// Routes
app.use('/api', ApiRouters);

const PORT = 3030;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
