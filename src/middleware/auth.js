"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const express_1 = require("express");
const firebase_js_1 = require("../config/firebase.js");
const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            errorCode: 'ERR_UNAUTHORIZED',
            message: 'Missing or malformed Authorization header'
        });
    }
    const token = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await firebase_js_1.auth.verifyIdToken(token);
        // Fetch profile document to grab system role and assignment IDs
        const userDoc = await firebase_js_1.db.collection('users').doc(decodedToken.uid).get();
        if (!userDoc.exists) {
            return res.status(403).json({
                success: false,
                errorCode: 'ERR_USER_NOT_FOUND',
                message: 'User profile does not exist in system records'
            });
        }
        const userData = userDoc.data();
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email || '',
            role: userData?.role,
            busId: userData?.busId,
            studentId: userData?.studentId,
            driverId: userData?.driverId
        };
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            errorCode: 'ERR_INVALID_TOKEN',
            message: 'Firebase token verification failed'
        });
    }
};
exports.authenticateUser = authenticateUser;
//# sourceMappingURL=auth.js.map