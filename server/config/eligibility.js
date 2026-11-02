// Single source of truth for the server: the scheme IDs and statuses the API accepts.
export const SCHEME_IDS = [
  'mudra', 'csr', 'seed', 'ngo', 'pmegp', 'cgtmse', 'sidbi', 'cgss', 'naiff', 'ahidf', 'gic', 'msme-design', 'act-grant',
];

export const STATUSES = ['Eligible', 'Under Review', 'Not Eligible'];

// Form field names are plain identifiers (letters and digits). This rejects Mongo operators and "_id".
export const FIELD_KEY_PATTERN = /^[a-zA-Z][a-zA-Z0-9]{1,40}$/;
export const MAX_FIELDS = 40;
export const MAX_FIELD_LENGTH = 500;
