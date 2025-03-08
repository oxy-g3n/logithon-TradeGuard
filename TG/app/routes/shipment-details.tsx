import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ShipmentFormData {
  // Exporter & Consignee Details
  exporterName: string;
  exporterAddress: string;
  exporterEmail: string;
  exporterPhone: string;
  consigneeName: string;
  consigneeAddress: string;
  consigneeEmail: string;
  consigneePhone: string;
  logisticsProvider: string;

  // Shipment Information
  shipmentId: string;
  shipmentDate: string;
  packageCount: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  declaredValue: number;
  currency: string;
  originCountry: string;
  destinationCountry: string;

  // Product Details
  itemDescription: string;
  hsCode: string;
  quantity: number;
  itemWeight: number;
  packagingType: string;
  handlingInstructions: string;
  mainCategory: string;
  subCategory: string;

  // Documentation
  commercialInvoice: File | null;
  packingList: File | null;
}

export default function ShipmentDetailsPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ShipmentFormData>({
    exporterName: '',
    exporterAddress: '',
    exporterEmail: '',
    exporterPhone: '',
    consigneeName: '',
    consigneeAddress: '',
    consigneeEmail: '',
    consigneePhone: '',
    logisticsProvider: '',
    shipmentId: '',
    shipmentDate: '',
    packageCount: 0,
    weight: 0,
    dimensions: { length: 0, width: 0, height: 0 },
    declaredValue: 0,
    currency: 'USD',
    originCountry: '',
    destinationCountry: '',
    itemDescription: '',
    hsCode: '',
    quantity: 0,
    itemWeight: 0,
    packagingType: '',
    handlingInstructions: '',
    mainCategory: '',
    subCategory: '',
    commercialInvoice: null,
    packingList: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      const parentKey = parent as keyof ShipmentFormData;
      const parentValue = formData[parentKey];
      
      if (typeof parentValue === 'object' && parentValue !== null) {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...parentValue,
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would typically validate and submit the data
    navigate('/compliance-check', { state: { formData } });
  };

  const steps = [
    { number: 1, title: 'Exporter & Consignee Details' },
    { number: 2, title: 'Shipment Information' },
    { number: 3, title: 'Product Details' },
    { number: 4, title: 'Documentation' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/shipment-import')}
                className="text-[#64748B] hover:text-[#1E293B] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#1E293B]">Shipment Details</h1>
                <p className="text-sm text-[#64748B] mt-1">Enter your shipment information step by step</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => {/* Add save draft functionality */}}
                className="text-sm text-[#1E40AF] hover:text-[#1E293B] flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span>Save Draft</span>
              </button>
              <button 
                onClick={() => {/* Add help functionality */}}
                className="text-sm text-[#1E40AF] hover:text-[#1E293B] flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Help</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Progress Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-4xl mx-auto relative">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center relative group">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold
                      transition-all duration-200 transform
                      ${currentStep === step.number 
                        ? 'bg-[#1E40AF] text-white scale-110 shadow-lg' 
                        : currentStep > step.number 
                          ? 'bg-[#10B981] text-white'
                          : 'bg-[#E2E8F0] text-[#64748B]'
                      }
                      group-hover:scale-110
                    `}
                  >
                    {currentStep > step.number ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    <p className={`text-sm font-medium
                      ${currentStep === step.number ? 'text-[#1E40AF]' : 'text-[#64748B]'}
                    `}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 bg-[#E2E8F0] mx-4 relative">
                    <div 
                      className="absolute inset-0 bg-[#1E40AF] transition-all duration-300"
                      style={{ 
                        width: currentStep > step.number ? '100%' : '0%',
                        opacity: currentStep > step.number ? 1 : 0
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Enhanced Form */}
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-[#E2E8F0] overflow-hidden transition-all duration-300">
            <div className="p-6 space-y-6">
              {/* Step 1: Exporter & Consignee Details */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Exporter Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#1E293B]">Exporter Details</h3>
                    <div>
                      <label className="block text-sm font-medium text-[#1E293B]">Exporter Name</label>
                      <input
                        type="text"
                        name="exporterName"
                        value={formData.exporterName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-[#E2E8F0] py-2 px-3 text-[#1E293B] placeholder-[#94A3B8]
                          focus:border-[#1E40AF] focus:ring focus:ring-[#1E40AF]/20 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1E293B]">Address</label>
                      <input
                        type="text"
                        name="exporterAddress"
                        value={formData.exporterAddress}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-[#E2E8F0] py-2 px-3 text-[#1E293B] placeholder-[#94A3B8]
                          focus:border-[#1E40AF] focus:ring focus:ring-[#1E40AF]/20 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1E293B]">Email</label>
                      <input
                        type="email"
                        name="exporterEmail"
                        value={formData.exporterEmail}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-[#E2E8F0] py-2 px-3 text-[#1E293B] placeholder-[#94A3B8]
                          focus:border-[#1E40AF] focus:ring focus:ring-[#1E40AF]/20 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1E293B]">Phone</label>
                      <input
                        type="tel"
                        name="exporterPhone"
                        value={formData.exporterPhone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-[#E2E8F0] py-2 px-3 text-[#1E293B] placeholder-[#94A3B8]
                          focus:border-[#1E40AF] focus:ring focus:ring-[#1E40AF]/20 bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Consignee Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#1E293B]">Consignee Details</h3>
                    <div>
                      <label className="block text-sm font-medium text-[#1E293B]">Consignee Name</label>
                      <input
                        type="text"
                        name="consigneeName"
                        value={formData.consigneeName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-[#E2E8F0] py-2 px-3 text-[#1E293B] placeholder-[#94A3B8]
                          focus:border-[#1E40AF] focus:ring focus:ring-[#1E40AF]/20 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1E293B]">Address</label>
                      <input
                        type="text"
                        name="consigneeAddress"
                        value={formData.consigneeAddress}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-[#E2E8F0] py-2 px-3 text-[#1E293B] placeholder-[#94A3B8]
                          focus:border-[#1E40AF] focus:ring focus:ring-[#1E40AF]/20 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1E293B]">Email</label>
                      <input
                        type="email"
                        name="consigneeEmail"
                        value={formData.consigneeEmail}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-[#E2E8F0] py-2 px-3 text-[#1E293B] placeholder-[#94A3B8]
                          focus:border-[#1E40AF] focus:ring focus:ring-[#1E40AF]/20 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1E293B]">Phone</label>
                      <input
                        type="tel"
                        name="consigneePhone"
                        value={formData.consigneePhone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-[#E2E8F0] py-2 px-3 text-[#1E293B] placeholder-[#94A3B8]
                          focus:border-[#1E40AF] focus:ring focus:ring-[#1E40AF]/20 bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Shipment Information */}
              {currentStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#1E293B]">Shipment ID</label>
                    <input
                      type="text"
                      name="shipmentId"
                      value={formData.shipmentId}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-[#E2E8F0] py-2 px-3 text-[#1E293B] placeholder-[#94A3B8]
                        focus:border-[#1E40AF] focus:ring focus:ring-[#1E40AF]/20 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1E293B]">Shipment Date</label>
                    <input
                      type="date"
                      name="shipmentDate"
                      value={formData.shipmentDate}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-[#E2E8F0] py-2 px-3 text-[#1E293B]
                        focus:border-[#1E40AF] focus:ring focus:ring-[#1E40AF]/20 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1E293B]">Number of Packages</label>
                    <input
                      type="number"
                      name="packageCount"
                      value={formData.packageCount}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-[#E2E8F0] py-2 px-3 text-[#1E293B] placeholder-[#94A3B8]
                        focus:border-[#1E40AF] focus:ring focus:ring-[#1E40AF]/20 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1E293B]">Total Weight (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-[#E2E8F0] py-2 px-3 text-[#1E293B] placeholder-[#94A3B8]
                        focus:border-[#1E40AF] focus:ring focus:ring-[#1E40AF]/20 bg-white"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Product Details */}
              {currentStep === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#1E293B]">Item Description</label>
                    <textarea
                      name="itemDescription"
                      value={formData.itemDescription}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-[#E2E8F0] py-2 px-3 text-[#1E293B] placeholder-[#94A3B8]
                        focus:border-[#1E40AF] focus:ring focus:ring-[#1E40AF]/20 bg-white"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1E293B]">HS Code</label>
                    <input
                      type="text"
                      name="hsCode"
                      value={formData.hsCode}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-[#E2E8F0] py-2 px-3 text-[#1E293B] placeholder-[#94A3B8]
                        focus:border-[#1E40AF] focus:ring focus:ring-[#1E40AF]/20 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1E293B]">Main Category</label>
                    <select
                      name="mainCategory"
                      value={formData.mainCategory}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-[#E2E8F0] py-2 px-3 text-[#1E293B] bg-white
                        focus:border-[#1E40AF] focus:ring focus:ring-[#1E40AF]/20"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Textiles">Textiles</option>
                      <option value="Chemicals">Chemicals</option>
                      <option value="Food">Food</option>
                      <option value="Machinery">Machinery</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1E293B]">Sub Category</label>
                    <input
                      type="text"
                      name="subCategory"
                      value={formData.subCategory}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-[#E2E8F0] py-2 px-3 text-[#1E293B] placeholder-[#94A3B8]
                        focus:border-[#1E40AF] focus:ring focus:ring-[#1E40AF]/20 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1E293B]">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-[#E2E8F0] py-2 px-3 text-[#1E293B] placeholder-[#94A3B8]
                        focus:border-[#1E40AF] focus:ring focus:ring-[#1E40AF]/20 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1E293B]">Item Weight (kg)</label>
                    <input
                      type="number"
                      name="itemWeight"
                      value={formData.itemWeight}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-[#E2E8F0] py-2 px-3 text-[#1E293B] placeholder-[#94A3B8]
                        focus:border-[#1E40AF] focus:ring focus:ring-[#1E40AF]/20 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1E293B]">Packaging Type</label>
                    <select
                      name="packagingType"
                      value={formData.packagingType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-[#E2E8F0] py-2 px-3 text-[#1E293B] bg-white
                        focus:border-[#1E40AF] focus:ring focus:ring-[#1E40AF]/20"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Carton">Carton</option>
                      <option value="Pallet">Pallet</option>
                      <option value="Box">Box</option>
                      <option value="Crate">Crate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1E293B]">Handling Instructions</label>
                    <textarea
                      name="handlingInstructions"
                      value={formData.handlingInstructions}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-[#E2E8F0] py-2 px-3 text-[#1E293B] placeholder-[#94A3B8]
                        focus:border-[#1E40AF] focus:ring focus:ring-[#1E40AF]/20 bg-white"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Documentation */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1E293B]">Commercial Invoice</label>
                    <input
                      type="file"
                      name="commercialInvoice"
                      onChange={handleFileChange}
                      className="mt-1 block w-full text-[#64748B]
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-[#1E40AF] file:text-white
                        hover:file:bg-[#1E293B]
                        file:cursor-pointer"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1E293B]">Packing List</label>
                    <input
                      type="file"
                      name="packingList"
                      onChange={handleFileChange}
                      className="mt-1 block w-full text-[#64748B]
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-[#1E40AF] file:text-white
                        hover:file:bg-[#1E293B]
                        file:cursor-pointer"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Navigation Buttons */}
            <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                  ${currentStep === 1 
                    ? 'bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed' 
                    : 'bg-white text-[#64748B] hover:text-[#1E293B] border border-[#E2E8F0] hover:border-[#1E40AF] shadow-sm hover:shadow'
                  }`}
                disabled={currentStep === 1}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous</span>
                </div>
              </button>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => {/* Add save draft functionality */}}
                  className="px-4 py-2 text-sm text-[#64748B] hover:text-[#1E293B]"
                >
                  Save as Draft
                </button>
                <button
                  type={currentStep === steps.length ? 'submit' : 'button'}
                  onClick={() => {
                    if (currentStep < steps.length) {
                      setCurrentStep(prev => prev + 1);
                    }
                  }}
                  className="px-6 py-2.5 bg-[#1E40AF] text-white text-sm font-medium rounded-lg hover:bg-[#1E293B] 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E40AF] shadow-sm hover:shadow-md
                    transition-all duration-200 transform hover:scale-105"
                >
                  <div className="flex items-center space-x-2">
                    <span>{currentStep === steps.length ? 'Submit' : 'Next'}</span>
                    {currentStep !== steps.length && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-8 max-w-4xl mx-auto bg-[#EFF6FF] rounded-xl p-4 border border-[#BFDBFE]">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-[#1E40AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#1E293B]">Need Help?</h4>
              <p className="mt-1 text-sm text-[#64748B]">
                Our documentation provides detailed guidelines for each field and requirements.{' '}
                <a href="/help" className="text-[#1E40AF] hover:text-[#1E293B] font-medium">
                  Learn more
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}