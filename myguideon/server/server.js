const session  = require('express-session');
const config   = require('./app/config'); 
const routers  = require('./app/routers/index');

const { app } = config;  // express from config file


app.use(express.json(config.jsonConfig));
app.use(express.urlencoded(config.urlEncodedConfig));

app.use('/public', express.static(config.publicPath));

app.use(session(config.sessionConfig));


app.use(config.corsMiddleware);


app.use('/api', routers);

app.listen(config.PORT, () => {
  console.log(`🚀 Server is running on port ${config.PORT}`);
});
