import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    photo: { type: String, required: true, unique: true },
    likesCount: { type: Number, required: true }
});

const Post = mongoose.model('Post', postSchema);

export default Post;
