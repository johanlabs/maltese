const obfuscate = require('../src/obfuscate');
const classifySensitive = require('../src/classify');

describe('obfuscate', () => {
    test('should obfuscate sensitive data', () => {
        const input = 'My name is John Doe and my email is john.doe@example.com';
        const expectedOutput = ['John Doe', 'john.doe@example.com']; 
        
        const result = obfuscate(input);
        expect(result).not.toEqual(expectedOutput);
    });
});
