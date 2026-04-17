import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-6 font-mono">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-[#111111] border border-[#1E1E1E] flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-[#FF6B00]" />
          </div>
        </div>

        {/* 404 */}
        <h1 className="text-8xl font-bold text-[#FF6B00] mb-2 tracking-tight">
          404
        </h1>

        {/* Title */}
        <h2 className="text-xl font-semibold text-white mb-3">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          The page you are looking for does not exist or has been moved.
          Check the URL and try again.
        </p>

        {/* Divider */}
        <div className="border-t border-[#1E1E1E] mb-8" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 text-sm text-gray-400 border border-[#1E1E1E] rounded-lg hover:bg-[#1E1E1E] hover:text-white transition-colors"
          >
            ← Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#FF6B00] rounded-lg hover:bg-[#e05f00] transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
