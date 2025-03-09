import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ComplianceIssue {
  type: 'error' | 'warning';
  category: string;
  message: string;
  suggestion: string;
}

interface ComplianceStatus {
  status: 'Compliant' | 'Flagged' | 'Pending';
  riskLevel: 'Low' | 'Medium' | 'High';
  score: number;
  issues: ComplianceIssue[];
}

interface PendingCompliance {
  shipmentId: string;
  status: 'Compliant' | 'Flagged' | 'Pending';
  dateChecked: string;
  score: number;
  type: string;
}

export default function ComplianceCheckPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [complianceStatus, setComplianceStatus] = useState<ComplianceStatus>({
    status: 'Pending',
    riskLevel: 'Low',
    score: 0,
    issues: []
  });

  // Dummy data for pending compliances
  const [pendingCompliances] = useState<PendingCompliance[]>([
    {
      shipmentId: 'SHP-2024-001',
      status: 'Compliant',
      dateChecked: '2024-03-20',
      score: 95,
      type: 'Import'
    },
    {
      shipmentId: 'SHP-2024-002',
      status: 'Flagged',
      dateChecked: '2024-03-19',
      score: 75,
      type: 'Export'
    },
    {
      shipmentId: 'SHP-2024-003',
      status: 'Pending',
      dateChecked: '2024-03-18',
      score: 60,
      type: 'Transit'
    }
  ]);

  // Simulated compliance check
  useEffect(() => {
    const formData = location.state?.formData;
    // if (!formData) {
    //   navigate('/shipment-import');
    //   return;
    // }

    // Simulate API call
    setTimeout(() => {
      const mockComplianceCheck = analyzeShipmentData(formData);
      setComplianceStatus(mockComplianceCheck);
      setIsLoading(false);
    }, 2000);
  }, [location.state, navigate]);

  const analyzeShipmentData = (data: any): ComplianceStatus => {
    const issues: ComplianceIssue[] = [];
    let score = 100;

    // Check HS Code compliance
    if (data.useHsCode && (!data.hsCode || data.hsCode.length < 6)) {
      issues.push({
        type: 'error',
        category: 'HS Code',
        message: 'Invalid or missing HS Code',
        suggestion: 'Provide a valid 6-digit HS Code'
      });
      score -= 20;
    }

    // Check country restrictions
    if (data.originCountry === 'US' && data.destinationCountry === 'EU') {
      issues.push({
        type: 'warning',
        category: 'Trade Regulations',
        message: 'Special documentation required for US-EU trade',
        suggestion: 'Include EUR.1 movement certificate'
      });
      score -= 10;
    }

    // Check documentation
    if (!data.commercialInvoice) {
      issues.push({
        type: 'error',
        category: 'Documentation',
        message: 'Missing commercial invoice',
        suggestion: 'Upload commercial invoice in PDF format'
      });
      score -= 15;
    }

    // Determine status and risk level
    const status = score >= 90 ? 'Compliant' : score >= 70 ? 'Flagged' : 'Pending';
    const riskLevel = score >= 90 ? 'Low' : score >= 70 ? 'Medium' : 'High';

    return {
      status,
      riskLevel,
      score,
      issues
    };
  };

  const handleGenerateReport = () => {
    // Simulate report generation
    setTimeout(() => {
      navigate('/reports', { 
        state: { 
          reportData: {
            ...complianceStatus,
            generatedAt: new Date().toISOString(),
            shipmentId: location.state?.formData?.shipmentId
          }
        }
      });
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#1E40AF] mx-auto"></div>
          <p className="mt-4 text-[#64748B]">Analyzing compliance status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
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
                <h1 className="text-2xl font-bold text-[#1E293B]">Compliance Analysis</h1>
                <p className="text-sm text-[#64748B] mt-1">
                  Shipment ID: {location.state?.formData?.shipmentId || 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/active-compliances')}
                className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#1E293B] rounded-lg 
                  hover:border-[#1E40AF] transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>View All Compliances</span>
              </button>
              <button
                onClick={handleGenerateReport}
                className="px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E293B] 
                  transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Generate Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#1E293B]">Status</h2>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                ${complianceStatus.status === 'Compliant' ? 'bg-green-100 text-green-800' :
                complianceStatus.status === 'Flagged' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'}`}
              >
                {complianceStatus.status}
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#64748B]">Compliance Score</span>
                  <span className="text-lg font-semibold text-[#1E293B]">{complianceStatus.score}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      complianceStatus.score >= 90 ? 'bg-green-500' :
                      complianceStatus.score >= 70 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${complianceStatus.score}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <span className="text-sm text-[#64748B]">Risk Level</span>
                <div className="flex items-center mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${complianceStatus.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                    complianceStatus.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'}`}
                  >
                    {complianceStatus.riskLevel} Risk
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-[#E2E8F0]">
            <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Summary</h2>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-[#64748B]">Total Issues</span>
                <p className="text-2xl font-semibold text-[#1E293B]">{complianceStatus.issues.length}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-[#64748B]">Errors</span>
                  <p className="text-xl font-semibold text-red-600">
                    {complianceStatus.issues.filter(i => i.type === 'error').length}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-[#64748B]">Warnings</span>
                  <p className="text-xl font-semibold text-yellow-600">
                    {complianceStatus.issues.filter(i => i.type === 'warning').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-[#E2E8F0]">
            <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/shipment-details', { state: { formData: location.state?.formData } })}
                className="w-full px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[#64748B] 
                  hover:text-[#1E293B] hover:border-[#1E40AF] transition-colors flex items-center justify-between"
              >
                <span>Edit Shipment Details</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button
                onClick={() => {/* Add functionality */}}
                className="w-full px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[#64748B] 
                  hover:text-[#1E293B] hover:border-[#1E40AF] transition-colors flex items-center justify-between"
              >
                <span>Request Manual Review</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </button>
              <button
                onClick={() => {/* Add functionality */}}
                className="w-full px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[#64748B] 
                  hover:text-[#1E293B] hover:border-[#1E40AF] transition-colors flex items-center justify-between"
              >
                <span>View Documentation</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Active Compliances */}
        <div className="bg-white rounded-xl shadow-lg border border-[#E2E8F0] overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[#1E293B]">Active Compliances</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-[#64748B]">Sort by:</span>
              <select className="text-sm border border-[#E2E8F0] rounded-lg px-3 py-1.5">
                <option value="date">Date</option>
                <option value="score">Score</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shipment ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Checked
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingCompliances.map((compliance, index) => (
                  <tr key={compliance.shipmentId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1E293B]">
                      {compliance.shipmentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {compliance.type}
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
                      {compliance.dateChecked}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleGenerateReport()}
                        className="text-[#1E40AF] hover:text-[#1E293B] font-medium transition-colors flex items-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Generate Report</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compliance Issues */}
        <div className="bg-white rounded-xl shadow-lg border border-[#E2E8F0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[#1E293B]">Compliance Issues</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-[#64748B]">Filter by:</span>
              <select className="text-sm border border-[#E2E8F0] rounded-lg px-3 py-1.5">
                <option value="all">All Issues</option>
                <option value="error">Errors</option>
                <option value="warning">Warnings</option>
              </select>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {complianceStatus.issues.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-[#1E293B]">All Clear!</h3>
                <p className="text-[#64748B]">No compliance issues found</p>
              </div>
            ) : (
              complianceStatus.issues.map((issue, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    issue.type === 'error' ? 'bg-red-50 border-red-100' : 'bg-yellow-50 border-yellow-100'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                      ${issue.type === 'error' ? 'bg-red-100' : 'bg-yellow-100'}`}
                    >
                      {issue.type === 'error' ? (
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-sm font-medium ${
                          issue.type === 'error' ? 'text-red-800' : 'text-yellow-800'
                        }`}>
                          {issue.category}
                        </h3>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          issue.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {issue.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{issue.message}</p>
                      <div className="mt-2 flex items-start space-x-2">
                        <svg className="w-5 h-5 text-[#1E40AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <p className="text-sm text-[#1E40AF]">{issue.suggestion}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 