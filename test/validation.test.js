const test = require('node:test');
const assert = require('node:assert/strict');
const { ValidationError, validateId, validateUser } = require('../src/validation');

test('validates and normalizes user data', () => {
  assert.deepEqual(
    validateUser({ name: '  Ada Lovelace ', email: ' ADA@EXAMPLE.COM ', age: 36 }),
    { name: 'Ada Lovelace', email: 'ada@example.com', age: 36 }
  );
});

test('allows age to be omitted or cleared with null', () => {
  assert.deepEqual(validateUser({ name: 'Ada', email: 'ada@example.com' }), {
    name: 'Ada',
    email: 'ada@example.com'
  });
  assert.deepEqual(validateUser({ age: null }, { partial: true }), { age: null });
});

test('rejects missing required fields and invalid email or age', () => {
  assert.throws(() => validateUser({ name: 'Ada' }), ValidationError);
  assert.throws(() => validateUser({ name: 'Ada', email: 'invalid' }), ValidationError);
  assert.throws(() => validateUser({ name: 'Ada', email: 'ada@example.com', age: 151 }), ValidationError);
});

test('rejects unknown fields and empty updates', () => {
  assert.throws(
    () => validateUser({ name: 'Ada', email: 'ada@example.com', admin: true }),
    /Unknown field/
  );
  assert.throws(() => validateUser({}, { partial: true }), /at least one field/);
});

test('accepts positive integer user IDs only', () => {
  assert.equal(validateId('42'), 42);
  for (const id of ['0', '-1', '1.5', 'abc', '9007199254740992']) {
    assert.throws(() => validateId(id), ValidationError);
  }
});
