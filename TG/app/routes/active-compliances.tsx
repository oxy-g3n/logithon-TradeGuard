import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ActiveCompliance {
  shipmentId: string;
  status: 'Compliant' | 'Flagged' | 'Pending';
  dateChecked: string;
  score: number;
  type: string;
  origin: string;
  destination: string;
  lastUpdated: string;
  priority: 'High' | 'Medium' | 'Low';
}

export default function ActiveCompliancesPage() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('dateChecked');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy data with more details
  const [activeCompliances] = useState<ActiveCompliance[]>([
    {
      shipmentId: 'SHP-2024-001',
      status: 'Compliant',
      dateChecked: '2024-03-20',
      score: 95,
      type: 'Import',
      origin: 'United States',
      destination: 'India',
      lastUpdated: '2024-03-20 14:30',
      priority: 'Low'
    },
    {
      shipmentId: 'SHP-2024-002',
      status: 'Flagged',
      dateChecked: '2024-03-19',
      score: 75,
      type: 'Export',
      origin: 'India',
      destination: 'Germany',
      lastUpdated: '2024-03-19 09:15',
      priority: 'High'
    },
    {
      shipmentId: 'SHP-2024-003',
      status: 'Pending',
      dateChecked: '2024-03-18',
      score: 60,
      type: 'Transit',
      origin: 'China',
      destination: 'Australia',
      lastUpdated: '2024-03-18 16:45',
      priority: 'Medium'
    },
    {
      shipmentId: 'SHP-2024-004',
      status: 'Flagged',
      dateChecked: '2024-03-20',
      score: 82,
      type: 'Import',
      origin: 'Japan',
      destination: 'India',
      lastUpdated: '2024-03-20 11:20',
      priority: 'High'
    },
    {
      shipmentId: 'SHP-2024-005',
      status: 'Compliant',
      dateChecked: '2024-03-19',
      score: 98,
      type: 'Export',
      origin: 'India',
      destination: 'UAE',
      lastUpdated: '2024-03-19 13:50',
      priority: 'Low'
    }
  ]);

  // Filter and sort compliances
  const filteredCompliances = activeCompliances
    .filter(compliance => {
      if (filterStatus !== 'all' && compliance.status !== filterStatus) return false;
      if (searchTerm) {
        return (
          compliance.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          compliance.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
          compliance.destination.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score;
        case 'priority':
          const priorityOrder = { High: 3, Medium: 2, Low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'dateChecked':
          return new Date(b.dateChecked).getTime() - new Date(a.dateChecked).getTime();
        default:
          return 0;
      }
    });

  const handleGenerateReport = (shipmentId: string) => {
    navigate(`/compliance-check/${shipmentId}`);
  };

  const handleViewDetails = (shipmentId: string) => {
    navigate(`/shipment-details/${shipmentId}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate(-1)}
                className="text-[#64748B] hover:text-[#1E293B] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#1E293B]">Active Compliances</h1>
                <p className="text-sm text-[#64748B] mt-1">
                  Manage and monitor all active compliance checks
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => navigate('/new-compliance')}
                className="px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E293B] 
                  transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>New Compliance Check</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-lg border border-[#E2E8F0] p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#64748B] mb-1">Search</label>
              <input
                type="text"
                placeholder="Search by ID, origin, or destination"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#64748B] mb-1">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="Compliant">Compliant</option>
                <option value="Flagged">Flagged</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#64748B] mb-1">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent"
              >
                <option value="dateChecked">Date Checked</option>
                <option value="score">Compliance Score</option>
                <option value="priority">Priority</option>
              </select>
            </div>
          </div>
        </div>

        {/* Compliance Table */}
        <div className="bg-white rounded-xl shadow-lg border border-[#E2E8F0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shipment ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Origin - Destination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCompliances.map((compliance, index) => (
                  <tr key={compliance.shipmentId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1E293B]">
                      {compliance.shipmentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${compliance.status === 'Compliant' ? 'bg-green-100 text-green-800' :
                        compliance.status === 'Flagged' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                        {compliance.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {compliance.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {compliance.origin} → {compliance.destination}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`text-sm font-medium
                          ${compliance.score >= 90 ? 'text-green-600' :
                          compliance.score >= 70 ? 'text-yellow-600' :
                          'text-red-600'}`}>
                          {compliance.score}%
                        </span>
                        <div className="ml-2 w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full
                              ${compliance.score >= 90 ? 'bg-green-500' :
                              compliance.score >= 70 ? 'bg-yellow-500' :
                              'bg-red-500'}`}
                            style={{ width: `${compliance.score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${compliance.priority === 'High' ? 'bg-red-100 text-red-800' :
                        compliance.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'}`}>
                        {compliance.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {compliance.lastUpdated}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewDetails(compliance.shipmentId)}
                          className="text-[#1E40AF] hover:text-[#1E293B] font-medium transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleGenerateReport(compliance.shipmentId)}
                          className="text-[#1E40AF] hover:text-[#1E293B] font-medium transition-colors flex items-center space-x-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>Report</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 