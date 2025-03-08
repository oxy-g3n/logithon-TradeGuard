import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

interface Shipment {
  id: string;
  destination: string;
  hsCode: string;
  status: 'Compliant' | 'Flagged' | 'Pending';
  riskLevel: 'Low' | 'Medium' | 'High';
  date: string;
  issues?: string[];
}

interface Notification {
  id: number;
  type: 'alert' | 'update' | 'system';
  message: string;
  time: string;
}

interface SidebarLinkProps {
  icon: string;
  text: string;
  active: boolean;
  expanded: boolean;
  onClick: () => void;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  percentage?: string;
  trend?: string;
  trendDirection?: 'up' | 'down';
}

interface QuickActionButtonProps {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}

// Mock data for demonstration
const mockShipments: Shipment[] = [
  { id: 'SH-2023-1001', destination: 'Germany', hsCode: '8471.30.0100', status: 'Compliant', riskLevel: 'Low', date: '2023-11-28' },
  { id: 'SH-2023-1002', destination: 'China', hsCode: '8517.12.0000', status: 'Flagged', riskLevel: 'High', date: '2023-11-27', issues: ['Restricted item', 'Missing documentation'] },
  { id: 'SH-2023-1003', destination: 'Brazil', hsCode: '9018.90.7580', status: 'Pending', riskLevel: 'Medium', date: '2023-11-27' },
  { id: 'SH-2023-1004', destination: 'India', hsCode: '8523.49.2000', status: 'Compliant', riskLevel: 'Low', date: '2023-11-26' },
  { id: 'SH-2023-1005', destination: 'Russia', hsCode: '8471.50.0150', status: 'Flagged', riskLevel: 'High', date: '2023-11-26', issues: ['Sanctions violation'] },
  { id: 'SH-2023-1006', destination: 'Mexico', hsCode: '8528.71.4000', status: 'Compliant', riskLevel: 'Low', date: '2023-11-25' },
];

const mockNotifications: Notification[] = [
  { id: 1, type: 'alert', message: 'Shipment SH-2023-1002 flagged for restricted items', time: '10 minutes ago' },
  { id: 2, type: 'update', message: 'New EU regulations affecting electronics exports', time: '2 hours ago' },
  { id: 3, type: 'alert', message: 'Shipment SH-2023-1005 flagged for sanctions violation', time: '3 hours ago' },
  { id: 4, type: 'system', message: 'System maintenance scheduled for Dec 5, 2023', time: '1 day ago' },
];

// Enhanced mock data for charts
const shipmentTrends = [
  { month: 'Jan', compliant: 156, flagged: 12, pending: 8, total: 176, value: 1250000 },
  { month: 'Feb', compliant: 165, flagged: 15, pending: 10, total: 190, value: 1380000 },
  { month: 'Mar', compliant: 180, flagged: 18, pending: 12, total: 210, value: 1520000 },
  { month: 'Apr', compliant: 190, flagged: 16, pending: 9, total: 215, value: 1680000 },
  { month: 'May', compliant: 205, flagged: 20, pending: 15, total: 240, value: 1850000 },
  { month: 'Jun', compliant: 220, flagged: 18, pending: 8, total: 246, value: 1920000 },
  { month: 'Jul', compliant: 235, flagged: 14, pending: 11, total: 260, value: 2100000 },
  { month: 'Aug', compliant: 245, flagged: 16, pending: 13, total: 274, value: 2250000 },
  { month: 'Sep', compliant: 260, flagged: 19, pending: 10, total: 289, value: 2400000 },
  { month: 'Oct', compliant: 275, flagged: 21, pending: 14, total: 310, value: 2580000 },
  { month: 'Nov', compliant: 290, flagged: 17, pending: 12, total: 319, value: 2750000 },
  { month: 'Dec', compliant: 310, flagged: 15, pending: 9, total: 334, value: 2900000 }
];

const riskDistribution = [
  { name: 'Low Risk', value: 65, color: '#10B981', description: 'Fully compliant shipments' },
  { name: 'Medium Risk', value: 25, color: '#F59E0B', description: 'Minor documentation issues' },
  { name: 'High Risk', value: 10, color: '#EF4444', description: 'Major compliance violations' }
];

