import React from 'react';
import { Moon, Sun, Palette, Bell, Shield, User, Globe, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { useTheme } from '../../contexts/ThemeContext';

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const settingsSections = [
    {
      title: 'Appearance',
      icon: <Palette className="w-6 h-6 text-primary-400" />,
      description: 'Customize your workspace appearance',
      items: [
        {
          label: 'Theme',
          description: 'Choose between dark and light mode',
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="flex items-center space-x-2"
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="w-4 h-4" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4" />
                  <span>Light Mode</span>
                </>
              )}
            </Button>
          ),
        },
      ],
    },
    {
      title: 'Notifications',
      icon: <Bell className="w-6 h-6 text-accent-400" />,
      description: 'Manage your notification preferences',
      items: [
        {
          label: 'Email Notifications',
          description: 'Receive updates via email',
          action: <Button variant="outline" size="sm">Configure</Button>,
        },
        {
          label: 'Push Notifications',
          description: 'Get real-time alerts',
          action: <Button variant="outline" size="sm">Configure</Button>,
        },
      ],
    },
    {
      title: 'Security',
      icon: <Shield className="w-6 h-6 text-primary-500" />,
      description: 'Manage your account security',
      items: [
        {
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security',
          action: <Button variant="outline" size="sm">Enable</Button>,
        },
        {
          label: 'Password',
          description: 'Change your account password',
          action: <Button variant="outline" size="sm">Update</Button>,
        },
      ],
    },
    {
      title: 'Account',
      icon: <User className="w-6 h-6 text-accent-500" />,
      description: 'Manage your account settings',
      items: [
        {
          label: 'Profile Information',
          description: 'Update your personal details',
          action: <Button variant="outline" size="sm">Edit</Button>,
        },
        {
          label: 'Privacy Settings',
          description: 'Control your privacy preferences',
          action: <Button variant="outline" size="sm">Configure</Button>,
        },
      ],
    },
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white min-h-full">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 transform transition-transform duration-300 hover:scale-105">
          <h1 className="text-4xl font-bold text-white dark:text-white text-green-800 mb-2">
            Settings
          </h1>
          <p className="text-dark-300 dark:text-dark-300 text-green-600 text-lg">
            Manage your account preferences and settings.
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appearance */}
          <Card className="glass-effect neon-border p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <h3 className="text-xl font-semibold text-white dark:text-white text-green-800 mb-4">
              Appearance
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white dark:text-white text-green-800 font-medium">
                    Theme Mode
                  </p>
                  <p className="text-dark-300 dark:text-dark-300 text-green-600 text-sm">
                    Choose your preferred theme
                  </p>
                </div>
                <Button
                  onClick={toggleTheme}
                  variant="outline"
                  className="border-green-200 text-green-800 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-900/20 transform transition-all duration-300 hover:scale-105"
                >
                  {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Account */}
          <Card className="glass-effect neon-border p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <h3 className="text-xl font-semibold text-white dark:text-white text-green-800 mb-4">
              Account
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-white dark:text-white text-green-800 font-medium mb-2">
                  Profile Information
                </p>
                <p className="text-dark-300 dark:text-dark-300 text-green-600 text-sm mb-4">
                  Update your personal information and preferences
                </p>
                <Button
                  variant="outline"
                  className="border-green-200 text-green-800 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-900/20 transform transition-all duration-300 hover:scale-105"
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="glass-effect neon-border p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <h3 className="text-xl font-semibold text-white dark:text-white text-green-800 mb-4">
              Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between transform transition-all duration-300 hover:scale-105">
                <div>
                  <p className="text-white dark:text-white text-green-800 font-medium">
                    Email Notifications
                  </p>
                  <p className="text-dark-300 dark:text-dark-300 text-green-600 text-sm">
                    Receive updates about orders and messages
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-dark-700 dark:bg-dark-700 bg-green-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-dark-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:peer-checked:bg-green-600 peer-checked:bg-green-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between transform transition-all duration-300 hover:scale-105">
                <div>
                  <p className="text-white dark:text-white text-green-800 font-medium">
                    Push Notifications
                  </p>
                  <p className="text-dark-300 dark:text-dark-300 text-green-600 text-sm">
                    Get real-time updates in your browser
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-dark-700 dark:bg-dark-700 bg-green-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-dark-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:peer-checked:bg-green-600 peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>
          </Card>

          {/* Security */}
          <Card className="glass-effect neon-border p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <h3 className="text-xl font-semibold text-white dark:text-white text-green-800 mb-4">
              Security
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-white dark:text-white text-green-800 font-medium mb-2">
                  Password
                </p>
                <p className="text-dark-300 dark:text-dark-300 text-green-600 text-sm mb-4">
                  Update your password to keep your account secure
                </p>
                <Button
                  variant="outline"
                  className="border-green-200 text-green-800 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-900/20 transform transition-all duration-300 hover:scale-105"
                >
                  Change Password
                </Button>
              </div>
            </div>
          </Card>

          {/* Privacy */}
          <Card className="glass-effect neon-border p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <h3 className="text-xl font-semibold text-white dark:text-white text-green-800 mb-4">
              Privacy
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between transform transition-all duration-300 hover:scale-105">
                <div>
                  <p className="text-white dark:text-white text-green-800 font-medium">
                    Profile Visibility
                  </p>
                  <p className="text-dark-300 dark:text-dark-300 text-green-600 text-sm">
                    Control who can see your profile
                  </p>
                </div>
                <select className="bg-dark-800 dark:bg-dark-800 bg-white border border-green-200 text-green-800 dark:text-green-400 dark:border-green-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transform transition-all duration-300 hover:scale-105">
                  <option>Public</option>
                  <option>Private</option>
                  <option>Friends Only</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Billing */}
          <Card className="glass-effect neon-border p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <h3 className="text-xl font-semibold text-white dark:text-white text-green-800 mb-4">
              Billing
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-white dark:text-white text-green-800 font-medium mb-2">
                  Payment Methods
                </p>
                <p className="text-dark-300 dark:text-dark-300 text-green-600 text-sm mb-4">
                  Manage your payment information
                </p>
                <Button
                  variant="outline"
                  className="border-green-200 text-green-800 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-900/20 transform transition-all duration-300 hover:scale-105"
                >
                  Manage Payments
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}; 