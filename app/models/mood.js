const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moodSchema = new Schema({
    mood: {
        type: String,
        required: true,
        enum: ['happy', 'sad', 'neutral']
    },
    date: {
        type: Date, 
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    actions: { 
        type: [String], 
        default: [] 
    },
});

const Mood = mongoose.model('Mood', moodSchema); // Mongoose model is called 'Mood'
// I can use the 'moods' collection in MongoDB using the Mood model. The model is automatically pluralized by Mongoose -_-

module.exports = Mood;

