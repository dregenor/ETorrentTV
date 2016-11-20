let connect = require('connect');
let scfs = new (require("simple-cors-file-server"))();
let serveStatic = require('serve-static');
let escaped_str = require('querystring');

let helpers = require('./helpers');
let appleTV = require('./appleTV');
let port = 8010;

module.exports = {
    isSupported: function(fname){
        return fname.toLowerCase().substring(fname.length-3,fname.length).indexOf('mp4')>-1
            || fname.toLowerCase().substring(fname.length-3,fname.length).indexOf('m4v')>-1
            || fname.toLowerCase().substring(fname.length-3,fname.length).indexOf('mov')>-1
            || fname.toLowerCase().substring(fname.length-3,fname.length).indexOf('jpg')>-1
            || fname.toLowerCase().substring(fname.length-3,fname.length).indexOf('mkv')>-1
            || fname.toLowerCase().substring(fname.length-3,fname.length).indexOf('avi')>-1
            || fname.toLowerCase().substring(fname.length-3,fname.length).indexOf('m4a')>-1
            || fname.toLowerCase().substring(fname.length-4,fname.length).indexOf('flac')>-1
            || fname.toLowerCase().substring(fname.length-3,fname.length).indexOf('srt')>-1
            || fname.toLowerCase().substring(fname.length-3,fname.length).indexOf('vtt')>-1
            || fname.toLowerCase().substring(fname.length-3,fname.length).indexOf('mp3')>-1
    },
    playLocalFile: function(fname){
        helpers.showMessage("Sending");
        let dirname = path.dirname(fname);
        let basename = path.basename(fname);

        helpers.secondaryMessage("Local File: " + basename.length < 15 ? basename : basename.substring(0, 15) + "...");
        let app = connect();

        port++;

        app.use(serveStatic(dirname)).listen(port);
        scfs.start(fname);

        let resource = 'http://' + address() + ':' + port + '/' + escaped_str.escape(basename);
        appleTV.playInDevices(resource);
    }    
};