const complianceMetrics = [
  { name: 'Documentation', score: 92, target: 95, previous: 89 },
  { name: 'Licensing', score: 88, target: 90, previous: 85 },
  { name: 'Sanctions', score: 95, target: 98, previous: 94 },
  { name: 'HS Codes', score: 90, target: 92, previous: 87 },
  { name: 'Valuation', score: 87, target: 90, previous: 84 },
  { name: 'Origin Rules', score: 89, target: 92, previous: 86 },
  { name: 'Restricted Items', score: 94, target: 95, previous: 91 }
];

const regionData = [
  { region: 'North America', shipments: 450, value: 3200000, compliance: 94 },
  { region: 'Europe', shipments: 380, value: 2800000, compliance: 92 },
  { region: 'Asia', shipments: 320, value: 2400000, compliance: 88 },
  { region: 'South America', shipments: 180, value: 1200000, compliance: 86 },
  { region: 'Africa', shipments: 120, value: 800000, compliance: 85 },
  { region: 'Oceania', shipments: 90, value: 600000, compliance: 91 }
];

// Minimalistic sidebar icons
const sidebarItems = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    text: 'Dashboard',
    id: 'overview'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    ),
    text: 'Shipments',
    id: 'shipments'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    text: 'Compliance',
    id: 'compliance'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    text: 'Reports',
    id: 'reports'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    text: 'Notifications',
    id: 'notifications'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    text: 'Users',
    id: 'users'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    text: 'Settings',
    id: 'settings'
  }
];

// Minimalistic icons for stat cards and quick actions
const statCardIcons = {
  shipments: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  ),
  compliant: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  flagged: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  pending: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

