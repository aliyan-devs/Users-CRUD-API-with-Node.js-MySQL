const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_FIELDS = new Set(['name', 'email', 'age']);

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}

function validateUser(body, { partial = false } = {}) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new ValidationError('Request body must be a JSON object.');
  }

  const fields = Object.keys(body);
  const unknownFields = fields.filter((field) => !ALLOWED_FIELDS.has(field));
  if (unknownFields.length > 0) {
    throw new ValidationError(`Unknown field(s): ${unknownFields.join(', ')}.`);
  }

  if (partial && fields.length === 0) {
    throw new ValidationError('Provide at least one field to update.');
  }

  if (!partial && (!Object.hasOwn(body, 'name') || !Object.hasOwn(body, 'email'))) {
    throw new ValidationError('Name and email are required.');
  }

  const user = {};
  if (Object.hasOwn(body, 'name')) {
    if (typeof body.name !== 'string' || body.name.trim().length === 0 || body.name.trim().length > 100) {
      throw new ValidationError('Name must be a non-empty string of at most 100 characters.');
    }
    user.name = body.name.trim();
  }

  if (Object.hasOwn(body, 'email')) {
    if (
      typeof body.email !== 'string' ||
      body.email.trim().length > 254 ||
      !EMAIL_PATTERN.test(body.email.trim())
    ) {
      throw new ValidationError('Email must be a valid email address of at most 254 characters.');
    }
    user.email = body.email.trim().toLowerCase();
  }

  if (Object.hasOwn(body, 'age')) {
    if (body.age !== null && (!Number.isInteger(body.age) || body.age < 0 || body.age > 150)) {
      throw new ValidationError('Age must be an integer from 0 to 150, or null.');
    }
    user.age = body.age;
  }

  return user;
}

function validateId(value) {
  if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value))) {
    throw new ValidationError('User ID must be a positive integer.');
  }
  return Number(value);
}

module.exports = { ValidationError, validateId, validateUser };
