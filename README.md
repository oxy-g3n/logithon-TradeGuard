# TradeGuard: Rapid Compliance Checker for Cross-Border Shipments

## 📋 Project Overview
TradeGuard is a compliance verification system designed for small export businesses that send parcels internationally. The system quickly verifies the compliance of each parcel before it's handed off to the courier, checking for basic issues like missing required fields, restricted item types, or conflicting destination restrictions, and flags any potential problems in real time.

## 👥 User Roles

### 1. Standard User (Shipping Staff)
- Primary users who process day-to-day shipments
- Can create, validate, and manage their own shipments
- View compliance reports and export shipping forms
- Limited to predefined compliance rules

### 2. Admin User (Compliance Manager)
- Oversees the entire compliance process
- Defines and modifies compliance rules
- Access to advanced analytics and all shipment data

## 📱 Page Structure & Features

### A. Authentication Pages (Both Users)
1. **Login Page**
   - Email/username and password login
   - Role-based redirection after login
   - Password recovery option

2. **Registration Page** (Admin approval required)
   - Basic user information collection
   - Terms and conditions acceptance
   - Email verification

### B. Standard User Pages

1. **Dashboard Page**
   - Summary statistics (total shipments, compliance rate)
   - Recent shipments with status indicators
   - Quick actions (new shipment, upload CSV)
   - Notifications for flagged shipments

2. **Shipment Management**
   - **Shipment List Page**
     - Filterable/sortable list of all shipments
     - Status indicators (Compliant/Flagged)
     - Search functionality
   
   - **New Shipment Page - individual shipment adding**
     - Step-by-step shipment creation wizard
     - Real-time validation feedback
     - Display Templates of required fields of packages
     - Submit for compliance check
   
   - **Shipment Detail Page**
     - Complete shipment information
     - Compliance status and details
     - Edit option for draft shipments
     - Generate shipping form/compliance report

   - **CSV Upload Page**
     - File upload interface with drag-and-drop
     - Template download option

3. **Compliance Reports**
   - **Report Generation Page**
     - Form to select shipments for reporting
     - Report format options (PDF/HTML)
     - Preview before export
     - Download/email options
   
   - **Saved Reports Page**
     - List of previously generated reports
     - Quick download options
     - Share functionality

### C. Admin User Pages

1. **Admin Dashboard**
   - Advanced analytics (compliance trends, common violations)
   - System status indicators
   - User activity summary
   - Quick access to rule management

2. **User Management**
   - **User List Page**
     - All system users with role indicators
     - Activity status and metrics
     - Bulk actions (enable/disable)
   
   - **User Detail/Edit Page**
     - Detailed user information
     - Permission management
     - Activity logs

3. **Rule Management**
   - **Rules List Page**
     - All compliance rules with status
     - Quick enable/disable toggles
     - Rule priority management
     - Fetching Rules from 
   
   - **Rule Creation/Edit Page**
     - Rule definition interface
     - Condition builder (visual interface)
     - Testing tool for rule validation
     - Activation controls

4. **System Configuration**
   - **General Settings Page**
     - System-wide configurations
     - Branding and customization
     - Email templates
   
   - **Integration Settings**
     - API configuration
     - Third-party service connections
     - Exchange rate sources

5. **Audit & Logs**
   - **Audit Trail Page**
     - Chronological list of system actions
     - Filtering by user, action type, date
     - Export functionality
   
   - **Override Logs**
     - Record of all compliance overrides
     - Justification and documentation links
     - Approval chain information

## 🎯 Key Features & Implementation Checklist

### 1. Data Ingestion
- [ ] Create/simulate dataset of shipments (items, declared value, weight, destination country, commodity codes)
- [ ] Build user interface for manual data entry (Standard User)
- [ ] Implement CSV upload functionality (Standard User)
- [ ] Validate uploaded data format
- [ ] Store shipment data in database
- [ ] Create data management tools (Admin)

### 2. Rule-Based Validation
- [ ] Define compliance rules:
  - [ ] Restricted country validation
  - [ ] Value threshold validation
  - [ ] Restricted items validation
  - [ ] Weight limit validation
  - [ ] Required documentation check
- [ ] Implement rule engine architecture
- [ ] Create clear alert messages for rule violations
- [ ] Design rule priority system
- [ ] Build rule management interface (Admin)
- [ ] Implement override mechanism with approval workflow (Admin)

### 3. Dashboard & UI
- [ ] Design main dashboard layout (Standard User)
- [ ] Create admin dashboard with advanced analytics (Admin)
- [ ] Implement shipment status display (Compliant/Flagged)
- [ ] Create detailed view for flagged shipments
- [ ] Add rule violation explanations
- [ ] Include remediation suggestions
- [ ] Implement responsive design for multiple devices
- [ ] Design notification system for both user types

### 4. Output Generation
- [ ] Design "Shipping Form" template
- [ ] Create "Compliance Report" template
- [ ] Implement PDF generation
- [ ] Implement HTML export option
- [ ] Add save/export functionality
- [ ] Include all relevant shipment details in reports
- [ ] Create custom report builder (Admin)

### 5. User Management
- [ ] Implement authentication system
- [ ] Create user registration workflow
- [ ] Design role-based access control
- [ ] Build user management interface (Admin)
- [ ] Implement activity logging
- [ ] Create user profile management

