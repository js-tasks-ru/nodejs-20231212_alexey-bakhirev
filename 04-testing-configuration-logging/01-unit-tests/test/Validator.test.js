const Validator = require('../Validator');
const expect = require('chai').expect;

function getRuleObject(type, min, max) {
  return {
    type: type,
    min: min,
    max: max,
  };
}

function getString(length) {
  return (new Array(length)).fill('_').join('');
}

function getErrors(message, property) {
  return message
    ? [{ field: property || 'name', error: message }]
    : [];
}

const TESTS = {
  'Make sure that the min check rule for string is working': {
    rule: ['string', 9, 21],
    value: getString(6),
    error: 'too short, expect 9, got 6',
  },
  'Make sure that the min check rule for string is working for boundary condition': {
    rule: ['string', 9, 21],
    value: getString(9),
  },
  'Make sure that the max check rule for string is working': {
    rule: ['string', 9, 21],
    value: getString(22),
    error: 'too long, expect 21, got 22',
  },
  'Make sure that the max check rule for string is working for boundary condition': {
    rule: ['string', 9, 21],
    value: getString(21),
  },
  'Make sure that the type check rule for string is working': {
    rule: ['string', 9, 21],
    value: 15,
    error: 'expect string, got number',
  },
  'Make sure that the type check rule for string is working (boolean)': {
    rule: ['string', 0, 21],
    value: true,
    error: 'expect string, got boolean',
  },
  'Make sure that the type check rule for string is working (object like null)': {
    rule: ['string', 0, 21],
    value: null,
    error: 'expect string, got object',
  },
  'Make sure that the type check rule for string is working (object)': {
    rule: ['string', 9, 21],
    value: { },
    error: 'expect string, got object',
  },
  'Make sure that the type check rule for string is working (array)': {
    rule: ['string', 9, 21],
    value: [],
    error: 'expect string, got object',
  },
  'Make sure that the min check rule for number is working': {
    rule: ['number', 9, 21],
    value: 6,
    error: 'too little, expect 9, got 6',
  },
  'Make sure that the min check rule for number is working for boundary condition': {
    rule: ['number', 9, 21],
    value: 9,
  },
  'Make sure that the max check rule for number is working': {
    rule: ['number', 9, 21],
    value: 22,
    error: 'too big, expect 21, got 22',
  },
  'Make sure that the max check rule for number correct for boundary condition': {
    rule: ['number', 9, 21],
    value: 21,
  },
  'Make sure that the type check rule for number is working': {
    rule: ['number', 9, 21],
    value: getString(15),
    error: 'expect number, got string',
  },
  'Make sure that the max check rule for number is working for NaN value': {
    rule: ['number', 9, 21],
    value: NaN,
    error: 'expect number, got NaN (not a number)',
  },
  'Make sure that the type check rule for number is working (boolean)': {
    rule: ['number', 0, 21],
    value: true,
    error: 'expect number, got boolean',
  },
  'Make sure that the type check rule for number is working (object like null)': {
    rule: ['number', 0, 21],
    value: null,
    error: 'expect number, got object',
  },
  'Make sure that the type check rule for number is working (object)': {
    rule: ['number', 9, 21],
    value: { },
    error: 'expect number, got object',
  },
};

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validation for empty object', () => {
    it('Make sure that the validation have not errors for string', () => {
      const validator = new Validator({});
      const errors = validator.validate({ name: '123' });
      expect(errors).to.deep.equal([]);
    });
    it('Make sure that the validation have not errors for number', () => {
      const validator = new Validator({});
      const errors = validator.validate({ name: 123 });
      expect(errors).to.deep.equal([]);
    });
  });

  describe('Validation for one property in object', () => {
    Object.entries(TESTS).forEach(([message, item]) => {
      it(message, () => {
        const validator = new Validator({
          name: getRuleObject(...item.rule),
        });

        const errors = validator.validate({ name: item.value });
        expect(errors).to.deep.equal(getErrors(item.error));
      });
    });
  });

  describe('Validation for two properties in object', () => {
    Object.entries(TESTS).forEach(([message, item]) => {
      it(message, () => {
        const validator = new Validator({
          name: getRuleObject(...item.rule),
          family: getRuleObject(...item.rule),
        });

        const errors = validator.validate({
          name: item.value,
          family: item.value,
          lastName: item.value,
        });

        const correctErrors = [
          getErrors(item.error),
          getErrors(item.error, 'family'),
        ].flat();

        expect(errors).to.deep.equal(correctErrors);
      });
    });
  });
});
