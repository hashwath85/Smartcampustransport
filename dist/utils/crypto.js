import crypto from 'crypto';
const QR_SECRET = process.env.QR_SECRET_KEY || 'default_insecure_secret_key_32chars';
export const generateQRHmac = (studentId, busId, timestamp) => {
    const payload = `${studentId}|${busId}|${timestamp}`;
    return crypto.createHmac('sha256', QR_SECRET).update(payload).digest('hex');
};
export const verifyQRSignature = (studentId, busId, timestamp, providedSignature) => {
    const expectedSignature = generateQRHmac(studentId, busId, timestamp);
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    const providedBuffer = Buffer.from(providedSignature, 'hex');
    if (expectedBuffer.length !== providedBuffer.length) {
        return false;
    }
    return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
};
