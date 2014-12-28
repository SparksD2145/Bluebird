var mongoose = module.require('mongoose');
var Schema = mongoose.Schema;

var _ = require('underscore');
var moment = module.require('moment');

var changelogItemSchema = new Schema({
    date: Date,
    changes: Array,
    appVersion: String
}, {
    collection: 'changelog',
    index: { appVersion: -1 },
    autoIndex: false
});

changelogItemSchema.methods.addDate = function(date){
    if(!date || date && !(date instanceof Date)){
        this.date = moment().toDate();
    } else {
        this.date = date;
    }
};

module.exports = mongoose.model('ChangelogItem', changelogItemSchema);