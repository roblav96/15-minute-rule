"use strict";
// 
exports.__esModule = true;
require('source-map-support').install();
var eyes = require("eyes");
var cron = require("cron");
// import * as loudness from 'loudness'
console.log('process.argv >');
eyes.inspect(process.argv);
new cron.CronJob({
    cronTime: '*/15 * * * *',
    start: true,
    onTick: function () {
        console.log('cron.CronJobaaa >');
        eyes.inspect(cron.CronJob);
    },
    timeZone: 'America/New_York',
    runOnInit: !!process.env.development
});
