const bcrypt = require('bcrypt');
const User = require('../models/User');
const { totp } = require('../config/totp');
const generateQRCode = require('../utils/generateQRCode');

exports.register = async (req, res) => {
    try {
        const { username, password, email, role } = req.body;

        if (!['admin', 'employee'].includes(role)) {
            return res.status(400).json({ message: 'Geçersiz rol' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const totpSecret = totp.generateSecret();

        const user = new User({
            username,
            passwordHash,
            email,
            role,
            totpSecret,
        });

        await user.save();

        const qrCodeUrl = await generateQRCode(totpSecret);

        res.status(201).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} kaydedildi.`, qrCodeUrl });
    } catch (error) {
        res.status(500).json({ message: 'Kayıt sırasında hata oluştu', error });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password, totpToken } = req.body;
        const user = await User.findOne({ username });

        if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) return res.status(401).json({ message: 'Şifre hatalı' });

        if (user.isTotpEnabled) {
            const isTokenValid = totp.verify({ token: totpToken, secret: user.totpSecret });
            if (!isTokenValid) return res.status(401).json({ message: 'TOTP doğrulaması başarısız' });
        }

        res.status(200).json({ message: 'Giriş başarılı', userRole: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Giriş sırasında hata oluştu', error });
    }
};
