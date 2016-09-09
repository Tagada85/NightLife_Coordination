const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let BarsSchema = new Schema({
	bar_id: String,
	going: [String]
});

let Bars = mongoose.model('Bars', BarsSchema);

module.exports = Bars;
