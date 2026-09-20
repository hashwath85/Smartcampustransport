import { auth, db } from '../config/firebase.js';
export const authenticateUser = async (req, res, next) => {
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
        const decodedToken = await auth.verifyIdToken(token);
        // Fetch profile document to grab system role and assignment IDs
        const userDoc = await db.collection('users').doc(decodedToken.uid).get();
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
