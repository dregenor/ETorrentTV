let numeral = require('numeral');
let $ = require('jquery');
let helpers = {
    isMac: navigator.userAgent.indexOf('Mac OS X') != -1,
    showMessage: function showMessage(message) {
        $('#top-message').innerHTML = message
    },

    secondaryMessage: function secondaryMessage(message) {
        $('#info-message').innerHTML = message
    },

    bytes: function bytes(num) {
        return numeral(num).format('0.0b');
    },

    statusMessage: function statusMessage(unchoked, wires, swarm) {
        $('#box-message').innerHTML = "Peers: " +
            unchoked.length + "/" +
            wires.length +
            "</br> Speed: " +
            helpers.bytes(swarm.downloadSpeed()) +
            "/s</br>  Downloaded: " +
            helpers.bytes(swarm.downloaded)
    },

    cleanStatus: function cleanStatus() {
        $('#box-message').innerHTML = ""
    },

    intervalArr: [],

    addInterval: function(fn, interval){
        helpers.intervalArr.push(setInterval(fn,interval));
    },

    killIntervals: function killIntervals(){
        //console.log("Killing all intervals");
        while(helpers.intervalArr.length > 0){
            clearInterval(helpers.intervalArr.pop());
        }
    },

    isTorrenting: false,
    lockTorrenting: function(){
        helpers.isTorrenting = true;
    },

    unlockTorrenting: function(){
        helpers.isTorrenting = false;
    },


    GlobalHref: "0.0.0.0:8000",
    setGlobalHref: function setGlobalHref(href){
        helpers.GlobalHref = href;
    },
    lastPlayed: '',
    setLastPlayed: function setLastPlayed(src){
        helpers.lastPlayed = src;
    },

    devices: [],
    activeDevice: null,
    addDevice: function addDeviceElement(device){
        let name = device.name;

        let index = device.length;
        helpers.devices.push(device);
        $('#dropmessage').css({height:'100px'});
        $('#airplay').append(
            '<div class="js-toggle-device" data-device-id="'+ index + '" class="device">' +
                '<img class="js-airplay-icon" class="deviceicon"/> ' +
                '<p class="dev-name" style="margin-top:-10px;">' + name + '</p> ' +
                '<p class="js-off offlabel" style="margin-top:-60px;">OFF</p> ' +
            '</div>'
        );
        if(helpers.devices.length === 1){
            helpers.setActiveDevice(0);
        }
    },
    setActiveDevice: function setActiveDevice(id){
        helpers.activeDevice = helpers.devices[id];
    },


    toggleDevice: function toggleDevice(e){
        let $el = $(e.currentTarget);
        let id = $el.data('deviceId');
        helpers.setActiveDevice(id);

        if(helpers.devices[id].playing){
            helpers.devices[id].stop();
        }

        $el.find('js-off').toggleClass('offlabel');
        $el.find('airplay-icon').toggleClass('deviceiconOff');
    }

};

module.exports = helpers;