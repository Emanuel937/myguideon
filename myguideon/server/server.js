const express    = require('express'); // Ajout de cette ligne
const session    = require('express-session');
const config     = require('./app/config'); 
const routers    = require('./app/routers/index');
const apiRouter  = routers; 
const path       = require('path');

const { app }    = config;  

app.use(express.json(config.jsonConfig));
app.use(express.urlencoded(config.urlEncodedConfig));
app.use('/api/public', express.static(config.publicPath)); 

app.use(session(config.sessionConfig));

app.use(config.corsMiddleware);

app.use('/api', apiRouter);

app.use(express.static(path.join(__dirname, 'build')));

//app.use('*', (req, res) => {
//  res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

app.listen(config.PORT, () => {
  console.log(`🚀 Server is running on port ${config.PORT}`);
});


