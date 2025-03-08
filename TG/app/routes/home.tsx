import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B00]/5 to-[#1E40AF]/5 pointer-events-none"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 py-16">
        {/* Header with Floating Elements */}
        <div className="text-center mb-16 relative">
          {/* Decorative Elements */}
          <div className="absolute -top-8 -left-16 w-32 h-32 bg-[#FF6B00]/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-8 -right-16 w-32 h-32 bg-[#1E40AF]/10 rounded-full blur-2xl"></div>
          
          <h1 className="text-6xl font-bold text-[#FF6B00] mb-4 relative">
            TradeGaurd
            <span className="absolute -top-4 -right-4 w-8 h-8 bg-[#FF6B00]/20 rounded-full blur-sm"></span>
          </h1>
          <p className="text-2xl text-gray-600 mb-8">Your Trade Compliance Partner</p>
          <a 
            href="/onboarding" 
            className="inline-block bg-[#1E40AF] text-white px-8 py-3 rounded-lg hover:bg-[#1E3A8A] 
                     transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg mb-12"
          >
            Learn About TradeGaurd
          </a>
        </div>

        {/* Navigation Grid */}
        <nav className="grid md:grid-cols-2 gap-6">
          <div className="col-span-2 mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Quick Access</h2>
          </div>
          
          {/* Main Actions */}
          <div className="col-span-2 grid md:grid-cols-2 gap-4 mb-8">
            <NavLink 
              to="/login" 
              icon="🔐" 
              image="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=400&auto=format"
            >
              Login
            </NavLink>
            <NavLink 
              to="/dashboard" 
              icon="📊" 
              image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format"
            >
              Dashboard
            </NavLink>
          </div>

          {/* Core Features */}
          <NavLink 
            to="/shipment-upload" 
            icon="📦" 
            image="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=400&auto=format"
          >
            Shipment Upload
          </NavLink>
          <NavLink 
            to="/compliance-check" 
            icon="✓" 
            image="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=400&auto=format"
          >
            Compliance Check
          </NavLink>
          <NavLink 
            to="/shipment-details" 
            icon="🚢" 
            image="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=400&auto=format"
          >
            Shipment Details
          </NavLink>
          <NavLink 
            to="/notifications" 
            icon="🔔" 
            image="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=400&auto=format"
          >
            Notifications
          </NavLink>
          <NavLink 
            to="/reports" 
            icon="📄" 
            image="https://images.unsplash.com/photo-1543286386-2e659306cd6c?q=80&w=400&auto=format"
          >
            Reports
          </NavLink>
          <NavLink 
            to="/user-management" 
            icon="👥" 
            image="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=400&auto=format"
          >
            User Management
          </NavLink>
          <NavLink 
            to="/settings" 
            icon="⚙️" 
            image="https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?q=80&w=400&auto=format"
          >
            Settings
          </NavLink>
          <NavLink 
            to="/help" 
            icon="❓" 
            image="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=400&auto=format"
          >
            Help
          </NavLink>
        </nav>
      </div>
    </div>
  );
}

function NavLink({ 
  to, 
  children, 
  icon, 
  image 
}: { 
  to: string; 
  children: React.ReactNode; 
  icon: string;
  image: string;
}) {
  return (
    <a 
      href={to} 
      className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl 
                 transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={image} 
          alt={children?.toString()} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative p-6 flex items-center">
        <span className="text-2xl mr-3">{icon}</span>
        <span className="text-lg font-medium text-white">{children}</span>
      </div>
      
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-[#FF6B00]/0 group-hover:bg-[#FF6B00]/20 transition-colors duration-300"></div>
    </a>
  );
}
