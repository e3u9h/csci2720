/*

DU Fangzhou 1155173892
DING Yuzhou 1155173825
WEI YOUlin  1155157186

*/
const Comment = require('../models/Comment');

exports.getLocationComments = async (req, res) => {
    console.log('req.params.locationId', req.params.locationId);
    try {
        const comments = await Comment.find({ location: req.params.locationId })
            .populate('user', 'username')  // Only get username from user document
            .sort('-createdAt');  // Sort by newest first
        console.log('comments', comments);
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
            user: req.user.id,  // From authenticate middleware
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