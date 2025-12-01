import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { useEffect } from 'react';

export type NotificationType = 'success' | 'error' | 'warning';

interface NotificationProps {
  type: NotificationType;
  message: string;
  onClose: () => void;
  duration?: number;
}

export const Notification = ({ type, message, onClose, duration = 5000 }: NotificationProps) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'from-green-500 to-green-600',
          icon: <CheckCircle className="w-5 h-5" />,
        };
      case 'error':
        return {
          bg: 'from-red-500 to-red-600',
          icon: <XCircle className="w-5 h-5" />,
        };
      case 'warning':
        return {
          bg: 'from-yellow-500 to-yellow-600',
          icon: <AlertCircle className="w-5 h-5" />,
        };
    }
  };

  const styles = getStyles();

  return (
    <div className="fixed top-4 right-4 z-[100] animate-slide-in-right">
      <div className={`bg-gradient-to-r ${styles.bg} text-white px-4 py-3 rounded-lg shadow-2xl max-w-sm flex items-start gap-3 border border-white/20`}>
        <div className="flex-shrink-0 mt-0.5">
          {styles.icon}
        </div>
        <p className="flex-1 text-sm font-medium leading-relaxed">
          {message}
        </p>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:bg-white/20 rounded p-1 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
