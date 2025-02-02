const escapeRegExp = (string) => {
    return string?.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&') ?? string;
};

const replaceSensitive = (originalText, originalData, newData) => {
    const replacements = Object.keys(originalData).reduce((acc, key) => {
        if (Array.isArray(originalData[key])) {
            originalData[key].forEach((item, index) => {
                const escapedItem = escapeRegExp(item);
                acc.push({ regex: new RegExp(`\\b${escapedItem}\\b`, 'gi'), newValue: newData[key] && newData[key][index] || item });
            });
        } else if (typeof originalData[key] === 'object') {
            Object.keys(originalData[key]).forEach((subKey) => {
                if (Array.isArray(originalData[key][subKey])) {
                    originalData[key][subKey].forEach((item, index) => {
                        const escapedItem = escapeRegExp(item);
                        acc.push({ regex: new RegExp(`\\b${escapedItem}\\b`, 'gi'), newValue: newData[key] && newData[key][subKey] && newData[key][subKey][index] || item });
                    });
                }
            });
        }
        return acc;
    }, []);

    replacements.forEach(({ regex, newValue }) => {
        originalText = originalText?.replace(regex, newValue);
    });

    return originalText;
};

module.exports = replaceSensitive;