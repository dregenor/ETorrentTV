let helpers = require('./helpers');

module.exports = function playInDevices(resource, chromecast_resource){
    helpers.showMessage("Streaming")
    self.devices.forEach(function(dev){
        var sending_resource = resource
        if(dev.active){
            if(dev.chromecast && subtitlesDropped){
                sending_resource = {
                    url : chromecast_resource,
                    subtitles : [
                        {
                            language : 'en-US',
                            url : subtitles_resource,
                            name : 'English'
                        }
                    ]
                }
            }
            console.log("playInDevices: "+sending_resource)
            dev.play(sending_resource, 0, function() {
                self.playingResource = resource
                console.log(">>> Playing in device: "+resource)
                if(dev.togglePlayIcon){
                    dev.togglePlayIcon('PLAYING')
                    if(dev.streaming == false){
                        dev.togglePlayControls()
                    }
                    dev.playing = true
                    dev.stopped = false
                    dev.streaming = true
                    dev.loadingPlayer = false
                }
            });
        }
    });
}
