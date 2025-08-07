import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  checkProfileCompletion, 
  isActionBlocked, 
  getBlockedActionMessage,
  getProfileCompletionMessage 
} from '../../lib/profile-completion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  User, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  Lock,
  Percent
} from 'lucide-react';

interface ProfileCompletionGuardProps {
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showCompletionModal?: boolean;
}

export const ProfileCompletionGuard: React.FC<ProfileCompletionGuardProps> = ({
  action,
  children,
  fallback,
  showCompletionModal = true
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  
  const status = checkProfileCompletion(user);
  const blocked = isActionBlocked(action, user);

  if (!blocked) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const handleCompleteProfile = () => {
    navigate('/profile');
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const BlockedContent = () => (
    <div className="flex items-center justify-center p-8">
      <div className="w-full max-w-lg">
        <div className="bg-gradient-to-br from-dark-800/90 to-dark-900/90 backdrop-blur-sm rounded-2xl border border-green-500/20 p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Profile Completion Required</h3>
            <p className="text-green-400/80 text-sm">Complete your profile to unlock this feature</p>
          </div>

          {/* Action Message */}
          <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-300">
                {getBlockedActionMessage(action)}
              </p>
            </div>
          </div>

          {/* Progress Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-green-400">Profile Completion</span>
              <span className="text-sm font-bold text-white">{status.completionPercentage}%</span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${status.completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Missing Fields */}
          {status.missingFields.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-white mb-3">Missing Information:</h4>
              <div className="grid grid-cols-1 gap-2">
                {status.missingFields.map((field) => (
                  <div key={field} className="flex items-center p-3 bg-dark-700/50 rounded-lg border border-red-500/20">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                    <span className="text-sm text-green-300 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={handleCompleteProfile}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <User className="w-4 h-4 mr-2" />
              Complete Profile
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCloseModal}
              className="flex-1 border-green-500/30 text-green-400 hover:bg-green-500/10 font-medium rounded-xl transition-all duration-300"
            >
              Cancel
            </Button>
          </div>

          {/* Info Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-green-400/60">
              Complete your profile to unlock all features and improve your experience
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (showCompletionModal) {
    return (
      <>
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={handleCloseModal}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <BlockedContent />
          </div>
        </div>
      </>
    );
  }

  return <BlockedContent />;
};

// Hook for checking profile completion
export const useProfileCompletion = () => {
  const { user } = useAuth();
  const status = checkProfileCompletion(user);
  
  return {
    status,
    isComplete: status.isComplete,
    completionPercentage: status.completionPercentage,
    missingFields: status.missingFields,
    isActionBlocked: (action: string) => isActionBlocked(action, user),
    getBlockedMessage: (action: string) => getBlockedActionMessage(action),
    getCompletionMessage: () => getProfileCompletionMessage(status, user)
  };
}; 