### 6. Stretch Goals
- [ ] Admin panel for rule management
- [ ] Exchange rate/tax/tariff calculations
- [ ] Cloud deployment setup
- [ ] AI-based compliance prediction
- [ ] Historical compliance tracking
- [ ] Batch processing capabilities
- [ ] Mobile app for on-the-go compliance checks
- [ ] Integration with shipping carriers' APIs

## 🛠️ Proposed Tech Stack

### Backend
- **Framework**: Node.js with Express.js
  - Fast development, excellent for APIs, great ecosystem
  - Alternative: Python with FastAPI or Django

- **Database**: MongoDB
  - Flexible schema for varying shipment data
  - Easy to scale
  - Alternative: PostgreSQL if more structured data is preferred

- **Authentication**: JWT with refresh tokens
  - Secure, stateless authentication
  - Role-based access control

- **Rule Engine**: JSON-based rules with custom validation logic
  - Alternative: Drools (Java-based) for more complex rule scenarios

- **PDF Generation**: PDFKit or jsPDF
  - Easily create PDF documents from HTML/JSON data

### Frontend
- **Framework**: React.js
  - Component-based architecture for reusable UI elements
  - Large ecosystem and community support
  - Alternative: Vue.js for simpler projects

- **UI Library**: Material-UI or Ant Design
  - Pre-built components for faster development
  - Professional look and feel
  - Responsive design out of the box

- **State Management**: Redux or Context API
  - Centralized state management
  - Predictable state updates

- **Data Visualization**: Recharts or Chart.js
  - Display compliance statistics and trends
  - Interactive charts for better data understanding

- **Form Handling**: Formik with Yup validation
  - Simplified form state management
  - Robust validation capabilities

### Deployment
- **Containerization**: Docker
  - Consistent environment across development and production
  - Easy deployment to various platforms

- **Hosting Options**:
  - Vercel or Netlify for frontend
  - Heroku, Railway, or Render for backend
  - MongoDB Atlas for database

## 📊 Suggested Datasets

1. **Sample International Shipment Data**:
   - UN Comtrade Database (simplified subset): https://comtrade.un.org/
   - Open source trade datasets from government portals

2. **Commodity Codes**:
   - Harmonized System (HS) codes: https://www.trade.gov/harmonized-system-hs-codes
   - Create a subset of common export items with their codes

3. **Country Restrictions**:
   - OFAC Sanctions Lists: https://sanctionssearch.ofac.treas.gov/
   - Export Administration Regulations (EAR) country lists

4. **Simulated Data Generation**:
   - Create a script to generate realistic shipment data with:
     - Random but realistic weights (0.1kg - 500kg)
     - Varied declared values ($1 - $10,000)
     - Mix of compliant and non-compliant shipments
     - Common export items (electronics, textiles, food products, etc.)
     - Various destination countries (mix of restricted and unrestricted)

## 🖥️ UI/UX Design Recommendations

1. **Dashboard Layout**:
   - Clean, minimal interface with clear visual hierarchy
   - Color-coded status indicators (green for compliant, red for flagged)
   - Filterable and sortable shipment list
   - Summary statistics at the top (total shipments, compliance rate, etc.)
   - Different dashboard views for Admin vs Standard users

2. **Shipment Entry Form**:
   - Step-by-step wizard for manual entry
   - Drag-and-drop zone for CSV uploads
   - Real-time validation feedback
   - Autosave functionality
   - Mobile-responsive design

3. **Compliance Details View**:
   - Expandable panels for each rule violation
   - Visual indicators of severity
   - Clear, actionable remediation steps
   - Option to override with authorization (admin only)
   - Documentation attachment capability

4. **Report Generation**:
   - Preview before export
   - Multiple format options
   - Customizable templates (admin feature)
   - Batch export capability
   - Branding options

5. **Admin Interfaces**:
   - Consistent design language with standard user interfaces
   - Clear visual distinction for administrative functions
   - Confirmation dialogs for critical actions
   - Comprehensive help tooltips
   - Audit trail visibility

## 🚀 Implementation Approach

1. **Phase 1: Core Functionality**
   - Set up project structure and basic UI
   - Implement authentication and user roles
   - Create standard user dashboard and shipment entry
   - Implement data ingestion (manual entry + CSV upload)
   - Create basic rule validation engine
   - Develop simple compliance status display

2. **Phase 2: Enhanced Features**
   - Develop admin dashboard and user management
   - Implement rule management interface
   - Improve UI/UX with detailed violation reporting
   - Implement PDF/HTML report generation
   - Add more sophisticated validation rules
   - Create detailed dashboards with statistics

3. **Phase 3: Optimization & Stretch Goals**
   - Implement override workflow with approvals
   - Develop exchange rate and tariff calculations
   - Add AI-based compliance prediction
   - Create mobile-responsive views
   - Implement batch processing
   - Deploy to cloud platform

## 📈 Evaluation Metrics

- **Functionality**: All core features working as expected
- **Business Viability**: Solution addresses real-world export compliance needs
- **Rule Implementation**: Rules correctly identify compliance issues
- **Data Quality**: Realistic simulation of international shipping scenarios
- **UI/UX Design**: Intuitive, responsive, and visually appealing interface
- **Role Separation**: Clear distinction between admin and standard user capabilities

## 🔄 Getting Started

1. Clone this repository
2. Install dependencies
3. Set up the database
4. Configure authentication
5. Run the development server
6. Access the application at localhost:3000

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
