const router = require('express').Router();
const verify = require('./verifyToken')
const Post = require('../models/posts')
// Get all posts data
router.get('/', verify, async (req, res) => {
    try {
        const posts = await Post.find();
        // console.log(req.user)
        res.status(200).json(posts)
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
})

// Submit one post to database
router.post('/', verify, async (req, res) => {
    const post = new Post({
        title: req.body.title,
        description: req.body.description
    });
    try {
        let post_data = await post.save();
        // console.log(req.user)
        res.status(201).json(post_data)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Get specific post using id
router.get('/:id', verify, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post === null) return res.status(404).json({ message: "Post does not exits!" })
        // console.log(req.user)
        res.status(200).json(post)
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
})

// Delete specific post using id
router.delete('/:id', verify, async (req, res) => {
    try {
        const post = await Post.remove({ _id: req.params.id });
        // console.log(req.user)
        res.status(201).json(post)
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
})

// Update specific post data using id
router.patch('/:id', verify, async (req, res) => {
    let description = req.body.description;
    let title = req.body.title;
    try {
        const post = await Post.findById(req.params.id)
        if (post === null) return res.status(404).json({ message: "Post does not exits!" })
        const updpost = await Post.updateOne({ _id: req.params.id }, { $set: { title: title === null || title === undefined ? post.title : title, description: description === null || description === undefined ? post.description : description } })
        res.status(201).json(updpost)
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
})

module.exports = router