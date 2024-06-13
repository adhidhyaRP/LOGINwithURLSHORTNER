import express from 'express';
import Post from '../models/post.js';

const router = express.Router();

router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.send(posts);
    } catch (error) {
        console.log('Error fetching posts:', error);
        res.status(500).send({ status: false, message: 'Error fetching posts' });
    }
});

export default router;
