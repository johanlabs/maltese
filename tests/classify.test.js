const classifySensitive = require('../src/classify');

describe('classifySensitive', () => {
    test('should classify names correctly', () => {
        const input = 'My name is John Doe';
        const expected = { names: ['John Doe'] };
        expect(classifySensitive(input).names).toEqual(expected.names);
    });

    test('should classify emails correctly', () => {
        const input = 'Contact me at john.doe@example.com';
        const expected = { emails: ['john.doe@example.com'] };

        expect(classifySensitive(input).personalData?.emails).toEqual(expected.emails);
    });

    test('should classify multiple types of data', () => {
        const input = `Name: Jane Smith\ jane.smith@example.com\nPhone: +5511999999999`;
        const expected = { names: ['Jane Smith'], emails: ['jane.smith@example.com'] };

        const result = classifySensitive(input);

        expect(result.names).toEqual(expected.names);
        expect(result.personalData?.emails).toEqual(expected.emails);
    });
});


