// 

require('source-map-support').install()

import * as eyes from 'eyes'
import * as cron from 'cron'
import * as loudness from 'loudness'
import * as psound from 'play-sound'



const player = psound()

function playMP3(path: string) {
	return new Promise<void>(function(resolve, reject) {
		player.play(path, function(error) {
			if (error) return reject(error);
			resolve()
		})
	})
}



function onTick() {
	playMP3('sounds/KzurbSonar.mp3').catch(function(error) {
		console.error('player.play > error', error)
	})
}



new cron.CronJob({
	onTick,
	cronTime: '*/15 * * * *',
	start: true,
	timeZone: 'America/New_York',
	runOnInit: process.argv.indexOf('--dev') >= 0,
})


