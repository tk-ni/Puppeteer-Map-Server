const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http,{
    cors: {
      origin: '*',
    }
});

const env = require('./core/env');
const crawler = require('./crawler/crawler');
const cronManager = require('./managers/cron.manager');

io.on('connection', async () => {
    await crawler.emitSocketData(io);
});



http.listen(env.PORT, () => {
    console.log('Server listening on', env.PORT);
    crawler.init(io);
    cronManager.initReset();
})