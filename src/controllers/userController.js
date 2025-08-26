const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Yetkiniz yok' });
        }

        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Kullanıcıları listeleme hatası', error });
    }
};

exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user._id); // Authenticated user info
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Bilgi çekme hatası', error });
    }
};
