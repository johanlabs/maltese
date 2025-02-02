const classifySensitive = require('../src/classify');
const randomizeSensitive = require('../src/transform');

describe('randomizeSensitive', () => {
    test('should randomize sensitive data correctly', () => {
        const text = 'My name is John Doe and my email is john.doe@example.com';
        
        const classify = classifySensitive(text);

        const randomized = randomizeSensitive(classify);

        expect(randomized.names[0]).not.toBe('John Doe');
        expect(randomized.personalData?.emails[0]).not.toBe('john.doe@example.com');
     });
});
