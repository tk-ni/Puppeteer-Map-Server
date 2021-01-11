const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const env = require('./core/env');
const crawler = require('./crawler/crawler');

const cronManager = require('./managers/cron.manager');

io.on('connection', (socket)=>{
    console.log('USER CONNECTED');
});

http.listen(env.PORT, ()=>{
    console.log('Server listening on', env.PORT);
    crawler.init();
    cronManager.initReset();
})