import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
    URL: { type: String, required: true },
    shortURL: { type: String, required: true },
    shortcode: { type: String, required: true },
    clicks: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const URL = mongoose.model('URL', urlSchema);

export default URL;
