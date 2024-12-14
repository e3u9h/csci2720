const Comment = require('../models/Comment');

exports.getLocationComments = async (req, res) => {
    try {
        const comments = await Comment.find({ location: req.params.locationId })
            .populate('user', 'username')  // Only get username from user document
            .sort('-createdAt');  // Sort by newest first
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Error fetching comments' });
    }
};

exports.addComment = async (req, res) => {
    try {
        const comment = new Comment({
            text: req.body.text,
            user: req.user._id,  // From authenticate middleware
            location: req.params.locationId,
        });

        await comment.save();
        await comment.populate('user', 'username');
        
        res.status(201).json(comment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(400).json({ message: 'Error adding comment' });
    }
};