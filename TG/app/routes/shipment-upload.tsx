import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface UploadOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  comingSoon?: boolean;
}

export default function ShipmentUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const uploadOptions: UploadOption[] = [
    {
      id: 'manual',
      title: 'Manual Entry',
      description: 'Enter shipment details step by step through our guided form',
      features: [
        'Guided form with field validation',
        'Save drafts for later completion',
        'Real-time compliance checks',
        'Suitable for single shipments'
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      id: 'csv',
      title: 'CSV Upload',
      description: 'Upload structured data using our standardized spreadsheet template',
      features: [
        'Bulk upload multiple shipments',
        'Excel/CSV template format',
        'Data validation on upload',
        'Error reporting for invalid entries'
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'pdf',
      title: 'PDF Upload',
      description: 'Upload scanned shipping documents for automated processing',
      features: [
        'Document scanning & OCR',
        'Support for shipping documents',
        'Automated data extraction',
        'Manual verification option'
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z M9 13h6m-3-3v6" />
        </svg>
      )
    }
  ];

  const handleOptionClick = (optionId: string) => {
    setError('');
    setUploadType(optionId);

    if (optionId === 'manual') {
      navigate('/shipment-details');
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    validateAndProcessFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (!file) return;

    validateAndProcessFile(file);
  };

  const validateAndProcessFile = (file: File) => {
    // Validate file type and size
    if (uploadType === 'csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file');
      return;
    }

    if (uploadType === 'pdf' && !file.name.endsWith('.pdf')) {
      setError('Please upload a valid PDF file');
      return;
    }

    // 10MB file size limit
    if (file.size > 10 * 1024 * 1024) {
      setError('File size should not exceed 10MB');
      return;
    }

    setSelectedFile(file);
    // Redirect to validation page with file metadata
    navigate('/compliance-check', { 
      state: { 
        fileName: file.name,
        fileType: uploadType,
        fileSize: file.size,
        uploadTime: new Date().toISOString()
      }
    });
  };

  const downloadTemplate = (type: string) => {
    // In a real implementation, these would be actual template files
    const templates = {
      csv: '/templates/bulk-shipment-template.xlsx',
      pdf: '/templates/shipping-document-guidelines.pdf'
    };
    
    const templateNames = {
      csv: 'Bulk Upload Template (Excel)',
      pdf: 'Document Guidelines'
    };

    window.open(templates[type as keyof typeof templates], '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Enhanced Header */}
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
                <h1 className="text-2xl font-bold text-[#1E293B]">New Shipment</h1>
                <p className="text-sm text-[#64748B] mt-1">Choose your preferred method to input shipment data</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/help/shipments" 
                className="text-sm text-[#1E40AF] hover:text-[#1E293B] flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Documentation</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Process Flow Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-[#1E40AF] text-white flex items-center justify-center font-semibold shadow-lg">
                1
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-[#1E293B]">Choose Method</p>
                <p className="text-xs text-[#64748B]">Select input type</p>
              </div>
            </div>
            <div className="flex-1 h-px bg-[#E2E8F0] mx-4"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-[#E2E8F0] text-[#64748B] flex items-center justify-center font-semibold">
                2
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-[#64748B]">Enter Data</p>
                <p className="text-xs text-[#94A3B8]">Provide shipment details</p>
              </div>
            </div>
            <div className="flex-1 h-px bg-[#E2E8F0] mx-4"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-[#E2E8F0] text-[#64748B] flex items-center justify-center font-semibold">
                3
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-[#64748B]">Validation</p>
                <p className="text-xs text-[#94A3B8]">Compliance check</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-[#E2E8F0] overflow-hidden">
          {/* Instructions */}
          <div className="px-6 py-8 border-b border-[#E2E8F0] bg-gradient-to-r from-[#1E40AF]/5 via-transparent to-transparent">
            <h2 className="text-xl font-semibold text-[#1E293B] mb-2">Choose Your Input Method</h2>
            <p className="text-[#64748B]">
              Select how you'd like to input your shipment data. Each method will guide you through our compliance validation process.
            </p>
          </div>

          {/* Upload Options */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {uploadOptions.map((option) => (
                <div key={option.id} className="flex flex-col">
                  <button
                    onClick={() => handleOptionClick(option.id)}
                    className={`relative group p-6 rounded-xl border-2 transition-all duration-300 flex-1
                      ${option.comingSoon 
                        ? 'border-[#E2E8F0] opacity-60 cursor-not-allowed'
                        : 'border-[#E2E8F0] hover:border-[#1E40AF] hover:shadow-lg transform hover:-translate-y-1'
                      }
                      bg-white
                    `}
                    disabled={option.comingSoon}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`
                        ${option.comingSoon ? 'text-[#94A3B8]' : 'text-[#1E40AF] group-hover:text-[#1E293B]'}
                        transition-all duration-300 transform group-hover:scale-110
                      `}>
                        {option.icon}
                      </div>
                      {option.comingSoon && (
                        <span className="px-2 py-1 text-xs font-medium text-[#1E40AF] bg-[#1E40AF]/10 rounded-full">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <h3 className={`text-lg font-semibold mb-2
                      ${option.comingSoon ? 'text-[#94A3B8]' : 'text-[#1E293B]'}
                    `}>
                      {option.title}
                    </h3>
                    <p className={`text-sm mb-4 ${option.comingSoon ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                      {option.description}
                    </p>
                    <ul className="space-y-2">
                      {option.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-[#64748B]">
                          <svg className="w-4 h-4 mr-2 text-[#10B981] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="group-hover:text-[#1E293B] transition-colors">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </button>
                  {(option.id === 'csv' || option.id === 'pdf') && (
                    <button
                      onClick={() => downloadTemplate(option.id)}
                      className="mt-2 text-sm text-[#1E40AF] hover:text-[#1E293B] flex items-center justify-center py-2 group"
                    >
                      <svg className="w-4 h-4 mr-1 transform group-hover:translate-y-px transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      {option.id === 'csv' ? 'Download Excel Template' : 'Download Guidelines'}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* File Drop Zone */}
            <div 
              className={`mt-8 border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
                ${isDragging 
                  ? 'border-[#1E40AF] bg-[#1E40AF]/5' 
                  : 'border-[#E2E8F0] hover:border-[#1E40AF] hover:bg-[#F8FAFC]'
                }
                bg-white
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                <svg className="w-12 h-12 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mt-4 text-sm text-[#64748B]">
                  Drag and drop your file here, or{' '}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[#1E40AF] hover:text-[#1E293B] font-medium"
                  >
                    browse
                  </button>
                </p>
                <p className="mt-2 text-xs text-[#94A3B8]">
                  Supported formats: CSV, PDF (max. 10MB)
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={uploadType === 'csv' ? '.csv' : '.pdf'}
              className="hidden"
            />
          </div>

          {/* Help Section */}
          <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0]">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-[#1E40AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#1E293B]">Need Help?</h4>
                <p className="mt-1 text-sm text-[#64748B]">
                  Check our documentation for detailed guidelines on each input method and file requirements.{' '}
                  <a href="/help" className="text-[#1E40AF] hover:text-[#1E293B] font-medium">
                    Learn more
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 