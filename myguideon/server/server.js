const express    = require('express');
const session    = require('express-session');
const config     = require('./app/config'); 
const routers    = require('./app/routers/router');
const apiRouter  = routers; 

const { app }    = config;  

app.use(express.json(config.jsonConfig));
app.use(express.urlencoded(config.urlEncodedConfig));
app.use('/api/public', express.static(config.publicPath)); 

app.use(session(config.sessionConfig));

app.use(config.corsMiddleware);

app.use('/api', apiRouter);

// app.listen(config.PORT, () => {
//   console.log(`🚀 Server is running on port ${config.PORT}`);
// });

const server = app.listen(config.PORT, () => {
  console.log(`🚀 Server is running on port ${config.PORT}`);
});

module.exports = { app, server };

/*********************************************** */
