import { area, fld, sel, txt, type FieldDef } from './formFields';

export type SchemeId = 'mudra' | 'csr' | 'seed' | 'ngo' | 'pmegp' | 'cgtmse' | 'sidbi' | 'cgss' | 'naiff' | 'ahidf' | 'gic' | 'msme-design' | 'act-grant';

export type Scheme = {
  id: SchemeId;
  title: string;
  eyebrow: string;
  description: string;
  accent: string;
  badge: string;
  amount: string;
  fields: FieldDef[];
  checks: string[];
};

// Values are keyed by field key. Applicant and scheme fields share one map.
export type FormValues = Record<string, string>;

export const initialValues: FormValues = {};

export const schemes: Scheme[] = [
  {
    id: 'mudra', title: 'MUDRA Loan', eyebrow: 'Business finance', description: 'For micro enterprises and growing businesses seeking working capital.', accent: '#1c6b56', badge: 'Loan eligibility', amount: 'Up to ₹10 Lakh',
    fields: [
      txt('organization', 'Business / enterprise name', { placeholder: 'e.g. Sunrise Event Management' }),
      sel('businessType', 'Type of business', ['Manufacturing', 'Trading / retail', 'Services', 'Food processing', 'Transport', 'Other']),
      sel('businessStage', 'Business stage', ['New business (under 1 year)', 'Existing business (1–3 years)', 'Expanding business (3+ years)']),
      sel('loanCategory', 'Loan category', ['Shishu (up to ₹50,000)', 'Kishor (₹50,001 – ₹5 Lakh)', 'Tarun (₹5 Lakh – ₹10 Lakh)']),
      fld('amount', 'Loan amount required (INR)', 'amount', { placeholder: 'e.g. ₹3 Lakh', hint: 'Enter in ₹ Lakh or ₹ Crore' }),
      area('purpose', 'Purpose of loan', { placeholder: 'e.g. Two sewing machines and three months of working capital' }),
      sel('bankAccount', 'Do you have a bank account in the business name?', ['Yes, with a scheduled bank', 'No, not yet']),
    ],
    checks: ['Applicant identity verified', 'Business activity documented', 'Loan requirement within category'],
  },
  {
    id: 'csr', title: 'CSR Funding', eyebrow: 'Social impact', description: 'Grant support for organizations creating measurable community impact.', accent: '#1d4c88', badge: 'Grant eligibility', amount: 'Up to ₹10 Crore',
    fields: [
      txt('organization', 'Organisation name', { placeholder: 'e.g. VDR Foundation' }),
      sel('orgType', 'Organisation type', ['Registered trust', 'Society', 'Section 8 company', 'Non-profit company']),
      fld('yearsRegistered', 'Years since registration', 'number', { placeholder: 'e.g. 6' }),
      txt('schemeName', 'Project / programme title', { placeholder: 'e.g. Rural girls’ education initiative' }),
      sel('fundingType', 'Type of support requested', ['Project grant', 'Programme support', 'Capital support']),
      fld('amount', 'Funding requirement (INR)', 'amount', { placeholder: 'e.g. ₹2 Crore' }),
      sel('audited', 'Audited accounts status', ['Available', 'Under review', 'Not available']),
      area('purpose', 'Project purpose and expected outcomes', { placeholder: 'Describe the beneficiaries and measurable outcomes' }),
    ],
    checks: ['Organization registration verified', 'Project proposal status verified', 'Compliance documents reviewed', 'Previous funding history checked'],
  },
  {
    id: 'seed', title: 'Seed Fund Scheme', eyebrow: 'Startup support', description: 'Early-stage capital and guidance to help ambitious ideas take root.', accent: '#126c3d', badge: 'Startup eligibility', amount: 'Up to ₹50 Lakh',
    fields: [
      txt('organization', 'Startup / entity name', { placeholder: 'e.g. GreenTech Labs' }),
      sel('entityType', 'Entity type', ['Private limited company', 'LLP', 'Partnership firm', 'Recognised startup (DPIIT)']),
      txt('sector', 'Sector focus', { placeholder: 'e.g. Clean technology' }),
      fld('amount', 'Funding requirement (INR)', 'amount', { placeholder: 'e.g. ₹40 Lakh' }),
      sel('businessPlan', 'Business plan status', ['Plan ready for review', 'Under review', 'Needs documents']),
      sel('promoter', 'Promoter background status', ['Background documented', 'Under review', 'Needs documents']),
      area('purpose', 'Problem being solved and traction so far', { placeholder: 'One or two paragraphs is enough' }),
    ],
    checks: ['Registration of entity verified', 'Sectoral focus documented', 'Business plan viability reviewed', 'Promoter background reviewed'],
  },
  {
    id: 'ngo', title: 'NGO Elevation', eyebrow: 'Non-profit growth', description: 'Program support for established NGOs scaling their community work.', accent: '#1686a0', badge: 'Program eligibility', amount: 'Up to ₹84 Lakh',
    fields: [
      txt('organization', 'NGO / applicant name', { placeholder: 'e.g. Seva Foundation' }),
      sel('ngoType', 'Legal form', ['Society', 'Trust', 'Section 8 company']),
      fld('yearsRegistered', 'Years of registration', 'number', { placeholder: 'e.g. 5', hint: 'Minimum 3 years' }),
      sel('audited', 'Audited financial statements', ['Available', 'Under review', 'Not available']),
      fld('amount', 'Grant requirement (INR)', 'amount', { placeholder: 'e.g. ₹60 Lakh' }),
      area('purpose', 'Programme focus and community impact', { placeholder: 'e.g. Women’s livelihood programme in 20 villages' }),
    ],
    checks: ['NGO status established', 'Audited financial statements available', 'Community impact documented', 'Detailed program proposal reviewed'],
  },
  {
    id: 'pmegp', title: 'PMEGP', eyebrow: 'Employment generation', description: 'Government subsidy for setting up new micro enterprises and generating self-employment.', accent: '#b3541e', badge: 'Subsidy eligibility', amount: '₹20 Lakh Service · ₹50 Lakh Manufacturing',
    fields: [
      txt('organization', 'Business / unit name', { placeholder: 'e.g. Om Handicrafts' }),
      fld('dob', 'Date of birth', 'date', { hint: 'Applicant must be 18 or older' }),
      sel('unitType', 'Type of unit', ['Manufacturing', 'Service']),
      fld('amount', 'Project cost (INR)', 'amount', { placeholder: 'e.g. ₹20 Lakh', hint: 'Manufacturing up to ₹50 Lakh · Service up to ₹20 Lakh' }),
      sel('applicantCategory', 'Applicant category', ['General', 'SC/ST', 'OBC', 'Minority', 'Women', 'Ex-Servicemen', 'Physically Handicapped']),
      sel('area', 'Area of unit', ['Rural', 'Urban']),
      sel('education', 'Educational qualification', ['Below Class VIII', 'Class VIII and above', 'Graduate and above']),
    ],
    checks: ['Applicant age 18+ verified', 'Educational qualification matches project cost limit', 'New unit eligibility confirmed (no prior PMEGP subsidy availed)', 'Area and category eligibility matched'],
  },
  {
    id: 'cgtmse', title: 'CGTMSE', eyebrow: 'Collateral-free credit', description: 'Credit guarantee cover for collateral-free loans to micro and small enterprises.', accent: '#6a3fa0', badge: 'Credit guarantee eligibility', amount: 'Up to ₹2 Crore',
    fields: [
      txt('organization', 'MSE / enterprise name', { placeholder: 'e.g. Shree Industries' }),
      fld('udyam', 'Udyam registration number', 'udyam', { placeholder: 'UDYAM-MH-00-0000000' }),
      sel('loanCategory', 'Enterprise category', ['Micro enterprise (up to ₹5 Lakh)', 'Small enterprise (up to ₹2 Crore)', 'Retail trade (up to ₹100 Lakh)']),
      fld('amount', 'Loan amount required (INR)', 'amount', { placeholder: 'e.g. ₹50 Lakh' }),
      sel('collateralStatus', 'Collateral offered', ['No collateral offered', 'Partial collateral', 'Full collateral']),
      txt('lendingInstitution', 'Lending bank / NBFC', { placeholder: 'e.g. HDFC Bank' }),
    ],
    checks: ['MSE / Udyam registration verified', 'Loan qualifies as collateral-free credit facility', 'Enterprise category within CGTMSE limits', 'Lending institution empanelled with CGTMSE'],
  },
  {
    id: 'sidbi', title: 'SIDBI Term Loan', eyebrow: 'Term lending', description: 'Term finance for MSMEs to expand, modernise or start new projects through SIDBI-linked lenders.', accent: '#7a4a1e', badge: 'Term loan eligibility', amount: '₹1 Cr to ₹50 Cr',
    fields: [
      txt('organization', 'MSME / enterprise name', { placeholder: 'e.g. Bharat Engineering Works' }),
      fld('udyam', 'Udyam registration number', 'udyam', { placeholder: 'UDYAM-MH-00-0000000' }),
      sel('loanType', 'Type of loan', ['Term loan', 'Expansion loan', 'Modernisation loan', 'New project loan']),
      sel('sector', 'Industry / sector', ['Engineering', 'Food processing', 'Textiles', 'Chemicals', 'Electronics', 'Auto components', 'Other']),
      fld('amount', 'Loan amount required (INR)', 'amount', { placeholder: 'e.g. ₹5 Crore', hint: 'Range ₹1 Cr – ₹50 Cr' }),
      sel('projectReport', 'Project report status', ['Prepared and ready', 'In preparation', 'Not yet prepared']),
      txt('lendingInstitution', 'Lending bank / NBFC', { placeholder: 'e.g. SIDBI-refinanced bank' }),
    ],
    checks: ['MSME registration verified', 'Project report reviewed', 'Loan amount within ₹1–50 Cr range', 'Lending institution linkage confirmed'],
  },
  {
    id: 'cgss', title: 'CGSS Startup Guarantee', eyebrow: 'Startup credit guarantee', description: 'Credit guarantee cover for startups borrowing from eligible lenders without collateral.', accent: '#2b5d8a', badge: 'Guarantee eligibility', amount: 'Up to ₹20 Cr',
    fields: [
      txt('organization', 'Startup name', { placeholder: 'e.g. Nova Health Tech' }),
      txt('registration', 'DPIIT recognition number', { placeholder: 'e.g. DIPP12345' }),
      fld('yearsRegistered', 'Years since incorporation', 'number', { placeholder: 'e.g. 2' }),
      sel('sector', 'Sector focus', ['Fintech', 'Healthtech', 'Edtech', 'Agritech', 'SaaS / software', 'Manufacturing', 'Other']),
      fld('amount', 'Loan requirement (INR)', 'amount', { placeholder: 'e.g. ₹2 Crore' }),
      sel('lenderType', 'Lender type', ['Scheduled commercial bank', 'Public sector bank', 'NBFC']),
      txt('lendingInstitution', 'Lending institution name', { placeholder: 'e.g. State Bank of India' }),
    ],
    checks: ['Startup recognition verified', 'Incorporation period within scheme limit', 'Loan qualifies for guarantee cover', 'Lending institution empanelled'],
  },
  {
    id: 'naiff', title: 'NAIFF', eyebrow: 'Agri infrastructure', description: 'Long-term financing for agriculture infrastructure and post-harvest value-chain projects.', accent: '#4a7a2a', badge: 'Infrastructure eligibility', amount: 'Up to ₹2 Cr',
    fields: [
      txt('organization', 'Borrower / FPO name', { placeholder: 'e.g. Kisan Producer Company' }),
      sel('fundingType', 'Borrower type', ['Farmer', 'Farmer Producer Organisation (FPO)', 'Agri-entrepreneur', 'Cooperative']),
      sel('sector', 'Infrastructure type', ['Cold storage', 'Warehouse', 'Primary processing unit', 'Silos', 'Sorting and grading unit', 'Other']),
      fld('amount', 'Loan requirement (INR)', 'amount', { placeholder: 'e.g. ₹1.5 Crore', hint: 'Up to ₹2 Cr' }),
      sel('landOwnership', 'Land ownership', ['Owned', 'Leased (minimum 10-year lease)', 'Not yet arranged']),
      area('purpose', 'Project purpose and capacity', { placeholder: 'e.g. 5,000 MT potato cold storage' }),
    ],
    checks: ['Borrower category verified', 'Project location and land documents reviewed', 'Project cost within scheme limit', 'Lending bank linkage confirmed'],
  },
  {
    id: 'ahidf', title: 'AHIDF', eyebrow: 'Animal husbandry', description: 'Financing for dairy, meat processing and animal feed infrastructure.', accent: '#8a6a12', badge: 'Infrastructure eligibility', amount: 'Up to ₹50 Cr',
    fields: [
      txt('organization', 'Applicant / company name', { placeholder: 'e.g. Gokul Dairy Private Limited' }),
      sel('applicantCategory', 'Applicant category', ['Individual / entrepreneur', 'Farmer Producer Organisation', 'Company', 'Cooperative', 'Section 8 company']),
      sel('sector', 'Project type', ['Dairy processing', 'Meat processing', 'Animal feed plant', 'Animal health / vaccine', 'Other']),
      fld('amount', 'Project cost (INR)', 'amount', { placeholder: 'e.g. ₹20 Crore', hint: 'Up to ₹50 Cr' }),
      sel('landOwnership', 'Land ownership', ['Owned', 'Leased (minimum 10-year lease)', 'Not yet arranged']),
      area('purpose', 'Project description and capacity', { placeholder: 'e.g. Milk chilling and packaging unit, 20,000 litres per day' }),
    ],
    checks: ['Applicant identity and registration verified', 'Project report and land documents reviewed', 'Project cost within AHIDF range', 'Lending institution linkage confirmed'],
  },
  {
    id: 'gic', title: 'GIC Grant', eyebrow: 'Innovation grant', description: 'Grant support for innovators and early-stage ventures building new products or services.', accent: '#6b3f8c', badge: 'Grant eligibility', amount: 'Up to ₹8.6 Cr',
    fields: [
      txt('organization', 'Organisation / innovator name', { placeholder: 'e.g. Lumen Labs' }),
      sel('entityType', 'Applicant type', ['Individual innovator', 'Startup', 'Registered non-profit', 'Company']),
      txt('registration', 'Registration / incorporation number', { placeholder: 'Leave blank if not registered', optional: true }),
      txt('sector', 'Innovation domain', { placeholder: 'e.g. Low-cost diagnostics' }),
      fld('amount', 'Grant requirement (INR)', 'amount', { placeholder: 'e.g. ₹2 Crore', hint: 'Up to ₹8.6 Cr' }),
      sel('fundingType', 'Support type', ['Grant', 'Programme support', 'Institutional support']),
      area('purpose', 'Innovation summary and expected outcome', { placeholder: 'e.g. Portable diagnostic device for rural clinics' }),
    ],
    checks: ['Organization registration verified', 'Innovation proposal reviewed', 'Previous funding history checked', 'Budget utilisation plan reviewed'],
  },
  {
    id: 'msme-design', title: 'MSME Design Scheme', eyebrow: 'Design support', description: 'Support for MSMEs to improve product design, packaging and market competitiveness.', accent: '#a03d5c', badge: 'Design eligibility', amount: 'Up to ₹40 Lakh',
    fields: [
      txt('organization', 'MSME name', { placeholder: 'e.g. Rangoli Handicrafts' }),
      fld('udyam', 'Udyam registration number', 'udyam', { placeholder: 'UDYAM-MH-00-0000000' }),
      txt('sector', 'Product / sector', { placeholder: 'e.g. Home décor' }),
      fld('yearsRegistered', 'Years in business', 'number', { placeholder: 'e.g. 3' }),
      sel('designType', 'Design support required', ['Product design', 'Packaging design', 'Brand identity', 'Export-oriented design']),
      fld('amount', 'Support required (INR)', 'amount', { placeholder: 'e.g. ₹30 Lakh', hint: 'Up to ₹40 Lakh' }),
      area('purpose', 'Design project scope', { placeholder: 'e.g. Packaging redesign for export markets' }),
    ],
    checks: ['Udyam registration verified', 'Design project scope reviewed', 'Support amount within scheme limit', 'Business activity documented'],
  },
  {
    id: 'act-grant', title: 'ACT Grant', eyebrow: 'Clean technology', description: 'Grant support for clean technology innovations moving from prototype to market.', accent: '#1f7a7a', badge: 'Grant eligibility', amount: 'Up to ₹1.5 Cr',
    fields: [
      txt('organization', 'Startup / entity name', { placeholder: 'e.g. GreenCell Energy' }),
      txt('registration', 'Registration / incorporation number', { placeholder: 'e.g. U40100MH2024PTC000000' }),
      txt('sector', 'Technology area', { placeholder: 'e.g. Clean energy storage' }),
      sel('businessStage', 'Stage of technology', ['Prototype', 'Pilot', 'Commercialisation']),
      fld('amount', 'Grant requirement (INR)', 'amount', { placeholder: 'e.g. ₹1 Crore', hint: 'Up to ₹1.5 Cr' }),
      area('purpose', 'Project purpose and milestones', { placeholder: 'e.g. Pilot deployment of battery storage units' }),
    ],
    checks: ['Entity registration verified', 'Technology readiness level documented', 'Project plan reviewed', 'Budget utilisation plan reviewed'],
  },
];
