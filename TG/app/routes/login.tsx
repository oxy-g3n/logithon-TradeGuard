import React, { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement actual authentication logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Welcome Text */}
          <div className="text-center">
            <div className="flex flex-col items-center mb-6">
              <img 
                src="/logo.png" 
                alt="TradeGuard Logo" 
                className="w-32 h-32 object-contain mb-4"
              />
              <h1 className="text-4xl font-bold text-[#FF6B00]">TradeGuard</h1>
            </div>
            <p className="text-gray-600">Welcome back! Please login to your account.</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#FF6B00] focus:ring-[#FF6B00] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <a href="/forgot-password" className="text-sm text-[#1E40AF] hover:text-[#FF6B00]">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg
                text-white text-lg font-medium bg-[#FF6B00] hover:bg-[#E65100] focus:outline-none
                focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B00] transition-colors
                ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>

            <div className="text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <div className="text-sm">
                <span className="text-gray-600">New to TradeGuard? </span>
                <a 
                  href="/signup" 
                  className="text-[#1E40AF] hover:text-[#FF6B00] font-medium flex items-center justify-center space-x-2 group"
                >
                  <span>Create an account</span>
                  <svg 
                    className="w-4 h-4 transform transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Image and Features */}
      <div className="hidden md:block w-1/2 bg-gradient-to-br from-[#FF6B00] to-[#1E40AF] p-8">
        <div className="h-full flex flex-col justify-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white">
            <div className="flex items-center mb-8">
              <img 
                src="/logo.png" 
                alt="TradeGuard Logo" 
                className="w-12 h-12 object-contain mr-4"
              />
              <h2 className="text-3xl font-bold">Secure Access to TradeGuard</h2>
            </div>
            <div className="space-y-4">
              <FeatureItem
                icon="🔒"
                title="Enhanced Security"
                description="Multi-factor authentication and encrypted data transmission"
              />
              <FeatureItem
                icon="⚡"
                title="Quick Access"
                description="Fast access to your compliance dashboard and shipment status"
              />
              <FeatureItem
                icon="📊"
                title="Real-time Updates"
                description="Instant notifications about compliance checks and shipment verification"
              />
            </div>

            <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-2">New to TradeGuard?</h3>
              <p className="text-sm text-white/80 mb-4">
                Join thousands of businesses managing their trade compliance efficiently.
              </p>
              <a 
                href="/signup"
                className="inline-flex items-center space-x-2 text-white hover:text-[#FF6B00] transition-colors"
              >
                <span>Sign up now</span>
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="text-2xl">{icon}</div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-white/80 text-sm">{description}</p>
      </div>
    </div>
  );
} 