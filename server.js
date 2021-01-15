const express = require('express');
const visitBll = require('./business_logic/visit.bll');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});

const env = require('./core/env');
const crawler = require('./crawler/crawler');
const cronManager = require('./managers/cron.manager');
const logManager = require('./managers/log.manager');

io.on('connection', (socket) => {
    visitBll.getVisits((e, visits) => {
        if (!e) {
            socket.emit('visits', visits);
        }
    })
});



http.listen(env.PORT, () => {
    console.log('Server listening on', env.PORT);
    // crawler.init(io);
    // logManager.init(io);
    // cronManager.initReset();
})