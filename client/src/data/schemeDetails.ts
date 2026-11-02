import type { SchemeId } from './schemes';

export type SchemeDetails = {
  code: string;
  icon: 'Store' | 'HeartHandshake' | 'Sprout' | 'Users' | 'Factory' | 'ShieldCheck' | 'Landmark' | 'Rocket' | 'Wheat' | 'Milk' | 'Lightbulb' | 'Palette' | 'Leaf';
  coverFrom: string;
  coverTo: string;
  agency: string;
  summary: string;
  eligibility: string[];
  documents: string[];
  // Funding limits in INR, used to validate the requested amount.
  limit: { min: number; max: number };
};

const TBC = 'To be confirmed';

export const schemeDetails: Record<SchemeId, SchemeDetails> = {
  mudra: {
    code: 'MUD', icon: 'Store', coverFrom: '#1c6b56', coverTo: '#0c3b2e',
    agency: 'Ministry of Finance · Pradhan Mantri MUDRA Yojana',
    summary: 'Collateral-free term loans for non-farm micro and small enterprises under the Shishu, Kishor and Tarun categories.',
    eligibility: ['Non-farm income-generating activity (manufacturing, trading or services)', 'Loan amount within the chosen category limit', 'No wilful default with any lending institution'],
    documents: ['Identity proof (Aadhaar / PAN)', 'Business address proof', 'Quotation or business plan', 'Bank statements for the last 6 months'],
    limit: { min: 1, max: 1000000 },
  },
  csr: {
    code: 'CSR', icon: 'HeartHandshake', coverFrom: '#1d4c88', coverTo: '#102c52',
    agency: 'Corporate Social Responsibility · Companies Act, 2013 (Section 135)',
    summary: 'Grant support for organisations running measurable community programmes funded from company CSR budgets.',
    eligibility: ['Registered trust, society, NGO or Section 8 company', 'Project aligned with Schedule VII activities', 'Audited accounts for the last two years'],
    documents: ['Registration certificate', 'Project proposal with budget and outcomes', 'Audited financial statements', 'Board resolution'],
    limit: { min: 1, max: 100000000 },
  },
  seed: {
    code: 'SEE', icon: 'Sprout', coverFrom: '#126c3d', coverTo: '#0a3f24',
    agency: TBC,
    summary: 'Early-stage capital and mentoring for startups that have a viable business plan and a committed promoter team.',
    eligibility: ['Registered entity (private limited, LLP or startup recognition)', 'Sector focus clearly documented', 'Business plan reviewed for viability'],
    documents: ['Incorporation certificate', 'Detailed business plan', 'Promoter profiles and CVs', 'Pitch deck or project report'],
    limit: { min: 1, max: 5000000 },
  },
  ngo: {
    code: 'NGO', icon: 'Users', coverFrom: '#1686a0', coverTo: '#0b5366',
    agency: TBC,
    summary: 'Programme support for established non-profit organisations scaling community work such as livelihoods and education.',
    eligibility: ['NGO registered for at least 3 years', 'Audited financial statements available', 'Documented community impact'],
    documents: ['Registration certificate (Society / Trust)', 'Audited statements (last 3 years)', 'Programme proposal', 'Impact report'],
    limit: { min: 1, max: 8400000 },
  },
  pmegp: {
    code: 'PMG', icon: 'Factory', coverFrom: '#b3541e', coverTo: '#6e3010',
    agency: 'Ministry of MSME · Prime Minister’s Employment Generation Programme',
    summary: 'Credit-linked capital subsidy for setting up new micro enterprises in manufacturing (up to ₹50 Lakh) or service (up to ₹20 Lakh).',
    eligibility: ['Age 18 years or above', 'Educational qualification matching the project cost limit', 'New unit only; no prior PMEGP subsidy availed'],
    documents: ['Identity and age proof', 'Educational certificate', 'Project report and cost estimate', 'Caste certificate (if applicable)'],
    limit: { min: 1, max: 5000000 },
  },
  cgtmse: {
    code: 'CGT', icon: 'ShieldCheck', coverFrom: '#6a3fa0', coverTo: '#3d2160',
    agency: 'Ministry of MSME · Credit Guarantee Fund Trust for Micro and Small Enterprises',
    summary: 'Credit guarantee cover that lets micro and small enterprises borrow without offering collateral or third-party guarantee.',
    eligibility: ['Udyam-registered micro or small enterprise', 'Loan qualifies as a collateral-free facility', 'Lending institution is empanelled with CGTMSE'],
    documents: ['Udyam registration certificate', 'Loan application with project details', 'Income tax returns (last 2 years)', 'Bank statements'],
    limit: { min: 1, max: 20000000 },
  },
  sidbi: {
    code: 'SID', icon: 'Landmark', coverFrom: '#7a4a1e', coverTo: '#432710',
    agency: 'Small Industries Development Bank of India (SIDBI) via partner lenders',
    summary: 'Term finance for MSMEs to expand, modernise or start new projects through SIDBI-refinanced banks and NBFCs.',
    eligibility: ['MSME with Udyam registration', 'Project report prepared and reviewed', 'Loan amount between ₹1 Cr and ₹50 Cr'],
    documents: ['Udyam registration certificate', 'Detailed project report', 'Audited financials (last 2 years)', 'Collateral or security details'],
    limit: { min: 10000000, max: 500000000 },
  },
  cgss: {
    code: 'CGS', icon: 'Rocket', coverFrom: '#2b5d8a', coverTo: '#183a58',
    agency: 'Government of India · Credit Guarantee Scheme for Startups',
    summary: 'Collateral-free credit guarantee for DPIIT-recognised startups borrowing from eligible lenders.',
    eligibility: ['DPIIT-recognised startup', 'Incorporated within the scheme period', 'Lending institution is empanelled'],
    documents: ['DPIIT recognition certificate', 'Incorporation certificate', 'Loan application and business plan', 'Bank statements'],
    limit: { min: 1, max: 200000000 },
  },
  naiff: {
    code: 'NAI', icon: 'Wheat', coverFrom: '#4a7a2a', coverTo: '#2c4a18',
    agency: 'Ministry of Agriculture & Farmers Welfare · NAIFF',
    summary: 'Long-term financing for agriculture infrastructure such as cold storage, warehouses and primary processing units.',
    eligibility: ['Farmer, FPO, cooperative or agri-entrepreneur', 'Project located on owned or leased land', 'Loan amount up to ₹2 Cr'],
    documents: ['Identity proof', 'Land ownership or lease documents', 'Project report and cost estimate', 'Bank statements'],
    limit: { min: 1, max: 20000000 },
  },
  ahidf: {
    code: 'AHI', icon: 'Milk', coverFrom: '#8a6a12', coverTo: '#5a4408',
    agency: 'Department of Animal Husbandry & Dairying · AHIDF',
    summary: 'Financing for dairy processing, meat processing, animal feed plants and animal health infrastructure.',
    eligibility: ['Individual, FPO, company or cooperative', 'Project cost up to ₹50 Cr', 'Project report and land documents reviewed'],
    documents: ['Registration or incorporation certificate', 'Project report', 'Land documents', 'Bank statements'],
    limit: { min: 1, max: 500000000 },
  },
  gic: {
    code: 'GIC', icon: 'Lightbulb', coverFrom: '#6b3f8c', coverTo: '#3b2150',
    agency: TBC,
    summary: 'Grant support for innovators and early-stage ventures building new products or services.',
    eligibility: ['Registered organisation or innovator', 'Innovation proposal with clear outcomes', 'Budget utilisation plan provided'],
    documents: ['Registration certificate', 'Innovation proposal', 'Budget plan', 'Prior funding details (if any)'],
    limit: { min: 1, max: 86000000 },
  },
  'msme-design': {
    code: 'MSD', icon: 'Palette', coverFrom: '#a03d5c', coverTo: '#5e2135',
    agency: 'Ministry of MSME · MSME Design Scheme',
    summary: 'Support for MSMEs to improve product design, packaging and export competitiveness.',
    eligibility: ['Udyam-registered MSME', 'Design project scope documented', 'Support requested within the scheme limit'],
    documents: ['Udyam registration certificate', 'Design project scope and quotation', 'Bank statements'],
    limit: { min: 1, max: 4000000 },
  },
  'act-grant': {
    code: 'ACT', icon: 'Leaf', coverFrom: '#1f7a7a', coverTo: '#0f4646',
    agency: TBC,
    summary: 'Grant support for clean technology innovations moving from prototype to pilot and commercial deployment.',
    eligibility: ['Registered startup or entity', 'Technology readiness level documented', 'Project plan and budget reviewed'],
    documents: ['Registration certificate', 'Technology description and readiness report', 'Project plan and budget'],
    limit: { min: 1, max: 15000000 },
  },
};
