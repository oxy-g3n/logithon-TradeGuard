import React, { useState } from 'react';
import type { CSSProperties } from 'react';
import { registerUser } from '../utils/api';

type NotificationPreference = 'email' | 'sms' | 'in-app';
type CompanyType = 'sme' | 'logistics' | 'freight' | 'customs';
type UserRole = 'exporter' | 'compliance';

export default function SignUpPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    // Basic Information
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    companyName: '',

    // RBAC
    userRole: '' as UserRole,
    companyType: '' as CompanyType,

    // Business Information
    businessRegNumber: '',
    primaryCountry: '',
    shippingVolume: '',

    // Security
    password: '',
    confirmPassword: '',
    enable2FA: false,
    agreeToTerms: false,

    // Notifications
    notificationPreferences: [] as NotificationPreference[],
    regulatoryAlerts: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === 'checkbox') {
      if (name === 'notificationPreferences') {
        const preferences = [...formData.notificationPreferences] as NotificationPreference[];
        if (checked) {
          preferences.push(value as NotificationPreference);
        } else {
          const index = preferences.indexOf(value as NotificationPreference);
          if (index > -1) preferences.splice(index, 1);
        }
        setFormData(prev => ({ ...prev, notificationPreferences: preferences }));
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Call the registration API
      const response = await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        companyName: formData.companyName,
        userRole: formData.userRole,
        companyType: formData.companyType,
        regNumber: formData.businessRegNumber,
        primaryCountry: formData.primaryCountry,
        shippingVolume: formData.shippingVolume,
        password: formData.password,
      });
      
      if (response.success) {
        // Redirect to login page after successful registration
        window.location.href = '/login';
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // Custom styles for select dropdowns to fix the white text issue
  const selectStyles: CSSProperties = {
    backgroundColor: 'white',
    color: '#374151', // text-gray-700
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.5rem center',
    backgroundSize: '1.5em 1.5em',
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Progress and Logo */}
      <div className="hidden lg:flex lg:w-1/3 bg-gradient-to-br from-[#FF6B00] to-[#1E40AF]">
        <div className="w-full flex flex-col items-center justify-center p-12 text-white">
          <img 
            src="/logo.png" 
            alt="TradeGuard Logo" 
            className="w-32 h-32 object-contain mb-8"
          />
          <h2 className="text-3xl font-bold mb-8">Create Your Account</h2>
          <div className="w-full max-w-xs">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="mb-4">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === step ? 'bg-white text-[#FF6B00]' :
                    currentStep > step ? 'bg-white/20 text-white' :
                    'bg-white/10 text-white/50'
                  }`}>
                    {step}
                  </div>
                  <div className="ml-4">
                    <p className={`font-medium ${
                      currentStep === step ? 'text-white' : 'text-white/70'
                    }`}>
                      {getStepTitle(step)}
                    </p>
                  </div>
                </div>
                {step < 5 && (
                  <div className="h-8 ml-4 border-l-2 border-white/20" />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-12 bg-white/10 backdrop-blur-lg rounded-xl p-6 w-full max-w-xs">
            <h3 className="text-lg font-semibold mb-4">Why Join TradeGuard?</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-[#FF6B00] mr-2">✓</span>
                <span className="text-sm text-white/90">AI-powered compliance verification</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF6B00] mr-2">✓</span>
                <span className="text-sm text-white/90">Real-time shipment monitoring</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF6B00] mr-2">✓</span>
                <span className="text-sm text-white/90">Automated documentation</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF6B00] mr-2">✓</span>
                <span className="text-sm text-white/90">Secure blockchain tracking</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm p-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {getStepTitle(currentStep)}
              <div className="mt-1 h-1 w-24 bg-[#FF6B00] rounded-full"></div>
            </h1>
            <div className="lg:hidden flex items-center text-sm text-gray-500">
              <span className="font-medium text-[#FF6B00]">{currentStep}</span>
              <span className="mx-1">/</span>
              <span>5</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <p className="text-gray-600 mb-4">Let's start with your basic information to set up your account.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="your.email@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="Your Company Ltd."
                  />
                </div>
              </div>
            )}

            {/* Step 2: Role-Based Access Control */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <p className="text-gray-600 mb-4">Tell us about your role and company to customize your experience.</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User Role</label>
                  <select
                    name="userRole"
                    value={formData.userRole}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent text-gray-700 appearance-none"
                    style={selectStyles}
                  >
                    <option value="" className="text-gray-700">Select a role</option>
                    <option value="exporter" className="text-gray-700">Exporter</option>
                    <option value="compliance" className="text-gray-700">Compliance Officer</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    This determines your access level and dashboard view
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Type</label>
                  <select
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent text-gray-700 appearance-none"
                    style={selectStyles}
                  >
                    <option value="" className="text-gray-700">Select company type</option>
                    <option value="sme" className="text-gray-700">SME (Small & Medium Exporters)</option>
                    <option value="logistics" className="text-gray-700">Logistics Provider</option>
                    <option value="freight" className="text-gray-700">Freight Forwarder</option>
                    <option value="customs" className="text-gray-700">Customs Consultant</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Business & Shipping Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <p className="text-gray-600 mb-4">Help us understand your business operations for better compliance support.</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Registration Number</label>
                  <input
                    type="text"
                    name="businessRegNumber"
                    value={formData.businessRegNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="Optional"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    For verified business status (optional)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Country of Operation</label>
                  <input
                    type="text"
                    name="primaryCountry"
                    value={formData.primaryCountry}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="e.g., United States"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Volume Estimate</label>
                  <select
                    name="shippingVolume"
                    value={formData.shippingVolume}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent text-gray-700 appearance-none"
                    style={selectStyles}
                  >
                    <option value="" className="text-gray-700">Select volume</option>
                    <option value="low" className="text-gray-700">Less than 100 shipments/month</option>
                    <option value="medium" className="text-gray-700">100-500 shipments/month</option>
                    <option value="high" className="text-gray-700">500+ shipments/month</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    Helps us optimize your compliance risk profiling
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Security & Authentication */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <p className="text-gray-600 mb-4">Set up your security preferences to protect your account.</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                    title="Minimum 8 characters, including uppercase, lowercase, number, and special character"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent text-gray-900"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Must contain at least 8 characters, including uppercase, lowercase, number, and special character
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent text-gray-900"
                  />
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <input
                      type="checkbox"
                      name="enable2FA"
                      id="enable2FA"
                      checked={formData.enable2FA}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#FF6B00] focus:ring-[#FF6B00] border-gray-300 rounded"
                    />
                    <label htmlFor="enable2FA" className="text-sm font-medium text-gray-700">Enable Two-Factor Authentication (2FA)</label>
                  </div>
                  <p className="text-xs text-gray-500 ml-7">
                    Adds an extra layer of security by requiring a verification code in addition to your password
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    required
                    className="h-4 w-4 text-[#FF6B00] focus:ring-[#FF6B00] border-gray-300 rounded"
                  />
                  <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                    I agree to the <a href="/terms" className="text-[#1E40AF] hover:text-[#FF6B00]">Terms & Conditions</a>
                  </label>
                </div>
              </div>
            )}

            {/* Step 5: Notification Preferences */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <p className="text-gray-600 mb-4">Choose how you'd like to receive updates and notifications.</p>
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Preferred Communication Methods
                  </label>
                  <div className="space-y-3">
                    {[
                      { id: 'email', label: 'Email Notifications', desc: 'Receive detailed updates and reports' },
                      { id: 'sms', label: 'SMS Alerts', desc: 'Get urgent notifications via text message' },
                      { id: 'in-app', label: 'In-App Notifications', desc: 'See alerts when you log in to the platform' }
                    ].map((method) => (
                      <div key={method.id} className="flex items-start p-3 rounded-lg hover:bg-white transition-colors">
                        <input
                          type="checkbox"
                          id={method.id}
                          name="notificationPreferences"
                          value={method.id}
                          checked={formData.notificationPreferences.includes(method.id as NotificationPreference)}
                          onChange={handleInputChange}
                          className="h-5 w-5 mt-0.5 text-[#FF6B00] focus:ring-[#FF6B00] border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <label htmlFor={method.id} className="text-sm font-medium text-gray-700">{method.label}</label>
                          <p className="text-xs text-gray-500">{method.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="regulatoryAlerts"
                    name="regulatoryAlerts"
                    checked={formData.regulatoryAlerts}
                    onChange={handleInputChange}
                    className="h-5 w-5 mt-0.5 text-[#FF6B00] focus:ring-[#FF6B00] border-gray-300 rounded"
                  />
                  <div>
                    <label htmlFor="regulatoryAlerts" className="text-sm font-medium text-gray-700">
                      Subscribe to regulatory update alerts
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Stay informed about changes to trade laws and compliance requirements that may affect your shipments
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
              )}
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-6 py-3 bg-[#FF6B00] text-white rounded-lg hover:bg-[#E65100] flex items-center"
                >
                  Next
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`ml-auto px-6 py-3 bg-[#FF6B00] text-white rounded-lg hover:bg-[#E65100] 
                    ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              )}
            </div>
            
            {/* Login Link */}
            <div className="text-center mt-6 text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-[#1E40AF] hover:text-[#FF6B00] font-medium">
                Sign in
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function getStepTitle(step: number): string {
  switch (step) {
    case 1: return 'Basic Information';
    case 2: return 'Role & Company';
    case 3: return 'Business Details';
    case 4: return 'Security';
    case 5: return 'Preferences';
    default: return '';
  }
} 