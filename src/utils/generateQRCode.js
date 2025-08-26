const qrcode = require('qrcode');
const { totp } = require('../config/totp');

exports.generateQRCode = async (secret) => {
    const otpauthUrl = totp.keyuri('user', 'ExampleApp', secret);
    const qrCodeUrl = await qrcode.toDataURL(otpauthUrl);
    return qrCodeUrl;
};
