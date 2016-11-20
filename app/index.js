let $ = require('jquery');
let helpers = require('./helpers');
let torrent = require('./torrent');
let localFile = require('./local_file');
let appleTV = require('./appleTV');
$(function() {
    initDnD($(document));
    appleTV.init();

    $('#airplay').on('click','.js-toggle-device', helpers.toggleDevice);

    window.resizeTo(300, 340);
});


function initDnD($root){
    $root.on('dragover',function () {
        $root.addClass('hover');
        return false;
    });

    $root.on('dragend',function () {
        $root.removeClass('hover');
        return false;
    });

    $root.on('drop', function(e){
        e.preventDefault && e.preventDefault();
        let link = event.dataTransfer.getData('Text');
        let isFile = event.dataTransfer.files.length >0;

        helpers.cleanStatus();
        $(document).removeClass('hover');
        helpers.secondaryMessage("");

        if(torrent.isLink(link)){
            if(torrent.isMagnet(link)){
                torrent.playMagnet(link);
            }else if(torrent.isHttp(link)){
                torrent.playHttp(link);
            }
        } else if(isFile){
            let filePath = event.dataTransfer.files[0].path;
            if(torrent.isTorrent(filePath)){
                torrent.playTorrent(filePath);
            } else if(localFile.isSupported(filePath)){
                localFile.playLocalFile(filePath);
            } else {
                helpers.secondaryMessage("Invalid Filetype");
            }
        }  else {
            helpers.secondaryMessage("Invalid object type");
        }
        return false;
    });
}