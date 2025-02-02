const { classifyTokens, restoreOriginalTokens } = require('../../src/classify/tokens'); // Adjust path as needed

describe('Token Classification and Restoration Functions', () => {
    test('classifyTokens should replace words between curly braces with unique tokens', () => {
        const inputText = "My name is {John Doe} and my password is {12345}.";
        const { tokenizedText, tokenMap } = classifyTokens(inputText);

        expect(tokenizedText).toMatch(/{[a-f0-9-]+}/g);

        expect(Object.keys(tokenMap).length).toBeGreaterThan(0); 
    });

    test('restoreOriginalTokens should restore the original text based on the tokens', () => {
        const inputText = "My name is {{John Doe}} and my password is {{12345}}.";
        const { tokenizedText, tokenMap } = classifyTokens(inputText);

        const restoredText = restoreOriginalTokens(tokenizedText, tokenMap);

        expect(restoredText).toBe(inputText);
    });

    test('restoreOriginalTokens should work when the text contains only one token', () => {
        const inputText = "My name is {{John Doe}}.";
        const { tokenizedText, tokenMap } = classifyTokens(inputText);

        const restoredText = restoreOriginalTokens(tokenizedText, tokenMap);

        expect(restoredText).toBe(inputText);
    });

    test('restoreOriginalTokens should return the same text if there are no tokens', () => {
        const inputText = "Text without curly braces.";
        const restoredText = restoreOriginalTokens(inputText, {});

        expect(restoredText).toBe(inputText);
    });

    test('classifyTokens should throw an error if the input is not a string', () => {
        expect(() => {
            classifyTokens(12345);
        }).toThrow('Param {text} must be a String.');
    });
});
