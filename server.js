const express = require('express');
const axios = require('axios');
const classifySensitive = require("./src/classify");
const replaceSensitive = require('./src/replace');
const randomizeSensitive = require('./src/transform');
const obfuscate = require('./src/obfuscate');

const app = express();
const port = process.env.PORT || 11435;
const ollamaApiUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434';

app.use(express.json());

app.post('/api/generate', async (req, res) => {
    const { model, prompt, stream, ...rest } = req.body;

    if (!prompt) res
        .status(400)
        .json({
            error: 'The property {prompt} is required in body request.'
        });

    if (!model) res
        .status(400)
        .json({
            error: 'The property {model} is required in body request.'
        });

    const sensitiveDataObject = classifySensitive(prompt);
    const replacedDataObject = randomizeSensitive(sensitiveDataObject);

    const textObfuscated = replaceSensitive(prompt, sensitiveDataObject, replacedDataObject);

    try {
        const requestBody = {
            model,
            prompt: textObfuscated,
            stream: stream ? true : false,
            ...rest
        };

        console.log("Obfuscated Body:");
        console.log(JSON.stringify(requestBody, null, 2));

        const ollamaResponse = await axios.post(`${ollamaApiUrl}/api/generate`, requestBody);

        const output = replaceSensitive(ollamaResponse.data?.response, replacedDataObject, sensitiveDataObject);

        if (ollamaResponse.data?.response) ollamaResponse.output = output;

        res.json({
            ...ollamaResponse,
            output
        });
    } catch (error) {
        console.error(error);

        if (axios.isAxiosError(error)) {
            res.status(error.response ? error.response.status : 500).json({ error: "Ollama API Error", message: error.response.data?.error });
        } else {
            res.status(500).json({ error: "An unknown error occurred." });
        }
    }
});

app.post('/api/obfuscate', async (req, res) => {
    const { text } = req.body;

    if (!text) res
        .status(400)
        .json({
            error: 'The property {text} is required in body request.'
        });

    const result = obfuscate(text);

    res.json(result);
});

app.listen(port, () => {
    console.log(`Running in http://localhost:${port}`);
});