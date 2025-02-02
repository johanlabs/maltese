const replaceSensitive = require('../src/replace');

describe('replaceSensitive', () => {
    test('should replace sensitive information correctly', () => {
        const originalText = 'My name is John Doe';
        const originalData = { names: ['John Doe'] };
        const newData = { names: ['[REDACTED]'] };
        const expectedOutput = 'My name is [REDACTED]';
        expect(replaceSensitive(originalText, originalData, newData)).toEqual(expectedOutput);
    });
});
