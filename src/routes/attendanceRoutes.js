"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const attendanceController_js_1 = require("../controllers/attendanceController.js");
const auth_js_1 = require("../middleware/auth.js");
const validateRoles_js_1 = require("../middleware/validateRoles.js");
const router = (0, express_1.Router)();
// Only DRIVER role can execute QR validation scans
router.post('/validate-qr', auth_js_1.authenticateUser, (0, validateRoles_js_1.validateRoles)(['DRIVER']), attendanceController_js_1.validateQR);
exports.default = router;
//# sourceMappingURL=attendanceRoutes.js.map