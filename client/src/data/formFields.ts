export type FieldKind =
  | 'text' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'textarea'
  | 'amount' | 'pan' | 'udyam' | 'pincode' | 'ifsc' | 'gst';

export type FieldDef = {
  key: string;
  label: string;
  kind: FieldKind;
  placeholder?: string;
  hint?: string;
  options?: string[];
  optional?: boolean;
};

type Options = { placeholder?: string; hint?: string; optional?: boolean };

export const txt = (key: string, label: string, options: Options = {}): FieldDef => ({ key, label, kind: 'text', ...options });
export const area = (key: string, label: string, options: Options = {}): FieldDef => ({ key, label, kind: 'textarea', ...options });
export const fld = (key: string, label: string, kind: FieldKind, options: Options = {}): FieldDef => ({ key, label, kind, ...options });
export const sel = (key: string, label: string, options: string[], extra: Options = {}): FieldDef => ({
  key, label, kind: 'select', options, placeholder: 'Select an option', ...extra,
});

export const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
  'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

// Fields every applicant fills in, whatever the scheme.
export const applicantFields: FieldDef[] = [
  txt('applicant', 'Full name of applicant', { placeholder: 'As per PAN card' }),
  fld('phone', 'Mobile number', 'tel', { placeholder: '10-digit mobile number', hint: 'For application updates' }),
  fld('email', 'Email address', 'email', { placeholder: 'name@example.com' }),
  fld('pan', 'PAN number', 'pan', { placeholder: 'ABCDE1234F', hint: '10 characters' }),
  txt('address', 'Residential address', { placeholder: 'House no., street, locality' }),
  sel('state', 'State / UT', INDIAN_STATES),
  txt('district', 'District', { placeholder: 'e.g. Pune' }),
  fld('pincode', 'PIN code', 'pincode', { placeholder: '6-digit PIN' }),
];
