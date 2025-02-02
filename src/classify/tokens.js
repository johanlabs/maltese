
const uuid = require('uuid');

function classifyTokens(text) {
    if (typeof text !== 'string') {
        throw new Error('Param {text} must be a String.');
    }

    const tokenMap = {};
    const tokenizedText = text.replace(/{([^}]+)}/g, (match, p1) => {
        const token = uuid.v4();
        tokenMap[token] = p1;
        return `{{${token}}}`;
    });

    const result = {
        tokenizedText,
        tokenMap
    };

    return result;
}

function restoreOriginalTokens(tokenizedText, tokenMap) {
    return tokenizedText.replace(/{{([^}]+)}}/g, (match, p1) => {
        return `{${tokenMap[p1] || p1}}`;
    });
}

module.exports = {
    classifyTokens,
    restoreOriginalTokens
}