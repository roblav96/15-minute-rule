// 

declare global { namespace NodeJS { interface Process { dev: boolean } } }
process.dev = process.argv.indexOf('--dev') >= 0

import * as eyes from 'eyes'
import * as cron from 'cron'
import * as loudness from 'loudness'
const player = require('play-sound')()



const CONFIG = {
	sounds: { major: 'Proxima', minor: 'Selenium' },
	volumes: { high: 50, low: 20 },
}



const SYSTEM = { muted: false, volume: 10, ready: process.dev }

function init() {
	return Promise.resolve().then(function() {
		return Promise.all([getMuted(), getVolume()])

	}).then(function(resolved) {
		SYSTEM.muted = resolved[0]
		if (Number.isFinite(resolved[1])) SYSTEM.volume = resolved[1];
		return Promise.resolve()

	}).catch(function(error) {
		console.error('init > ERROR', error)
	}).then(function() {
		SYSTEM.ready = true
		eyes.inspect(SYSTEM.ready, 'init > ready')
	})
}
setImmediate(init)



function onTick(sound: keyof typeof CONFIG.sounds) {
	eyes.inspect(SYSTEM.ready, 'onTick > ' + sound + ' > ready')
	if (!SYSTEM.ready) return Promise.resolve();

	return Promise.resolve().then(function() {
		return Promise.all([getMuted(), getVolume()])

	}).then(function(resolved) {
		SYSTEM.muted = resolved[0]
		if (Number.isFinite(resolved[1])) SYSTEM.volume = resolved[1];
		let volume = SYSTEM.muted ? CONFIG.volumes.low : CONFIG.volumes.high
		return setVolume(volume)

	}).then(function() {
		return playMP3('assets/' + CONFIG.sounds[sound] + '.mp3')

	}).then(function() {
		return Promise.all([
			setMuted(SYSTEM.muted),
			setVolume(SYSTEM.volume),
		])

	}).catch(function(error) {
		console.error('onTick > ERROR', error)
	})
}



new cron.CronJob({
	cronTime: '*/5 * * * *',
	timeZone: 'America/New_York',
	start: true,
	onTick() {
		let sound = 'minor' as keyof typeof CONFIG.sounds
		if (new Date().getMinutes() % 15 == 0) sound = 'major';
		onTick(sound)
	},
	runOnInit: process.dev,
})

// new cron.CronJob({
// 	cronTime: '0/15 * * * *',
// 	timeZone: 'America/New_York',
// 	start: true,
// 	onTick() { onTick('major') },
// 	runOnInit: process.dev,
// })

// new cron.CronJob({
// 	cronTime: '5/15 * * * *',
// 	timeZone: 'America/New_York',
// 	start: true,
// 	onTick() { onTick('minor') },
// 	// runOnInit: process.dev,
// })

// new cron.CronJob({
// 	cronTime: '10/15 * * * *',
// 	timeZone: 'America/New_York',
// 	start: true,
// 	onTick() { onTick('minor') },
// 	// runOnInit: process.dev,
// })



function playMP3(file: string) {
	return new Promise<void>(function(resolve, reject) {
		player.play(file, function(error) {
			if (error) return reject(error);
			resolve()
		})
	})
}

function getVolume() {
	return new Promise<number>(function(resolve, reject) {
		loudness.getVolume(function(error, volume) {
			if (error) return reject(error); resolve(volume)
		})
	})
}

function setVolume(volume: number) {
	return new Promise<void>(function(resolve, reject) {
		loudness.setVolume(volume, function(error) {
			if (error) return reject(error); resolve()
		})
	})
}

function getMuted() {
	return new Promise<boolean>(function(resolve, reject) {
		loudness.getMuted(function(error, muted) {
			if (error) return reject(error); resolve(!!muted)
		})
	})
}

function setMuted(muted: boolean) {
	return new Promise<void>(function(resolve, reject) {
		loudness.setMuted(muted, function(error) {
			if (error) return reject(error); resolve()
		})
	})
}


