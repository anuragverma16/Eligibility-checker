import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateApplication } from '../validation/application.js';

const validBody = {
  schemeId: 'sidbi',
  referenceId: 'GW-SID-123456',
  status: 'Eligible',
  values: {
    applicant: 'Aditi Sharma',
    organization: 'Bharat Engineering Works',
    phone: '98765 43210',
    email: 'aditi@example.com',
    amount: '₹5 Crore',
    loanType: 'Term Loan',
  },
};

test('accepts a complete application', () => {
  const result = validateApplication(validBody);
  assert.equal(result.ok, true);
  assert.equal(result.value.schemeId, 'sidbi');
  assert.equal(result.value.values.applicant, 'Aditi Sharma');
});

test('drops field names that are not plain identifiers', () => {
  const result = validateApplication({ ...validBody, values: { ...validBody.values, _id: 'x', $where: 'y', 'a.b': 'z' } });
  assert.equal(result.ok, true);
  assert.equal('_id' in result.value.values, false);
  assert.equal('$where' in result.value.values, false);
  assert.equal('a.b' in result.value.values, false);
});

test('keeps the new form fields such as PAN, state and Udyam number', () => {
  const result = validateApplication({ ...validBody, values: { ...validBody.values, pan: 'ABCDE1234F', state: 'Maharashtra', udyam: 'UDYAM-MH-00-0000000' } });
  assert.equal(result.value.values.pan, 'ABCDE1234F');
  assert.equal(result.value.values.state, 'Maharashtra');
  assert.equal(result.value.values.udyam, 'UDYAM-MH-00-0000000');
});

test('caps the number of stored fields', () => {
  const many = Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`field${i}`, 'x']));
  const result = validateApplication({ ...validBody, values: { ...validBody.values, ...many } });
  assert.equal(Object.keys(result.value.values).length, 40);
});

test('rejects unknown schemes and statuses', () => {
  assert.equal(validateApplication({ ...validBody, schemeId: 'unknown' }).ok, false);
  assert.equal(validateApplication({ ...validBody, status: 'Approved' }).ok, false);
});

test('rejects malformed reference IDs', () => {
  assert.equal(validateApplication({ ...validBody, referenceId: 'GW-1' }).ok, false);
});

test('rejects an invalid email or phone number', () => {
  assert.equal(validateApplication({ ...validBody, values: { ...validBody.values, email: 'not-an-email' } }).ok, false);
  assert.equal(validateApplication({ ...validBody, values: { ...validBody.values, phone: '12345' } }).ok, false);
});

test('rejects non-object bodies', () => {
  assert.equal(validateApplication(null).ok, false);
  assert.equal(validateApplication([]).ok, false);
  assert.equal(validateApplication({ ...validBody, values: 'nope' }).ok, false);
});

test('truncates overly long text values', () => {
  const result = validateApplication({ ...validBody, values: { ...validBody.values, purpose: 'x'.repeat(2000) } });
  assert.equal(result.value.values.purpose.length, 500);
});
