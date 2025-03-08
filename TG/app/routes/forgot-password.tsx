import React from 'react';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold text-[#FF6B00] mb-6 text-center">Reset Password</h1>
        <p className="text-gray-600 mb-6 text-center">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
        
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 px-4 border border-transparent rounded-lg
              text-white text-lg font-medium bg-[#FF6B00] hover:bg-[#E65100] focus:outline-none
              focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B00] transition-colors"
          >
            Send Reset Link
          </button>
          
          <div className="text-center text-sm">
            <a 
              href="/login" 
              className="text-[#1E40AF] hover:text-[#FF6B00] font-medium"
            >
              Back to login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
} 