let airplayJS = require( 'airplay-js');
let helpers = require('./helpers');
let emitter = require('./emitter');

module.exports = {
    init: function init(){
        console.warn('airplayJS',airplayJS.createBrowser);
        let browser = airplayJS.createBrowser();
        console.warn('init');
        browser.on( 'deviceOn', function( device ) {
            console.warn(device );
            let ip = device.info[0];
            if(helpers.devices.findIndex(function(dev){ return dev.info[0] === ip; }) < 0){
                device.playing = false;

                helpers.addDevice(device);
                emitter.emit('wantToPlay');

                device.on('NoFFMPEG', function(){
                    // todo replace link
                    helpers.showMessage("<a href='http://torrentv.github.io/noffmpeg' target='_blank'>FFMPEG not found :(</a>")
                });
            }
        });

        browser.on('error', console.error.bind(console,'err'));
        browser.on('start', console.info.bind(console,'start'));
        browser.on('stop', console.info.bind(console,'stop'));
        browser.on('deviceOff', console.warn.bind(console,'deviceOff'));
        browser.on('deviceOn', console.info.bind(console,'deviceOn'));
        browser.start();
    },


    playInDevices: function playInDevices(resource){
        helpers.showMessage("Streaming");
        let device = helpers.activeDevice;
        if(device){
            device.play(resource, 0);
            device.playing = true;
        }
    }

};