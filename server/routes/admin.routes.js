// routes/admin.routes.js
const express = require("express");
const { body } = require("express-validator");
const AdminController = require("../controllers/admin.controller");
const { authenticateToken, requireAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

// Apply authentication and admin middleware to all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

// System Configuration Routes
router.get("/system-config", AdminController.getSystemConfig);
router.put("/system-config", AdminController.updateSystemConfig);

// Security Settings Routes
router.get("/security-settings", AdminController.getSecuritySettings);
router.put("/security-settings", AdminController.updateSecuritySettings);

// Audit Logs Routes
router.get("/audit-logs", AdminController.getAuditLogs);

// Email Templates Routes
router.get("/email-templates", AdminController.getEmailTemplates);
router.put("/email-templates/:templateId", AdminController.updateEmailTemplate);

// API Management Routes
router.get("/api-keys", AdminController.getAPIKeys);
router.post("/api-keys", AdminController.createAPIKey);
router.delete("/api-keys/:keyId", AdminController.deleteAPIKey);
router.get("/webhooks", AdminController.getWebhooks);
router.get("/api-stats", AdminController.getAPIStats);

// Backup Management Routes
router.get("/backups", AdminController.getBackups);
router.post("/backups", AdminController.createBackup);
router.post("/backups/:backupId/restore", AdminController.restoreBackup);
router.get("/backups/:backupId/download", AdminController.downloadBackup);

// Change Password Route
router.put("/change-password", [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage("New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Password confirmation does not match new password");
      }
      return true;
    })
], AdminController.changePassword);

module.exports = router;
