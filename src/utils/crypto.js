"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyQRSignature = exports.generateQRHmac = void 0;
const crypto_1 = __importDefault(require("crypto"));
const QR_SECRET = process.env.QR_SECRET_KEY || 'default_insecure_secret_key_32chars';
const generateQRHmac = (studentId, busId, timestamp) => {
    const payload = `${studentId}|${busId}|${timestamp}`;
    return crypto_1.default.createHmac('sha256', QR_SECRET).update(payload).digest('hex');
};
exports.generateQRHmac = generateQRHmac;
const verifyQRSignature = (studentId, busId, timestamp, providedSignature) => {
    const expectedSignature = (0, exports.generateQRHmac)(studentId, busId, timestamp);
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    const providedBuffer = Buffer.from(providedSignature, 'hex');
    if (expectedBuffer.length !== providedBuffer.length) {
        return false;
    }
    return crypto_1.default.timingSafeEqual(expectedBuffer, providedBuffer);
};
exports.verifyQRSignature = verifyQRSignature;
//# sourceMappingURL=crypto.js.map