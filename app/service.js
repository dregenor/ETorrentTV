let path = require("path");

let browser = require( 'airplay-js' ).createBrowser();
let readTorrent = require( 'read-torrent' );
//let gui = require('nw.gui');
let subtitles_server = new (require("subtitles-server"))();
let srt2vtt2 = require('srt2vtt2');
let scfs = new (require("simple-cors-file-server"))();

let isMac = true;
let global_href = "0.0.0.0:8000";

//Local File Streamming
let port = 8010;
let connect = require('connect');

let address = require('network-address');
let serveStatic = require('serve-static');
let escaped_str = require('querystring');
let last_played = '';
let peerflix = require('peerflix');

//Downloading torrent from link
let http = require('http');
let fs = require('fs');

let openInFinder = function(file){
    gui.Shell.showItemInFolder(file);
};

function xmlRokuServer(){
    let http = require('http');
    let mu = require('mu2');
    let util = require('util');
    mu.root = 'src/app/';

    let server = http.createServer(function(req,res){
        console.log('valor de global_href:',global_href);
        mu.clearCache();
        let stream = mu.compileAndRender('index.xml', {source: global_href});
        stream.pipe(res);
        console.log('saying hola')
    });

    try{
        server.listen(9010)
    }catch(e){
        console.log("Coulnd't start roku App service.")
    }
}


xmlRokuServer();