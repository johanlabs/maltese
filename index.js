#!/usr/bin/env node
const { exec } = require('child_process');
const axios = require('axios');
const readline = require('readline');
const Spinnies = require('spinnies'); // Biblioteca para spinners
const classifySensitive = require("./src/classify");
const replaceSensitive = require('./src/replace');
const randomizeSensitive = require('./src/transform');
const obfuscate = require('./src/obfuscate');
const { Command } = require('commander');
const { log } = console;
const ollamaApiUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434';

// Inicializa o gerenciador de spinners
const spinnies = new Spinnies();

// Função para gerar texto com estilo de chat Matrix
async function generateText({ model, prompt, stream = true }) {
  if (!prompt) {
    console.error('The property {prompt} is required.');
    return;
  }
  if (!model) {
    console.error('The property {model} is required.');
    return;
  }

  const {
    obfuscated: textObfuscated,
    ref: {
      detected: sensitiveDataObject,
      randomized: replacedDataObject
    }
  } = obfuscate(prompt, true);

  // Exibe o prompt do usuário no estilo Matrix
  process.stdout.write(`\x1b[32m[user]\x1b[0m ${textObfuscated}\n`);

  try {
    const requestBody = {
      model,
      prompt: textObfuscated,
      stream,
    };

    let lastOutput = '';

    const ollamaResponse = await axios.post(
      `${ollamaApiUrl}/api/generate`,
      requestBody,
      {
        responseType: 'stream', // Habilita a resposta em stream
      }
    );

    let outputBuffer = ''; // Armazena a resposta progressiva

    // Processando o stream conforme os dados chegam
    ollamaResponse.data.on('data', (chunk) => {
      // Adiciona um spinner ao spinnies
      spinnies.add('loading', {
        text: `\x1b[36m[${model}]\x1b[0m`,
        spinnerColor: "black"
      });

      const chunkStr = chunk.toString();
      let responsePart;
      try {
        responsePart = JSON.parse(chunkStr).response;
      } catch (error) {
        console.error(`Error parsing chunk: ${error.message}`);
        return;
      }
      outputBuffer += responsePart; // Concatena a nova parte da resposta

      // Exibe o texto progressivo no estilo Matrix
      const output = replaceSensitive(outputBuffer, replacedDataObject, sensitiveDataObject);

      // Só imprime se a saída for diferente da última impressa
      if (output !== lastOutput) {
        lastOutput = output; // Atualiza a última saída
        const truncatedOutput = lastOutput; // Limita o tamanho do texto
        spinnies.add('loading', {
          text: `\x1b[36m[${model}]\x1b[0m ${truncatedOutput}`,
          spinnerColor: "black"
        });
      }
    });

    // Quando o stream terminar, exibe a mensagem final
    ollamaResponse.data.on('end', () => {
      spinnies.update('loading', {
        text: `\x1b[36m[${model}]\x1b[0m ${lastOutput} \n`,
        spinnerColor: "black"
      });

      spinnies.stopAll();
      askPrompt(model, stream); // Pergunta se o usuário deseja continuar
    });

    // Trata erros no stream
    ollamaResponse.data.on('error', (error) => {
      spinnies.update('loading', {
        text: `\x1b[36m[${model}]\x1b[0m ${error.message}`,
        spinnerColor: "black"
      });
    });
  } catch (error) {
    spinnies.update('loading', {
      text: `\x1b[36m[${model}]\x1b[0m ${error.message}`,
      spinnerColor: "black"
    });
  } finally {
    spinnies.stopAll();
  }
}

async function checkModelExists(model) {
  return new Promise((resolve, reject) => {
    exec('ollama list', (error, stdout, stderr) => {
      if (error || stderr) {
        console.error(`Error executing ollama list: ${error || stderr}`);
        return reject(error || stderr);
      }
      // Verifica se o modelo está na saída do comando
      if (stdout.includes(model)) {
        process.stdout.write(`\x1b[32mModel "${model}" found.\x1b[0m\n`);
        resolve(true);
      } else {
        process.stdout.write(`\x1b[31mModel "${model}" not found.\x1b[0m\n`);
        resolve(false);
      }
    });
  });
}

// Função para perguntar ao usuário se deseja continuar com outro prompt
async function askPrompt(model, stream) {
  const newPrompt = await new Promise((resolve) => {
    const rlPrompt = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rlPrompt.question('> ', (input) => {
      rlPrompt.close();
      resolve(input);
      process.stdout.write('\n'); // Pula linha após a resposta
    });
  });
  if (newPrompt.trim() === '') {
    process.exit(0);
  }
  await generateText({ model, prompt: newPrompt, stream });
}

// Função para obfuscar texto
async function obfuscateText({ text }) {
  if (!text) {
    console.error('The property {text} is required.');
    return;
  }
  const { obfuscated } = obfuscate(text);
  process.stdout.write("Obfuscated Text:\n");
  process.stdout.write(`${obfuscated}\n`);
}

// CLI Definitions
const program = new Command();
program
  .command('run')
  .description('Generate text with obfuscation using Ollama API')
  .argument('<model>', 'Model to use')
  .argument('[prompt]', 'Text prompt for the model (optional)')
  .option('-s, --stream', 'Stream response')
  .action(async (model, prompt, options) => {
    const modelExists = await checkModelExists(model);
    if (!modelExists) {
      return;
    }
    if (prompt) {
      await generateText({ model, prompt, stream: options.stream });
    } else {
      log();
      await askPrompt(model, options.stream);
    }
  });

program
  .command('obfuscate')
  .description('Obfuscate a given text')
  .argument('<text>', 'Text to obfuscate')
  .action(async (text) => {
    await obfuscateText({ text });
  });

program.parse(process.argv);

module.exports = {
  obfuscate
};