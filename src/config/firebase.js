"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminFieldValue = exports.messaging = exports.auth = exports.db = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const auth_1 = require("firebase-admin/auth");
const messaging_1 = require("firebase-admin/messaging");
dotenv_1.default.config();
const serviceAccountPath = path_1.default.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json');
let app;
if ((0, app_1.getApps)().length === 0) {
    app = (0, app_1.initializeApp)({
        credential: (0, app_1.cert)(require(serviceAccountPath))
    });
}
else {
    app = (0, app_1.getApps)()[0];
}
exports.db = (0, firestore_1.getFirestore)(app);
exports.auth = (0, auth_1.getAuth)(app);
exports.messaging = (0, messaging_1.getMessaging)(app);
exports.adminFieldValue = firestore_1.FieldValue;
//# sourceMappingURL=firebase.js.map