const quickActionIcons = {
  newShipment: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  uploadCsv: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  generateReport: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  manageRules: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
};

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  // Stats for summary cards
  const stats = {
    totalShipments: 1248,
    compliantShipments: 1156,
    flaggedShipments: 62,
    pendingShipments: 30,
    complianceRate: 92.6,
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (userMenuOpen) setUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    if (notificationsOpen) setNotificationsOpen(false);
  };

  const viewShipmentDetails = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    // In a real app, this would navigate to a shipment details page
    // or open a modal with shipment details
    console.log('View shipment details:', shipment);
  };

  const resolveShipment = (shipment: Shipment) => {
    // In a real app, this would open a resolution workflow
    console.log('Resolve shipment:', shipment);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Enhanced Sidebar */}
      <div 
        className={`
          ${sidebarOpen ? 'w-64' : 'w-20'} 
          bg-gradient-to-b from-[#1E40AF] to-[#1E3A8A] 
          fixed h-full z-10
          transition-all duration-300 ease-in-out
          border-r border-blue-800/20
          backdrop-blur-sm
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-800/30 backdrop-blur-sm">
          <div className="flex items-center">
            <div className="relative h-10 w-10">
              <div className="absolute inset-0 bg-white/20 rounded-lg transform rotate-6 transition-transform group-hover:rotate-12"></div>
              <img src="/logo.png" alt="TradeGuard Logo" className="relative h-10 w-10 object-contain filter drop-shadow-lg" />
            </div>
            {sidebarOpen && (
              <span className="ml-3 text-xl font-bold tracking-wide text-white/90">
                TradeGuard
              </span>
            )}
          </div>
          <button 
            onClick={toggleSidebar} 
            className="text-white/80 hover:text-white focus:outline-none transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="1.5" 
                d={sidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} 
              />
            </svg>
          </button>
        </div>

        <nav className="mt-6 px-3">
          {sidebarItems.map((item) => (
            <a
              key={item.id}
              href="#"
              onClick={(e) => { e.preventDefault(); setActiveTab(item.id); }}
              className={`
                flex items-center py-3 px-4 rounded-xl mb-2 
                transition-all duration-200 group
                ${activeTab === item.id 
                  ? 'bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20' 
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <div className={`
                ${activeTab === item.id ? 'transform rotate-6' : 'transform rotate-0'}
                transition-transform duration-200 group-hover:rotate-6
              `}>
                {item.icon}
              </div>
              {sidebarOpen && (
                <span className="ml-3 font-medium tracking-wide transition-opacity duration-200">
                  {item.text}
                </span>
              )}
              {activeTab === item.id && (
                <div className="absolute left-0 w-1 h-8 bg-white rounded-r-full transform -translate-y-1/2 top-1/2"></div>
              )}
            </a>
          ))}
        </nav>

        {/* User Profile Section at Bottom */}
        <div className={`
          absolute bottom-0 left-0 right-0 p-4
          border-t border-blue-800/30 backdrop-blur-sm
        `}>
          <button 
            onClick={toggleUserMenu}
            className="w-full flex items-center space-x-3 hover:bg-white/10 p-2 rounded-lg transition-colors group"
          >
            <div className="h-10 w-10 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center font-semibold shadow-lg transform transition-transform group-hover:rotate-6">
              JD
            </div>
            {sidebarOpen && (
              <div className="flex-1 flex items-center justify-between">
                <span className="text-white/90 font-medium">John Doe</span>
                <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 ease-in-out bg-white`}>
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-md backdrop-blur-sm bg-white/90 sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center flex-1">
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Dashboard</h1>
              <div className="ml-10 relative flex-1 max-w-xl">
                <input
                  type="text"
                  placeholder="Search shipments, HS codes, destinations..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00]/50 focus:border-[#FF6B00] transition-all bg-gray-50/50"
                />
                <div className="absolute left-3 top-3 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={toggleNotifications}
                  className="p-2 text-gray-500 hover:text-[#FF6B00] focus:outline-none relative"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {mockNotifications.length}
                  </span>
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {mockNotifications.map((notification) => (
                        <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                          <div className="flex items-start">
                            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                              notification.type === 'alert' ? 'bg-red-100 text-red-500' : 
                              notification.type === 'update' ? 'bg-blue-100 text-blue-500' : 
                              'bg-gray-100 text-gray-500'
                            }`}>
                              {notification.type === 'alert' ? '🚨' : 
                               notification.type === 'update' ? '📝' : '🔧'}
                            </div>
                            <div className="ml-3 flex-1">
                              <p className="text-sm text-gray-800">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200">
                      <a href="/notifications" className="text-sm text-[#1E40AF] hover:text-[#FF6B00]">
                        View all notifications
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="h-10 w-10 rounded-full bg-[#FF6B00] text-white flex items-center justify-center font-semibold">
                    JD
                  </div>
                  <span className="text-gray-700 font-medium hidden md:block">John Doe</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Menu Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-200">
                    <a href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Your Profile
                    </a>
                    <a href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Settings
                    </a>
                    <a href="/help" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Help Center
                    </a>
                    <div className="border-t border-gray-100 my-1"></div>
                    <a href="/logout" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 space-y-6">
          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard 
              title="Total Shipments" 
              value={stats.totalShipments} 
              icon={statCardIcons.shipments}
              color="bg-gradient-to-br from-blue-500 to-blue-600" 
              trend="+12.5%"
              trendDirection="up"
            />
            <StatCard 
              title="Compliant" 
              value={stats.compliantShipments} 
              icon={statCardIcons.compliant}
              color="bg-gradient-to-br from-green-500 to-green-600" 
              percentage={stats.complianceRate + '%'}
              trend="+5.3%"
              trendDirection="up"
            />
            <StatCard 
              title="Flagged" 
              value={stats.flaggedShipments} 
              icon={statCardIcons.flagged}
              color="bg-gradient-to-br from-red-500 to-red-600"
              trend="-2.8%"
              trendDirection="down"
            />
            <StatCard 
              title="Pending" 
              value={stats.pendingShipments} 
              icon={statCardIcons.pending}
              color="bg-gradient-to-br from-yellow-500 to-yellow-600"
              trend="+1.2%"
              trendDirection="up"
            />
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Risk Score</h3>
              <div className="flex-1 flex items-center justify-center">
                <div className="relative w-full">
                  <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 w-full"></div>
                    <div className="absolute top-0 left-0 h-full flex items-center" style={{ left: `${stats.complianceRate}%` }}>
                      <div className="h-6 w-6 rounded-full bg-white border-2 border-gray-300 shadow-lg transform -translate-x-1/2 transition-all duration-300"></div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-2xl font-bold text-gray-700">{stats.complianceRate}%</span>
                    <p className="text-sm text-gray-500">Overall Compliance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Shipment Trends Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Shipment Trends</h2>
                  <p className="text-sm text-gray-500">Monthly shipment volume and compliance status</p>
                </div>
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50">
                  <option>Last 12 Months</option>
                  <option>Last 6 Months</option>
                  <option>Last 3 Months</option>
                </select>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={shipmentTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCompliant" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorFlagged" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#FFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value: number, name: string) => [
                        value,
                        name.charAt(0).toUpperCase() + name.slice(1)
                      ]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="compliant" 
                      stroke="#10B981" 
                      fillOpacity={1} 
                      fill="url(#colorCompliant)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="flagged" 
                      stroke="#EF4444" 
                      fillOpacity={1} 
                      fill="url(#colorFlagged)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="pending" 
                      stroke="#F59E0B" 
                      fillOpacity={1} 
                      fill="url(#colorPending)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Risk Distribution Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Risk Distribution</h2>
                  <p className="text-sm text-gray-500">Current risk level breakdown</p>
                </div>
                <div className="flex space-x-2">
                  {riskDistribution.map((entry) => (
                    <div key={entry.name} className="flex items-center">
                      <div className="h-3 w-3 rounded-full mr-1" style={{ backgroundColor: entry.color }}></div>
                      <span className="text-xs text-gray-600">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {riskDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          stroke="white"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value, name, props) => [
                        `${value}%`,
                        `${name}: ${props.payload.description}`
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Compliance Metrics Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Compliance Metrics</h2>
                <p className="text-sm text-gray-500">Performance against compliance targets</p>
              </div>
              <button className="text-sm text-[#1E40AF] hover:text-[#FF6B00] flex items-center">
                View Details
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={complianceMetrics} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" domain={[60, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value, name, props) => {
                      if (name === 'score') return [`${value}%`, 'Current Score'];
                      if (name === 'target') return [`${value}%`, 'Target'];
                      if (name === 'previous') return [`${value}%`, 'Previous'];
                      return [value, name];
                    }}
                  />
                  <Bar dataKey="previous" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="score" fill="#1E40AF" radius={[4, 4, 0, 0]}>
                    {complianceMetrics.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.score >= entry.target ? '#10B981' : entry.score >= entry.target - 5 ? '#1E40AF' : '#F59E0B'} 
                      />
                    ))}
                  </Bar>
                  <Bar dataKey="target" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-4 space-x-6">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-gray-400 mr-2"></div>
                <span className="text-sm text-gray-600">Previous</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-[#1E40AF] mr-2"></div>
                <span className="text-sm text-gray-600">Current</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-gray-200 mr-2"></div>
                <span className="text-sm text-gray-600">Target</span>
              </div>
            </div>
          </div>

          {/* Grid section after Compliance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white">
            {/* Recent Shipments Table */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-[#1E40AF]/5 via-[#1E40AF]/2 to-transparent">
                <h2 className="text-lg font-semibold text-gray-800">Recent Shipments</h2>
                <a href="/shipments" className="text-sm text-[#1E40AF] hover:text-[#FF6B00] transition-colors flex items-center">
                  View All
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Shipment ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Destination
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        HS Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Risk Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockShipments.map((shipment) => (
                      <tr key={shipment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {shipment.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {shipment.destination}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {shipment.hsCode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            shipment.status === 'Compliant' ? 'bg-green-100 text-green-800' :
                            shipment.status === 'Flagged' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {shipment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            shipment.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                            shipment.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {shipment.riskLevel}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => viewShipmentDetails(shipment)}
                              className="text-[#1E40AF] hover:text-[#FF6B00]"
                            >
                              View
                            </button>
                            {shipment.status === 'Flagged' && (
                              <button 
                                onClick={() => resolveShipment(shipment)}
                                className="text-[#FF6B00] hover:text-[#E65100]"
                              >
                                Resolve
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Side Panels */}
            <div className="space-y-6 bg-white">
              {/* Quick Actions Panel */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  <QuickActionButton 
                    icon={quickActionIcons.newShipment}
                    text="New Shipment" 
                    onClick={() => console.log('New shipment')} 
                  />
                  <QuickActionButton 
                    icon={quickActionIcons.uploadCsv}
                    text="Upload CSV" 
                    onClick={() => console.log('Upload CSV')} 
                  />
                  <QuickActionButton 
                    icon={quickActionIcons.generateReport}
                    text="Generate Report" 
                    onClick={() => console.log('Generate report')} 
                  />
                  <QuickActionButton 
                    icon={quickActionIcons.manageRules}
                    text="Manage Rules" 
                    onClick={() => console.log('Manage rules')} 
                  />
                </div>
              </div>

              {/* Flagged Shipments Panel */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Flagged Shipments
                </h2>
                <div className="space-y-4">
                  {mockShipments
                    .filter(shipment => shipment.status === 'Flagged')
                    .map(shipment => (
                      <div key={shipment.id} className="p-4 border border-red-100 rounded-lg bg-red-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{shipment.id}</h3>
                            <p className="text-sm text-gray-500">Destination: {shipment.destination}</p>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {shipment.riskLevel} Risk
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">Issues:</p>
                          <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                            {shipment.issues?.map((issue, index) => (
                              <li key={index}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-3 pt-3 border-t border-red-200 flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            <span className="font-medium text-[#1E40AF]">AI Suggestion:</span> Verify documentation and check for exemptions
                          </div>
                          <button 
                            onClick={() => resolveShipment(shipment)}
                            className="px-3 py-1 bg-[#FF6B00] text-white text-sm rounded hover:bg-[#E65100]"
                          >
                            Resolve
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
                {mockShipments.filter(shipment => shipment.status === 'Flagged').length === 0 && (
                  <p className="text-center text-gray-500 py-4">No flagged shipments</p>
                )}
              </div>

              {/* Compliance Updates */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Compliance Updates
                </h2>
                <div className="space-y-4">
                  <div className="p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
                    <h3 className="font-medium text-gray-900">New EU Regulations</h3>
                    <p className="text-sm text-gray-600 mt-1">Updated requirements for electronics exports to EU countries effective Jan 1, 2024.</p>
                    <a href="#" className="text-sm text-[#1E40AF] hover:text-[#FF6B00] mt-2 inline-block">
                      Learn More
                    </a>
                  </div>
                  <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50 rounded-r-lg">
                    <h3 className="font-medium text-gray-900">HS Code Updates</h3>
                    <p className="text-sm text-gray-600 mt-1">The World Customs Organization has released new HS code classifications.</p>
                    <a href="#" className="text-sm text-[#1E40AF] hover:text-[#FF6B00] mt-2 inline-block">
                      View Changes
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Updated StatCard component
function StatCard({ title, value, icon, color, percentage, trend, trendDirection }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transform hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`${color} h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-lg`}>
            {icon}
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{value.toLocaleString()}</p>
              {percentage && (
                <p className="ml-2 text-sm text-green-600 font-medium">{percentage}</p>
              )}
            </div>
          </div>
        </div>
        {trend && (
          <div className={`flex items-center ${trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            <svg
              className={`w-4 h-4 mr-1 ${trendDirection === 'up' ? 'transform rotate-0' : 'transform rotate-180'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-sm font-medium">{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Updated QuickActionButton component
function QuickActionButton({ icon, text, onClick }: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 bg-white hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-100 hover:border-[#1E40AF]/20 group"
    >
      <div className="text-gray-400 group-hover:text-[#1E40AF] mb-2 transform group-hover:scale-110 transition-all duration-200">
        {icon}
      </div>
      <span className="text-sm text-gray-700 font-medium group-hover:text-[#1E40AF]">{text}</span>
    </button>
  );
} 