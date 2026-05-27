import { AlertCircle } from 'lucide-react';
import { redirectToCheckout } from '../services/stripeService';

export default function ErrorBanner({
  errorMessage,
  showUpgradeButton,
  user,
}) {
  if (!errorMessage) return null;

  return (
    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md shadow-sm">
      <div className="flex items-center gap-3">
        <AlertCircle size={20} className="shrink-0" />
        <span className="font-medium">
          <strong>Error:</strong> {errorMessage}
        </span>
      </div>

      {showUpgradeButton && (
        <div className="mt-4">
          <button
                onClick={() => redirectToCheckout(user)}
                className="
                  mt-4
                  bg-indigo-600
                  text-white
                  px-4
                  py-2
                  rounded-lg
                  hover:bg-indigo-700
                  transition-colors
                "
              >
                Upgrade to Pro for unlimited splitting
        </button>
        </div>
      )}
    </div>
  );
}