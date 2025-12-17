## Maltese - Sensitive Data Obfuscator

Maltese is an innovative tool designed to protect personal and sensitive information (SPD) from being inferred by Artificial Intelligence (AI) models. By obfuscating sensitive data, Maltese ensures the privacy of crucial information, preventing it from being misused by AI models or leaked unintentionally.

---

### Features

#### Ollama Compatibility

Maltese operates locally as a companion to Ollama, running on port **11435**. Its compatibility with Ollama’s default port (**11434**) ensures a smooth transition for users who wish to add a **Privacy Layer** to their personal or enterprise AI projects.

```bash
maltese run smollm2:360 "Hello, my name is Lucas"
```

Would be equivalent to:

```bash
ollama run smollm2:360 "Hello, my name is [other_name]"
```

> **Note:** You must have Ollama installed for this to work.

---

#### Easy to Implement

Even if your goal is not to interact with an AI model—or not through Ollama—you can still use Maltese’s various methods to obfuscate sensitive data from any string.

##### via API

If you want a local server to handle Maltese requests, simply run:

```bash
maltese server
```

You’ll then be able to obfuscate any sensitive data through an endpoint:

```bash
curl -X POST -H "Content-Type: application/json" -d '{ "text": "your text with sensitive personal data here" }' localhost:11435/api/maltese-obfuscate
```

Or interact with Ollama through Maltese:

```bash
curl -X POST -H "Content-Type: application/json" -d '{ "model": "your-model", "text": "your text with sensitive personal data here", "stream": false }' localhost:11435/api/generate
```

This would return something like:

> "Hi, my name is [other_name]"

If you only want to obfuscate data via CLI, try:

```bash
maltese obfuscate "your text with sensitive personal data here"
```

For more details:

* **via API:** With the server running, visit `https://localhost:11435/docs`
* **via Command:** Try `maltese --help`

---

##### via Code

If you are using JavaScript:

```js
const { obfuscate } = require('johanlabs-maltese');

obfuscate("Yesterday I went to Los Angeles"); // "Yesterday I went to Baghdad"
```

---

##### via Johan.Chat

When you install this plugin on your agent, it automatically performs the substitution before inference.

> No configuration is required.

---

##### via Extension

*The goal of Maltese is to intercept and modify sensitive data in real time during interactions with AI systems, manipulating the request to protect privacy.*

*The Maltese browser extension is currently under development.*

---

##### Ignoring SPDs (Sensitive Personal Data)

Before obfuscating sensitive data from a string, Maltese tokenizes parts of the text that should be ignored. You can follow this pattern:

```
maltese run deepkseek-r1:1.5b "Hello, my name is {{Lucas Santana}}."
```

In this case, the original value `Lucas Santana` will remain unchanged.

> This works via API, Code, and Extension modes.

---

### Simple Architecture

Maltese’s architecture consists of three main components:

* **SPD Classification:** Identifies sensitive patterns in text.
* **SPD Generator:** Creates false but realistic data to replace the sensitive information.
* **Obfuscate:** Substitutes the original tokens with the generated data, ensuring prompt privacy.

> SPD stands for **Sensitive Personal Data**.

---

### Important Notes

1. Be aware that data obfuscation can affect the interpretation of some information. For example, when asking about the meaning of a specific name, the response might change due to obfuscation.
2. There are cases where Maltese’s obfuscation technology may not produce ideal results. In such cases, try adjusting or rephrasing your prompts for better performance.

---

### Next Steps

* **Continuous Evolution:**

  * **Patterns:** One key goal is to continuously improve the detection of sensitive data and the generation of refined synthetic data. That’s why Maltese is **fully open-source**.

* **Obfuscation Configuration:**

  * **Ignore:** Implement the ability to ignore specific data types during obfuscation for more targeted prompts.
  * **Mapping:** Add the option to map certain data types to predefined formats programmatically.

* **Obfuscation Levels:**

  * **Simple:** Replace names with variants (e.g., João → John, Johan, or Yohan).
  * **Medium:** Replace names with random ones (e.g., João → Pedro).
  * **Advanced:** Completely alter scenarios and entities while maintaining context.
  * **Raw:** Replace information with generic placeholders (e.g., [Name1] [Name2]).

* **Proxy:**

  * **Extension:** Democratize proxy usage so that, in addition to obfuscating data, every API request to models (like OpenAI or DeepSeek) is routed through a different IP address—ensuring even greater privacy.