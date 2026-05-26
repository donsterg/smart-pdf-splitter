import { AlertCircle } from 'lucide-react';

export default function ErrorBanner({
  errorMessage,
  showUpgradeButton,
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
            onClick={() => window.location.href = '/upgrade-to-pro'}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors"
          >
            Upgrade to Pro for Unlimited Splitting
          </button>
        </div>
      )}
    </div>
  );
}