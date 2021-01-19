const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const io = require('socket.io')(http,{
    cors: {
      origin: '*',
    }
});

const env = require('./core/env');
const crawler = require('./crawler/crawler');
const cronManager = require('./managers/cron.manager');
const resetRoute = require('./routes/reset.route');

app.use(cors());
app.use('/reset', resetRoute);
io.on('connection', (socket) => {
    
    crawler.emitSocketData(io);

    socket.on('disconnect', ()=>{
        console.log('Socket disconnected.');
    })
});

http.listen(env.PORT, () => {
    console.log('Server listening on', env.PORT);
    crawler.init(io);
    cronManager.initReset();
})