const mongoose =require('mongoose'),
{ Schema } = mongoose;

const NewsSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: false},
    autor: {type: String, required:false, default: 'David Fabian'},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('News', NewsSchema);