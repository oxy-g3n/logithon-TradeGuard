import React from 'react';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background */}
      <div className="relative bg-gradient-to-b from-white to-gray-50">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000&auto=format"
            alt="Container port background" 
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 pt-24 pb-32">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold text-[#FF6B00] mb-6">Welcome to TradeGaurd</h1>
            <p className="text-2xl text-gray-700 mb-12 max-w-3xl mx-auto">Your Comprehensive Trade Compliance Solution</p>
            <a href="/login" className="inline-block bg-[#FF6B00] text-white px-8 py-4 rounded-lg hover:bg-[#E65100] transition-colors text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Get Started
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <FeatureCard
            title="Smart Compliance Checks"
            description="Automated validation against international trade regulations and standards"
            icon="🔍"
            image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=600&auto=format"
          />
          <FeatureCard
            title="Real-time Monitoring"
            description="Stay updated with instant notifications on shipment status and compliance issues"
            icon="📊"
            image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format"
          />
          <FeatureCard
            title="Document Management"
            description="Centralized storage and management of all trade-related documents"
            icon="📁"
            image="https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?q=80&w=600&auto=format"
          />
        </div>

        {/* Benefits Section with Side Image */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative rounded-2xl overflow-hidden h-[600px]">
            <img 
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format"
              alt="Business professionals working" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#1E40AF] opacity-10"></div>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-[#FF6B00] mb-8">Why Choose TradeGaurd?</h2>
            <div className="space-y-6">
              <BenefitItem
                title="Risk Mitigation"
                description="Reduce compliance risks with our advanced validation system"
              />
              <BenefitItem
                title="Time Efficiency"
                description="Save hours on manual compliance checks and documentation"
              />
              <BenefitItem
                title="Cost Reduction"
                description="Minimize penalties and reduce operational costs"
              />
              <BenefitItem
                title="Global Compliance"
                description="Stay compliant with international trade regulations"
              />
            </div>
          </div>
        </div>

        {/* Call to Action with Background Image */}
        <div className="relative rounded-3xl overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2000&auto=format"
            alt="Global business" 
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <div className="relative bg-gradient-to-r from-[#FF6B00]/90 to-[#1E40AF]/90 p-16 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Trade Operations?</h2>
            <div className="space-x-4">
              <a href="/login" className="inline-block bg-white text-[#FF6B00] px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                Start Now
              </a>
              <a href="/help" className="inline-block bg-[#1E40AF] text-white px-8 py-3 rounded-lg hover:bg-[#1E3A8A] transition-colors font-medium">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon, image }: { title: string; description: string; icon: string; image: string }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-4xl">{icon}</div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#FF6B00] mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function BenefitItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-white transition-colors duration-200">
      <div className="flex-shrink-0 w-8 h-8 bg-[#FF6B00] rounded-full flex items-center justify-center text-white">
        ✓
      </div>
      <div>
        <h3 className="text-lg font-semibold text-[#1E40AF] mb-1">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
} 