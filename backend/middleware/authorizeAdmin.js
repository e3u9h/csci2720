/*

DU Fangzhou 1155173892
DING Yuzhou 1155173825
WEI YOUlin  1155157186

*/
module.exports = function (req, res, next) {
    if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Access denied, admin only' });
    }
    next();
};