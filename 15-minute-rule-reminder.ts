// 

import * as eyes from 'eyes'
import { CronJob } from 'cron'



new CronJob({
	cronTime: '00 03 * * 1-5',
	start: true,
	onTick: function() {
		console.log('CronJob >')
		eyes.inspect(CronJob)
	},
	timeZone: 'America/New_York',
	runOnInit: true,
})


