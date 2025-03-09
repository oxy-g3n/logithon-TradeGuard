import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ComplianceReport {
  id: string;
  shipmentId: string;
  generatedAt: string;
  status: 'Compliant' | 'Flagged' | 'Pending';
  score: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  type: 'Import' | 'Export' | 'Transit';
  issues: Array<{
    type: 'error' | 'warning';
    category: string;
    message: string;
    suggestion: string;
  }>;
  details: {
    origin: string;
    destination: string;
    hsCode: string;
    itemDescription: string;
    packageCount: number;
    totalWeight: number;
  };
}

export default function ReportsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sample data - In a real app, this would come from an API
  const [reports] = useState<ComplianceReport[]>([
    {
      id: 'REP-001',
      shipmentId: 'SHP-2024-001',
      generatedAt: '2024-03-20T10:30:00Z',
      status: 'Compliant',
      score: 95,
      riskLevel: 'Low',
      type: 'Export',
      issues: [],
      details: {
        origin: 'US',
        destination: 'EU',
        hsCode: '8471.30.0000',
        itemDescription: 'Electronic Components',
        packageCount: 10,
        totalWeight: 150
      }
    },
    {
      id: 'REP-002',
      shipmentId: 'SHP-2024-002',
      generatedAt: '2024-03-19T15:45:00Z',
      status: 'Flagged',
      score: 75,
      riskLevel: 'Medium',
      type: 'Import',
      issues: [
        {
          type: 'warning',
          category: 'Documentation',
          message: 'Additional certification required',
          suggestion: 'Submit ISO certification for electronic components'
        }
      ],
      details: {
        origin: 'CN',
        destination: 'US',
        hsCode: '8517.12.0000',
        itemDescription: 'Mobile Devices',
        packageCount: 25,
        totalWeight: 300
      }
    },
    {
      id: 'REP-003',
      shipmentId: 'SHP-2024-003',
      generatedAt: '2024-03-18T09:15:00Z',
      status: 'Pending',
      score: 60,
      riskLevel: 'High',
      type: 'Transit',
      issues: [
        {
          type: 'error',
          category: 'HS Code',
          message: 'Invalid HS code format',
          suggestion: 'Verify and update HS code according to 2024 guidelines'
        },
        {
          type: 'warning',
          category: 'Trade Regulations',
          message: 'Special handling requirements',
          suggestion: 'Include temperature monitoring documentation'
        }
      ],
      details: {
        origin: 'JP',
        destination: 'UK',
        hsCode: 'PENDING',
        itemDescription: 'Medical Equipment',
        packageCount: 5,
        totalWeight: 75
      }
    }
  ]);

  const filteredReports = reports
    .filter(report => {
      if (filterStatus !== 'all' && report.status.toLowerCase() !== filterStatus) {
        return false;
      }
      if (searchQuery) {
        return (
          report.shipmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.details.itemDescription.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime();
        case 'score':
          return b.score - a.score;
        case 'risk':
          const riskOrder = { Low: 0, Medium: 1, High: 2 };
          return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
        default:
          return 0;
      }
    });

  const handleDownloadReport = (report: ComplianceReport) => {
    // Create a new window for the report
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to download the report');
      return;
    }

    // Generate HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Compliance Report - ${report.shipmentId}</title>
        <style>
          @media print {
            @page {
              size: A4;
              margin: 20mm;
            }
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #1E293B;
            margin: 0;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #E2E8F0;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #1E40AF;
            margin-bottom: 10px;
          }
          .report-info {
            margin-bottom: 30px;
          }
          .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #1E40AF;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 20px;
          }
          .item {
            margin-bottom: 10px;
          }
          .label {
            font-size: 14px;
            color: #64748B;
            margin-bottom: 5px;
          }
          .value {
            font-weight: 500;
          }
          .status {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 15px;
            font-weight: 500;
          }
          .status-compliant {
            background-color: #DCF7E3;
            color: #166534;
          }
          .status-flagged {
            background-color: #FEE2E2;
            color: #991B1B;
          }
          .status-pending {
            background-color: #FEF3C7;
            color: #92400E;
          }
          .issue {
            margin-bottom: 20px;
            padding: 15px;
            border-radius: 8px;
          }
          .issue-error {
            background-color: #FEF2F2;
            border: 1px solid #FEE2E2;
          }
          .issue-warning {
            background-color: #FFFBEB;
            border: 1px solid #FEF3C7;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #64748B;
            font-size: 12px;
            position: fixed;
            bottom: 20px;
            left: 0;
            right: 0;
          }
          .score-bar {
            width: 100%;
            height: 8px;
            background-color: #E2E8F0;
            border-radius: 4px;
            overflow: hidden;
          }
          .score-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 0.3s ease;
          }
          .score-fill-high {
            background-color: #22C55E;
          }
          .score-fill-medium {
            background-color: #F59E0B;
          }
          .score-fill-low {
            background-color: #EF4444;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">TradeGuard</div>
          <div>Compliance Report</div>
        </div>

        <div class="section">
          <div class="grid">
            <div class="item">
              <div class="label">Report ID</div>
              <div class="value">${report.id}</div>
            </div>
            <div class="item">
              <div class="label">Generated At</div>
              <div class="value">${formatDate(report.generatedAt)}</div>
            </div>
            <div class="item">
              <div class="label">Shipment ID</div>
              <div class="value">${report.shipmentId}</div>
            </div>
            <div class="item">
              <div class="label">Status</div>
              <div class="status status-${report.status.toLowerCase()}">${report.status}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Compliance Overview</div>
          <div class="grid">
            <div class="item">
              <div class="label">Compliance Score</div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <div class="score-bar">
                  <div class="score-fill ${
                    report.score >= 90 ? 'score-fill-high' :
                    report.score >= 70 ? 'score-fill-medium' :
                    'score-fill-low'
                  }" style="width: ${report.score}%"></div>
                </div>
                <div class="value">${report.score}%</div>
              </div>
            </div>
            <div class="item">
              <div class="label">Risk Level</div>
              <div class="status ${
                report.riskLevel === 'Low' ? 'status-compliant' :
                report.riskLevel === 'High' ? 'status-flagged' :
                'status-pending'
              }">${report.riskLevel} Risk</div>
            </div>
            <div class="item">
              <div class="label">Shipment Type</div>
              <div class="value">${report.type}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Shipment Details</div>
          <div class="grid">
            <div class="item">
              <div class="label">Origin</div>
              <div class="value">${report.details.origin}</div>
            </div>
            <div class="item">
              <div class="label">Destination</div>
              <div class="value">${report.details.destination}</div>
            </div>
            <div class="item">
              <div class="label">HS Code</div>
              <div class="value">${report.details.hsCode}</div>
            </div>
            <div class="item">
              <div class="label">Description</div>
              <div class="value">${report.details.itemDescription}</div>
            </div>
            <div class="item">
              <div class="label">Package Count</div>
              <div class="value">${report.details.packageCount}</div>
            </div>
            <div class="item">
              <div class="label">Total Weight</div>
              <div class="value">${report.details.totalWeight} kg</div>
            </div>
          </div>
        </div>

        ${report.issues.length > 0 ? `
          <div class="section">
            <div class="section-title">Compliance Issues</div>
            ${report.issues.map(issue => `
              <div class="issue issue-${issue.type}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <div style="font-weight: 500; color: ${issue.type === 'error' ? '#991B1B' : '#92400E'}">
                    ${issue.category}
                  </div>
                  <div class="status ${issue.type === 'error' ? 'status-flagged' : 'status-pending'}">
                    ${issue.type.toUpperCase()}
                  </div>
                </div>
                <div style="margin: 10px 0">${issue.message}</div>
                <div style="color: #1E40AF">
                  <strong>Suggestion:</strong> ${issue.suggestion}
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div class="footer">
          Generated by TradeGuard Compliance System
          <br>
          ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => window.close(), 500);
          };
        </script>
      </body>
      </html>
    `;

    // Write the HTML content to the new window
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-[#64748B] hover:text-[#1E293B] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#1E293B]">Compliance Reports</h1>
                <p className="text-sm text-[#64748B] mt-1">View and download detailed compliance reports</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/compliance-check')}
                className="px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E293B] 
                  transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>New Compliance Check</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg border border-[#E2E8F0] p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-2">Search Reports</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by shipment ID or description..."
                  className="w-full rounded-lg border border-[#E2E8F0] pl-10 pr-4 py-2 focus:border-[#1E40AF] focus:ring focus:ring-[#1E40AF]/20"
                />
                <svg className="w-5 h-5 text-[#64748B] absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full rounded-lg border border-[#E2E8F0] px-4 py-2 focus:border-[#1E40AF] focus:ring focus:ring-[#1E40AF]/20"
              >
                <option value="all">All Status</option>
                <option value="compliant">Compliant</option>
                <option value="flagged">Flagged</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-2">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-lg border border-[#E2E8F0] px-4 py-2 focus:border-[#1E40AF] focus:ring focus:ring-[#1E40AF]/20"
              >
                <option value="date">Date Generated</option>
                <option value="score">Compliance Score</option>
                <option value="risk">Risk Level</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-6">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-xl shadow-lg border border-[#E2E8F0] overflow-hidden"
            >
              {/* Report Header */}
              <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1E293B]">
                      Report #{report.id}
                    </h3>
                    <p className="text-sm text-[#64748B]">
                      Shipment ID: {report.shipmentId}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                    ${report.status === 'Compliant' ? 'bg-green-100 text-green-800' :
                    report.status === 'Flagged' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'}`}
                  >
                    {report.status}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-[#64748B]">
                    Generated: {formatDate(report.generatedAt)}
                  </span>
                  <button
                    onClick={() => handleDownloadReport(report)}
                    className="px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E293B] 
                      transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Report Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Compliance Score */}
                  <div>
                    <h4 className="text-sm font-medium text-[#64748B] mb-2">Compliance Score</h4>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              report.score >= 90 ? 'bg-green-500' :
                              report.score >= 70 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${report.score}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-lg font-semibold text-[#1E293B]">{report.score}%</span>
                    </div>
                  </div>

                  {/* Risk Level */}
                  <div>
                    <h4 className="text-sm font-medium text-[#64748B] mb-2">Risk Level</h4>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                      ${report.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                      report.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'}`}
                    >
                      {report.riskLevel} Risk
                    </span>
                  </div>

                  {/* Shipment Type */}
                  <div>
                    <h4 className="text-sm font-medium text-[#64748B] mb-2">Shipment Type</h4>
                    <span className="text-[#1E293B] font-medium">{report.type}</span>
                  </div>
                </div>

                {/* Shipment Details */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-[#64748B] mb-4">Shipment Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-[#64748B]">Origin</p>
                      <p className="font-medium text-[#1E293B]">{report.details.origin}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#64748B]">Destination</p>
                      <p className="font-medium text-[#1E293B]">{report.details.destination}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#64748B]">HS Code</p>
                      <p className="font-medium text-[#1E293B]">{report.details.hsCode}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#64748B]">Description</p>
                      <p className="font-medium text-[#1E293B]">{report.details.itemDescription}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#64748B]">Package Count</p>
                      <p className="font-medium text-[#1E293B]">{report.details.packageCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#64748B]">Total Weight</p>
                      <p className="font-medium text-[#1E293B]">{report.details.totalWeight} kg</p>
                    </div>
                  </div>
                </div>

                {/* Compliance Issues */}
                {report.issues.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-[#64748B] mb-4">Compliance Issues</h4>
                    <div className="space-y-4">
                      {report.issues.map((issue, index) => (
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
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredReports.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-[#E2E8F0] p-8 text-center">
              <svg className="w-16 h-16 text-[#64748B] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-lg font-medium text-[#1E293B]">No Reports Found</h3>
              <p className="text-[#64748B] mt-2">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}