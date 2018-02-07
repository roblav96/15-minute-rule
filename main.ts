// 

declare global {
	const eyes: any
	namespace NodeJS { interface Process { dev: boolean } }
}

process.dev = process.argv.indexOf('--dev') >= 0
if (process.dev) (global as any).eyes = require('eyes');

import * as cron from 'cron'
import * as loudness from 'loudness'
const player = require('play-sound')()



const CONFIG = {
	sounds: { major: 'Proxima', minor: 'Selenium' },
	volumes: { high: 50, low: 20 },
}



const SYSTEM = { muted: false, volume: 10, ready: false }

function init() {
	return Promise.resolve().then(function() {
		return Promise.all([getMuted(), getVolume()])

	}).then(function(resolved) {
		SYSTEM.muted = resolved[0]
		if (Number.isFinite(resolved[1])) SYSTEM.volume = resolved[1];
		return Promise.resolve()

	}).catch(function(error) {
		console.error('init > error', error)
	}).then(function() { SYSTEM.ready = true })
}
setImmediate(init)



function onTick(sound: keyof typeof CONFIG.sounds) {
	if (!SYSTEM.ready && !process.dev) {
		console.warn('!SYSTEM.ready')
		return Promise.resolve()
	}

	return Promise.resolve().then(function() {
		return Promise.all([getMuted(), getVolume()])

	}).then(function(resolved) {
		SYSTEM.muted = resolved[0]
		if (Number.isFinite(resolved[1])) SYSTEM.volume = resolved[1];

		console.log('system >')
		eyes.inspect(SYSTEM)

		let volume = SYSTEM.muted ? CONFIG.volumes.low : CONFIG.volumes.high
		console.log('volume >')
		eyes.inspect(volume)
		return setVolume(volume)

	}).then(function() {
		return playMP3('assets/' + CONFIG.sounds[sound] + '.mp3')

	}).then(function() {
		return Promise.all([
			setMuted(SYSTEM.muted),
			setVolume(SYSTEM.volume),
		])

	}).then(function() {
		console.log('onTick > DONE')

	}).catch(function(error) {
		console.error('onTick > error', error)
	})
}



new cron.CronJob({
	cronTime: '0/15 * * * *',
	timeZone: 'America/New_York',
	start: true,
	onTick() { onTick('major') },
	// runOnInit: process.dev,
})

new cron.CronJob({
	cronTime: '5/15 * * * *',
	timeZone: 'America/New_York',
	start: true,
	onTick() { onTick('minor') },
	// runOnInit: process.dev,
})

new cron.CronJob({
	cronTime: '10/15 * * * *',
	timeZone: 'America/New_York',
	start: true,
	onTick() { onTick('minor') },
	// runOnInit: process.dev,
})



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


