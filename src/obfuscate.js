const classifySensitive = require("./classify");
const replaceSensitive = require("./replace");
const randomizeSensitive = require("./transform");

function obfuscate(text, ref = false) {
    const detected = classifySensitive(text);
    const randomized = randomizeSensitive(detected);

    const obfuscatedText = replaceSensitive(text, detected, randomized);

    const output = {
        original: text,
        obfuscated: obfuscatedText.replaceAll(/\{{|\}}/g, '')
    };

    if (ref) output.ref = {
        detected,
        randomized
    };

    return output;
}

module.exports = obfuscate;