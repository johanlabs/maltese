const { obfuscate } = require("../src");
const replaceSensitive = require("../src/replace");

let _deteceted, _randomized, _name;

function replaceBefore(args) {
    /**
     * @register_hook beforeMessage
     */

    const {
        obfuscated,
        detected,
        randomized
    } = obfuscate(args.message);

    args.message = obfuscated;
    _deteceted = detected;
    _randomized = randomized;
    _name = _randomized.names[0];

    return args;
}

function replaceAfter(args) {
    /**
     * @register_hook afterMessage
     */

    return {
        ...args,
        message: replaceSensitive(
            args.message,
            _randomized,
            _deteceted
        )
    }
}

module.exports = {
    replaceBefore,
    replaceAfter
};
