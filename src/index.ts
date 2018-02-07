// 

require('source-map-support').install()

import * as eyes from 'eyes'
import * as cron from 'cron'
import * as loudness from 'loudness'
import * as playsound from 'play-sound'



const player = playsound({})

function playMP3(path: string): Promise<void> {
	return new Promise(function(resolve, reject) {
		player.play(path, function(error) {
			if (error) return
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


