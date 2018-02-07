// 

declare global { namespace NodeJS { interface Process { dev: boolean } } }
process.dev = process.argv.indexOf('--dev') >= 0

import * as eyes from 'eyes'
import * as clc from 'cli-color'
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
		eyes.inspect(error, '\n\ninit > ERROR')

	}).then(function() {
		SYSTEM.ready = true
		eyes.inspect(SYSTEM.ready, '\n\ninit > ready')
		if (process.dev) playMP3(CONFIG.sounds.minor);
		setInterval(() => process.stdout.write((clc as any).erase.lineRight), 1000)

	})
}
setImmediate(init)



function onTick(sound: keyof typeof CONFIG.sounds) {
	if (!SYSTEM.ready) return Promise.resolve();

	return Promise.resolve().then(function() {
		return Promise.all([getMuted(), getVolume()])

	}).then(function(resolved) {
		SYSTEM.muted = resolved[0]
		if (Number.isFinite(resolved[1])) SYSTEM.volume = resolved[1];
		let volume = SYSTEM.muted ? CONFIG.volumes.low : CONFIG.volumes.high
		return setVolume(volume)

	}).then(function() {
		return playMP3(CONFIG.sounds[sound])

	}).then(function() {
		return Promise.all([
			setMuted(SYSTEM.muted),
			setVolume(SYSTEM.volume),
		])

	}).catch(function(error) {
		eyes.inspect(error, '\n\nonTick > ERROR')
	})
}



new cron.CronJob({
	cronTime: '*/5 * * * *',
	timeZone: 'America/New_York',
	start: true,
	onTick() {
		let time = new Date().toLocaleString().split(' ').splice(1, 1)[0]
		eyes.inspect(SYSTEM.ready, '\n\n[' + clc.bold.magenta(time) + '] onTick > ' + sound + ' > ready')
		let sound = 'minor' as keyof typeof CONFIG.sounds
		if (new Date().getMinutes() % 15 == 0) sound = 'major';
		onTick(sound)
	},
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
	file = 'assets/' + file + '.mp3'
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


