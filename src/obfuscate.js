const classifySensitive = require("./classify");
const replaceSensitive = require("./replace");
const randomizeSensitive = require("./transform");

function obfuscate(text, options = {}) {
    const {
        mode = 'pseudo', // 'pseudo' | 'anon'
        ref = false
    } = options;

    const detected = classifySensitive(text);
    const transformed = randomizeSensitive(detected, mode);

    const obfuscatedText = replaceSensitive(text, detected, transformed);

    const output = {
        original: text,
        obfuscated: obfuscatedText.replaceAll(/\{{|\}}/g, '')
    };

    if (ref) {
        output.ref = {
            detected,
            transformed
        };
    }

    return output;
}

module.exports = obfuscate;