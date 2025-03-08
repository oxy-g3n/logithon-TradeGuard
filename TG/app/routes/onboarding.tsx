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
            <div className="flex flex-col items-center mb-8">
              <img 
                src="/logo.png" 
                alt="TradeGuard Logo" 
                className="w-40 h-40 object-contain mb-6"
              />
              <h1 className="text-6xl font-bold text-[#FF6B00] mb-6">TradeGuard</h1>
            </div>
            <p className="text-2xl text-gray-700 mb-12 max-w-3xl mx-auto">
              AI-Powered Compliance Verification for Cross-Border Shipments
            </p>
            <p className="text-lg text-gray-600 mb-12 max-w-4xl mx-auto">
              An intelligent compliance management system designed to help exporters, logistics companies, and small businesses 
              automate shipment verification and ensure regulatory compliance before parcels are handed over to couriers.
            </p>
            <a href="/login" className="inline-block bg-[#FF6B00] text-white px-8 py-4 rounded-lg hover:bg-[#E65100] transition-colors text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Get Started
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          <FeatureCard
            title="Intelligent Data Ingestion"
            description="Multiple data input methods including manual entry, bulk upload, API integrations with major couriers, and OCR scanning powered by Google Cloud Vision."
            icon="📥"
            image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=600&auto=format"
            items={[
              "Manual Entry Form",
              "Bulk Upload (CSV/Excel)",
              "Courier API Integrations",
              "OCR Document Scanning"
            ]}
          />
          <FeatureCard
            title="Rule-Based Compliance"
            description="Real-time validation engine ensuring shipments meet legal and regulatory standards across borders."
            icon="✓"
            image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format"
            items={[
              "Restricted Item Detection",
              "HS Code Verification",
              "Destination Regulations",
              "AI-Powered Risk Analysis"
            ]}
          />
          <FeatureCard
            title="Interactive Dashboard"
            description="Intuitive, data-driven interface for real-time shipment monitoring and risk assessment."
            icon="📊"
            image="https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?q=80&w=600&auto=format"
            items={[
              "Real-time Compliance Status",
              "Risk Heatmaps",
              "AI Fix Suggestions",
              "Live Alerts & Notifications"
            ]}
          />
        </div>

        {/* Advanced Features Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative rounded-2xl overflow-hidden h-[600px]">
            <img 
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format"
              alt="AI-powered compliance" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#1E40AF] opacity-10"></div>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="flex items-center mb-8">
              <img 
                src="/logo.png" 
                alt="TradeGuard Logo" 
                className="w-12 h-12 object-contain mr-4"
              />
              <h2 className="text-3xl font-bold text-[#FF6B00]">Advanced Compliance Features</h2>
            </div>
            <div className="space-y-6">
              <BenefitItem
                title="Documentation & Reporting"
                description="Auto-generated shipping forms, blockchain-based audit logs, and exportable compliance reports"
              />
              <BenefitItem
                title="AI-Powered Predictions"
                description="Machine learning models to forecast regulatory issues and predict compliance risks"
              />
              <BenefitItem
                title="Dynamic Rule Engine"
                description="Configurable validation rules that adapt to changing regulations without code modifications"
              />
              <BenefitItem
                title="Secure Blockchain Tracking"
                description="Tamper-proof compliance history using Ethereum/Hyperledger technology"
              />
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="relative rounded-3xl overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2000&auto=format"
            alt="Global trade compliance" 
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <div className="relative bg-gradient-to-r from-[#FF6B00]/90 to-[#1E40AF]/90 p-16 text-center">
            <div className="flex justify-center mb-8">
              <img 
                src="/logo.png" 
                alt="TradeGuard Logo" 
                className="w-20 h-20 object-contain"
              />
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Streamline Your Trade Compliance?</h2>
            <p className="text-xl text-white mb-8">Join the future of automated compliance verification</p>
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

function FeatureCard({ title, description, icon, image, items }: { 
  title: string; 
  description: string; 
  icon: string; 
  image: string;
  items: string[];
}) {
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
        <p className="text-gray-600 mb-4">{description}</p>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center text-gray-700">
              <span className="text-[#1E40AF] mr-2">✔</span>
              {item}
            </li>
          ))}
        </ul>
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