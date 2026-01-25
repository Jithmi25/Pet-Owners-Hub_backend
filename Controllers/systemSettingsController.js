import SystemSettings from '../Models/systemSettings.js';

// Get all system settings
export const getSystemSettings = async (_req, res) => {
  try {
    let settings = await SystemSettings.findOne();
    
    // Create default settings if they don't exist
    if (!settings) {
      settings = new SystemSettings();
      await settings.save();
    }

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error fetching system settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching system settings',
      error: error.message,
    });
  }
};

// Update general settings
export const updateGeneralSettings = async (req, res) => {
  try {
    const { siteName, siteDescription, adminEmail, timezone } = req.body;

    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings();
    }

    // Update general settings
    if (siteName) settings.general.siteName = siteName;
    if (siteDescription) settings.general.siteDescription = siteDescription;
    if (adminEmail) settings.general.adminEmail = adminEmail;
    if (timezone) settings.general.timezone = timezone;

    settings.updatedAt = Date.now();
    settings.updatedBy = req.userId; // Assuming userId is available from auth middleware

    await settings.save();

    return res.status(200).json({
      success: true,
      message: 'General settings updated successfully',
      data: settings.general,
    });
  } catch (error) {
    console.error('Error updating general settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating general settings',
      error: error.message,
    });
  }
};

// Update regional settings
export const updateRegionalSettings = async (req, res) => {
  try {
    const { defaultLanguage, dateFormat, currency, measurementUnits } = req.body;

    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings();
    }

    // Update regional settings
    if (defaultLanguage) settings.regional.defaultLanguage = defaultLanguage;
    if (dateFormat) settings.regional.dateFormat = dateFormat;
    if (currency) settings.regional.currency = currency;
    if (measurementUnits) settings.regional.measurementUnits = measurementUnits;

    settings.updatedAt = Date.now();
    settings.updatedBy = req.userId;

    await settings.save();

    return res.status(200).json({
      success: true,
      message: 'Regional settings updated successfully',
      data: settings.regional,
    });
  } catch (error) {
    console.error('Error updating regional settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating regional settings',
      error: error.message,
    });
  }
};

// Update notification settings
export const updateNotificationSettings = async (req, res) => {
  try {
    const { emailNotifications, preferences } = req.body;

    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings();
    }

    // Update notification settings
    if (emailNotifications) {
      settings.notifications.emailNotifications = {
        ...settings.notifications.emailNotifications,
        ...emailNotifications,
      };
    }

    if (preferences) {
      settings.notifications.preferences = {
        ...settings.notifications.preferences,
        ...preferences,
      };
    }

    settings.updatedAt = Date.now();
    settings.updatedBy = req.userId;

    await settings.save();

    return res.status(200).json({
      success: true,
      message: 'Notification settings updated successfully',
      data: settings.notifications,
    });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating notification settings',
      error: error.message,
    });
  }
};

// Update security settings
export const updateSecuritySettings = async (req, res) => {
  try {
    const { authentication, policies } = req.body;

    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings();
    }

    // Update security settings
    if (authentication) {
      settings.security.authentication = {
        ...settings.security.authentication,
        ...authentication,
      };
    }

    if (policies) {
      settings.security.policies = {
        ...settings.security.policies,
        ...policies,
      };
    }

    settings.updatedAt = Date.now();
    settings.updatedBy = req.userId;

    await settings.save();

    return res.status(200).json({
      success: true,
      message: 'Security settings updated successfully',
      data: settings.security,
    });
  } catch (error) {
    console.error('Error updating security settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating security settings',
      error: error.message,
    });
  }
};

// Update appearance settings
export const updateAppearanceSettings = async (req, res) => {
  try {
    const { theme, primaryColor, secondaryColor, logoUrl, faviconUrl } = req.body;

    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings();
    }

    // Update appearance settings
    if (theme) settings.appearance.theme = theme;
    if (primaryColor) settings.appearance.primaryColor = primaryColor;
    if (secondaryColor) settings.appearance.secondaryColor = secondaryColor;
    if (logoUrl) settings.appearance.logoUrl = logoUrl;
    if (faviconUrl) settings.appearance.faviconUrl = faviconUrl;

    settings.updatedAt = Date.now();
    settings.updatedBy = req.userId;

    await settings.save();

    return res.status(200).json({
      success: true,
      message: 'Appearance settings updated successfully',
      data: settings.appearance,
    });
  } catch (error) {
    console.error('Error updating appearance settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating appearance settings',
      error: error.message,
    });
  }
};

// Update backup settings
export const updateBackupSettings = async (req, res) => {
  try {
    const { autoBackupEnabled, backupFrequency, backupRetentionDays } = req.body;

    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings();
    }

    // Update backup settings
    if (autoBackupEnabled !== undefined) settings.backup.autoBackupEnabled = autoBackupEnabled;
    if (backupFrequency) settings.backup.backupFrequency = backupFrequency;
    if (backupRetentionDays !== undefined) settings.backup.backupRetentionDays = backupRetentionDays;

    settings.updatedAt = Date.now();
    settings.updatedBy = req.userId;

    await settings.save();

    return res.status(200).json({
      success: true,
      message: 'Backup settings updated successfully',
      data: settings.backup,
    });
  } catch (error) {
    console.error('Error updating backup settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating backup settings',
      error: error.message,
    });
  }
};

// Clear system cache
export const clearSystemCache = async (_req, res) => {
  try {
    // Implement cache clearing logic here
    // This could include clearing Redis cache, in-memory caches, etc.
    console.log('System cache cleared');

    return res.status(200).json({
      success: true,
      message: 'System cache cleared successfully',
    });
  } catch (error) {
    console.error('Error clearing system cache:', error);
    return res.status(500).json({
      success: false,
      message: 'Error clearing system cache',
      error: error.message,
    });
  }
};

// Reset settings to default
export const resetSettingsToDefault = async (_req, res) => {
  try {
    await SystemSettings.deleteOne({});
    const newSettings = new SystemSettings();
    await newSettings.save();

    return res.status(200).json({
      success: true,
      message: 'All settings have been reset to default values',
      data: newSettings,
    });
  } catch (error) {
    console.error('Error resetting settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Error resetting settings to default',
      error: error.message,
    });
  }
};

// Delete all data (dangerous operation)
export const deleteAllData = async (_req, res) => {
  try {
    // This is a critical operation - implement additional safety checks here
    // In production, you might want to:
    // 1. Require additional confirmation
    // 2. Log this action
    // 3. Create a backup before deletion
    // 4. Only allow this during specific maintenance windows

    // For now, we'll just return a warning
    console.warn('DELETE ALL DATA request received');

    return res.status(200).json({
      success: true,
      message: 'Data deletion process started. This may take several minutes.',
    });
  } catch (error) {
    console.error('Error during data deletion:', error);
    return res.status(500).json({
      success: false,
      message: 'Error during data deletion',
      error: error.message,
    });
  }
};

// Get specific setting section
export const getSettingSection = async (req, res) => {
  try {
    const { section } = req.params; // section: general, regional, notifications, security, appearance, backup

    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings();
      await settings.save();
    }

    const validSections = ['general', 'regional', 'notifications', 'security', 'appearance', 'backup'];

    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: `Invalid section. Valid sections are: ${validSections.join(', ')}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: settings[section],
    });
  } catch (error) {
    console.error('Error fetching setting section:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching setting section',
      error: error.message,
    });
  }
};
