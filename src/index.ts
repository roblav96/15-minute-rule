// 

require('source-map-support').install()

import * as eyes from 'eyes'
import * as cron from 'cron'
// import * as loudness from 'loudness'



new cron.CronJob({
	cronTime: '*/15 * * * *',
	start: true,
	onTick: function() {
		console.log('cron.CronJobzzz >')
		eyes.inspect(cron.CronJob)
	},
	timeZone: 'America/New_York',
	runOnInit: true,
})




