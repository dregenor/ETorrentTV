let helpers = require('./helpers');
let peerflix = require('peerflix');
let $ = require('jquery');
let appleTv = require('./appleTV');
/**
 * @type {Emitter}
 */
let emitter = require('./emitter');

let Torrent = {
    loading: false,
    /**
     * @type {function}
     */
    read : require( 'read-torrent' ),

    process: function process(new_torrent){
        Torrent.read(new_torrent, function(err, torrent) {
            if(err){
                helpers.showMessage(JSON.stringify(err)); // todo make normal err serizlizer
            } else {
                if(JSON.stringify(torrent.files).toLowerCase().indexOf('.mkv') > -1){
                    helpers.secondaryMessage("<div class='error'>MKV format not supported by AppleTV</div>");
                    helpers.showMessage("Torrent contains .MKV Movie");
                } else {
                    Torrent.got(torrent);
                }
            }
        });
    },
    isLink: function(str){
        return !str.length>0 && (Torrent.isHttp(str) || Torrent.isMagnet(str));
    },
    isHttp: function(str){
        return str.toLowerCase().substring(0,4).indexOf('http')>-1;
    },
    isMagnet: function(str){
        return str.toLowerCase().substring(0,6).indexOf('magnet')>-1;
    },

    isTorrent: function(fname){
        return fname.toLowerCase().substring(fname.length-7,fname.length).indexOf('torrent')>-1
    },
    playTorrent: function loadFile(torrentFile){
        //Local .torrent file dragged
        helpers.secondaryMessage(
            torrentFile
                .split(helpers.isMac?'/':'\\')
                .pop()
                .replace(/\{|\}/g, '')
                .substring(0,30) + "..."
        );

        if(helpers.lastPlayed === torrentFile){
            emitter.emit('wantToPlay');
        } else {
            Torrent.process(torrentFile)
        }
        helpers.setLastPlayed(torrentFile);
    },

    playMagnet: function(link){
        //magnet link
        helpers.secondaryMessage("Magnet");

        if(helpers.lastPlayed === link){
            emitter.emit('wantToPlay');
        }else{
            Torrent.process(link);
        }
        helpers.setLastPlayed(link);
    },

    playHttp: function(link){
        helpers.secondaryMessage("HTTP Link");
        link = link.toLowerCase().split("?")[0];
        helpers.secondaryMessage(link);
        helpers.secondaryMessage("Downloading .torrent file");
        if(helpers.lastPlayed === link){
            emitter.emit('wantToPlay');
        }else{
            Torrent.process(link);
        }
        helpers.setLastPlayed(link);
    },

    got: function gotTorrent(this_torrent){
        let address = require('network-address');
        let engine = peerflix(this_torrent, {});
        let wires = engine.swarm.wires;
        let swarm = engine.swarm;
        let movieName = this_torrent.name;
        // let movieHash = torrent.infoHash;

        helpers.killIntervals();
        helpers.showMessage("Processing Torrent");

        if(!Torrent.loading){
            $('#topimages').toggleClass('visible');
            $('#topimages').toggleClass('hidden');
            $('#processing').toggleClass('processing-icon');
        }
        Torrent.loading = true;

        engine.on('verify', function() { /* verified++; */ engine.swarm.piecesGot += 1; });
        // engine.on('invalid-piece', function() { invalid++; });
        // engine.on('hotswap', function() { hotswaps++; });

        engine.server.on('listening', function() {
            let href = 'http://' + address() + ':' + engine.server.address().port + '/';
            let fileLength = engine.server.index.length;
            let movieNameToShow = movieName.length > 15 ? movieName.substring(0, 15) + "..." : movieName;

            emitter.on('wantToPlay', tryToPlay);

            helpers.setGlobalHref(href);
            helpers.showMessage("Waiting for devices...");
            helpers.secondaryMessage(movieNameToShow + " [" + helpers.bytes(fileLength)+"]");
            helpers.addInterval(updateStatus,250);

            emitter.emit('wantToPlay');

            function updateStatus(){
                let unchoked = engine.swarm.wires.filter(active);
                helpers.statusMessage(unchoked, wires, swarm)
            }

            function tryToPlay(){
                helpers.lockTorrenting();
                if(helpers.devices){
                    appleTv.playInDevices(href, href);
                }
            }

            function active(wire) {
                //console.log("peerChoking")
                return !wire.peerChoking;
            }
        });
    }
};

module.exports = Torrent;