// controllers/admin.controller.js
const { validationResult } = require("express-validator");
const User = require("../models/user.model");
const SystemLog = require("../models/systemLogs.model");
const bcrypt = require("bcryptjs");

class AdminController {
  // System Configuration
  static async getSystemConfig(req, res) {
    try {
      // In a real app, this would come from a database
      const config = {
        maintenanceMode: false,
        allowRegistrations: true,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        passwordMinLength: 8,
        requireTwoFactor: false,
        backupFrequency: 'daily',
        logRetentionDays: 30,
        emailVerificationRequired: true,
        apiRateLimit: 1000
      };

      res.json({
        success: true,
        data: config
      });
    } catch (error) {
      console.error("Error fetching system config:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch system configuration"
      });
    }
  }

  static async updateSystemConfig(req, res) {
    try {
      const config = req.body;
      
      // In a real app, save to database
      console.log("Updating system config:", config);

      res.json({
        success: true,
        message: "System configuration updated successfully",
        data: config
      });
    } catch (error) {
      console.error("Error updating system config:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update system configuration"
      });
    }
  }

  // Security Settings
  static async getSecuritySettings(req, res) {
    try {
      const securityConfig = {
        enableAuditLog: true,
        enableIpWhitelist: false,
        enableBruteForceProtection: true,
        enableSuspiciousActivityDetection: true,
        autoLockoutDuration: 30,
        maxConcurrentSessions: 3,
        requireStrongPasswords: true,
        passwordExpiryDays: 90,
        enableCaptcha: false,
        enableDeviceTracking: true
      };

      res.json({
        success: true,
        data: securityConfig
      });
    } catch (error) {
      console.error("Error fetching security settings:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch security settings"
      });
    }
  }

  static async updateSecuritySettings(req, res) {
    try {
      const securityConfig = req.body;
      
      // In a real app, save to database
      console.log("Updating security settings:", securityConfig);

      res.json({
        success: true,
        message: "Security settings updated successfully",
        data: securityConfig
      });
    } catch (error) {
      console.error("Error updating security settings:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update security settings"
      });
    }
  }

  // Audit Logs
  static async getAuditLogs(req, res) {
    try {
      const { limit = 10 } = req.query;
      
      // Mock audit logs data
      const auditLogs = [
        {
          id: 1,
          action: 'User Login',
          user: 'admin@example.com',
          timestamp: new Date().toISOString(),
          ip: '192.168.1.100'
        },
        {
          id: 2,
          action: 'Settings Changed',
          user: 'admin@example.com',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          ip: '192.168.1.100'
        },
        {
          id: 3,
          action: 'User Created',
          user: 'admin@example.com',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          ip: '192.168.1.100'
        },
        {
          id: 4,
          action: 'Password Changed',
          user: 'admin@example.com',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          ip: '192.168.1.100'
        },
        {
          id: 5,
          action: 'System Backup',
          user: 'system',
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          ip: 'localhost'
        }
      ];

      res.json({
        success: true,
        data: auditLogs.slice(0, parseInt(limit))
      });
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch audit logs"
      });
    }
  }

  // Email Templates
  static async getEmailTemplates(req, res) {
    try {
      const templates = [
        {
          id: 'welcome',
          name: 'Welcome Email',
          subject: 'Welcome to {{app_name}}!',
          enabled: true,
          lastModified: new Date().toISOString()
        },
        {
          id: 'password_reset',
          name: 'Password Reset',
          subject: 'Reset Your Password',
          enabled: true,
          lastModified: new Date().toISOString()
        },
        {
          id: 'account_locked',
          name: 'Account Locked',
          subject: 'Your Account Has Been Locked',
          enabled: true,
          lastModified: new Date().toISOString()
        },
        {
          id: 'weekly_report',
          name: 'Weekly Report',
          subject: 'Your Weekly Activity Report',
          enabled: false,
          lastModified: new Date().toISOString()
        }
      ];

      res.json({
        success: true,
        data: templates
      });
    } catch (error) {
      console.error("Error fetching email templates:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch email templates"
      });
    }
  }

  static async updateEmailTemplate(req, res) {
    try {
      const { templateId } = req.params;
      const templateData = req.body;
      
      console.log("Updating email template:", templateId, templateData);

      res.json({
        success: true,
        message: "Email template updated successfully",
        data: { ...templateData, id: templateId, lastModified: new Date().toISOString() }
      });
    } catch (error) {
      console.error("Error updating email template:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update email template"
      });
    }
  }

  // API Management
  static async getAPIKeys(req, res) {
    try {
      const apiKeys = [
        {
          id: 1,
          name: 'Production API',
          key: 'pk_live_****',
          status: 'active',
          created: new Date().toISOString(),
          lastUsed: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Development API',
          key: 'pk_test_****',
          status: 'active',
          created: new Date().toISOString(),
          lastUsed: null
        }
      ];

      res.json({
        success: true,
        data: apiKeys
      });
    } catch (error) {
      console.error("Error fetching API keys:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch API keys"
      });
    }
  }

  static async createAPIKey(req, res) {
    try {
      const { name } = req.body;
      
      const newKey = {
        id: Date.now(),
        name,
        key: `pk_${Math.random().toString(36).substr(2, 9)}`,
        status: 'active',
        created: new Date().toISOString(),
        lastUsed: null
      };

      res.json({
        success: true,
        message: "API key created successfully",
        data: newKey
      });
    } catch (error) {
      console.error("Error creating API key:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create API key"
      });
    }
  }

  static async deleteAPIKey(req, res) {
    try {
      const { keyId } = req.params;
      
      console.log("Deleting API key:", keyId);

      res.json({
        success: true,
        message: "API key revoked successfully"
      });
    } catch (error) {
      console.error("Error deleting API key:", error);
      res.status(500).json({
        success: false,
        message: "Failed to revoke API key"
      });
    }
  }

  static async getWebhooks(req, res) {
    try {
      const webhooks = [
        {
          id: 1,
          url: 'https://example.com/webhook',
          events: ['user.created', 'user.updated'],
          status: 'active'
        }
      ];

      res.json({
        success: true,
        data: webhooks
      });
    } catch (error) {
      console.error("Error fetching webhooks:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch webhooks"
      });
    }
  }

  static async getAPIStats(req, res) {
    try {
      const stats = {
        totalRequests: 15420,
        successRate: 99.2,
        avgResponseTime: 245,
        activeKeys: 2
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error("Error fetching API stats:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch API statistics"
      });
    }
  }

  // Backup Management
  static async getBackups(req, res) {
    try {
      const backups = [
        {
          id: 1,
          name: 'Auto Backup - 2024-01-15',
          size: '245 MB',
          created: new Date().toISOString(),
          type: 'automatic',
          status: 'completed'
        },
        {
          id: 2,
          name: 'Manual Backup - 2024-01-14',
          size: '238 MB',
          created: new Date(Date.now() - 86400000).toISOString(),
          type: 'manual',
          status: 'completed'
        }
      ];

      res.json({
        success: true,
        data: backups
      });
    } catch (error) {
      console.error("Error fetching backups:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch backups"
      });
    }
  }

  static async createBackup(req, res) {
    try {
      const { name, type } = req.body;
      
      const newBackup = {
        id: Date.now(),
        name,
        size: `${Math.floor(Math.random() * 100 + 200)} MB`,
        created: new Date().toISOString(),
        type,
        status: 'completed'
      };

      res.json({
        success: true,
        message: "Backup created successfully",
        data: newBackup
      });
    } catch (error) {
      console.error("Error creating backup:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create backup"
      });
    }
  }

  static async restoreBackup(req, res) {
    try {
      const { backupId } = req.params;
      
      console.log("Restoring backup:", backupId);

      res.json({
        success: true,
        message: "Backup restoration initiated"
      });
    } catch (error) {
      console.error("Error restoring backup:", error);
      res.status(500).json({
        success: false,
        message: "Failed to restore backup"
      });
    }
  }

  static async downloadBackup(req, res) {
    try {
      const { backupId } = req.params;
      
      // In a real app, this would stream the actual backup file
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename=backup-${backupId}.zip`);
      res.send(Buffer.from('Mock backup file content'));
    } catch (error) {
      console.error("Error downloading backup:", error);
      res.status(500).json({
        success: false,
        message: "Failed to download backup"
      });
    }
  }

  // Change Password
  static async changePassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array()
        });
      }

      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // Get user from database
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect"
        });
      }

      // Hash new password
      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password in database
      await User.findByIdAndUpdate(userId, {
        password: hashedNewPassword,
        passwordChangedAt: new Date()
      });

      // Log the password change
      await SystemLog.create({
        level: 'info',
        message: `Password changed for user ${user.email}`,
        source: 'auth',
        userId: userId,
        metadata: {
          action: 'password_change',
          userEmail: user.email
        }
      });

      res.json({
        success: true,
        message: "Password changed successfully"
      });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({
        success: false,
        message: "Failed to change password"
      });
    }
  }
}

module.exports = AdminController;
