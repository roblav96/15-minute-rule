// 

declare global { namespace NodeJS { interface Process { dev: boolean } } }
process.dev = process.argv.indexOf('--dev') >= 0
if (process.dev) require('source-map-support').install();

// 

import * as eyes from 'eyes'
import * as clc from 'cli-color'
import * as throbber from 'cli-color/throbber'
import * as cron from 'cron'
import * as loudness from 'loudness'
const player = require('play-sound')()



const CONFIG = {
	sounds: { major: 'proxima', minor: 'click' },
	minvolume: 20,
}



new cron.CronJob({
	cronTime: '*/5 * * * *', timeZone: 'America/New_York', start: true,
	onTick() {
		let time = new Date().toLocaleString().split(' ').splice(1, 1)[0]
		let sound = 'minor' as keyof typeof CONFIG.sounds
		if (new Date().getMinutes() % 15 == 0) sound = 'major';
		onTick(CONFIG.sounds[sound])
	},
	runOnInit: process.dev,
})



function onTick(sound: string) {
	const system = { muted: false, volume: CONFIG.minvolume }
	return Promise.resolve().then(function() {
		return Promise.all([
			getMuted(),
			getVolume(),
		])

	}).then(function(resolved) {
		system.muted = resolved[0]
		if (Number.isFinite(resolved[1])) system.volume = resolved[1];

		let volume = Math.max(system.volume, CONFIG.minvolume)
		return setVolume(volume)

	}).then(function() {
		return playMP3(sound)

	}).then(function() {
		return Promise.all([
			setMuted(system.muted),
			setVolume(system.volume),
		])

	}).catch(function(error) {
		console.error('onTick > error', error)
	})
}



function playMP3(file: string) {
	file = 'assets/' + file + '.mp3'
	return new Promise<void>(function(resolve, reject) {
		player.play(file, function(error) {
			if (error) return reject(error); resolve()
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



{ throbber(function(s) { process.stdout.write(s) }, 100).start() }


