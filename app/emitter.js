let $ = require('jquery');

function Emitter(){
    this.donor = $(document);
}

Emitter.prototype = {
    emit: function emit(evt, data){
        this.donor.trigger(evt, [data])
    },

    on: function on(evt, fn){
        this.donor.on(evt, fn);
    }
};

module.exports = new Emitter();