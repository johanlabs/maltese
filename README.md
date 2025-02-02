## Maltese - Ofuscador de Dados Sensíveis

Maltese é uma ferramenta inovadora projetada para proteger informações pessoais e sensíveis (SPD) de inferências por modelos de Inteligência Artificial (IA). Ao ofuscar dados sensíveis, o Maltese garante a privacidade de informações cruciais, impedindo que sejam utilizadas indevidamente por modelos de IA e por vazamentos de dados.

### Funcionalidades

#### Compatibilidade com Ollama

O Maltese opera localmente como um auxiliar do Ollama, residindo na porta 11435. Sua compatibilidade com a porta padrão do Ollama (11434) garante uma transição suave para aqueles que desejam adicionar uma Camada de Privacidade aos seus projetos pessoais ou empresariais.

```bash
maltese run smollm2:360 "Olá, meu nome é Lucas"
```
Seria equivalente a:

```bash
ollama run smollm2:360 "Olá, meu nome é [other_name]"
```

Obs: Para isso é necessário que você tenha o Ollama instalado.

#### Fácil de Implementar

Mesmo que o seu objetivo não seja interagir com uma IA ou até mesmo, que não seja via Ollama, você pode considerar usar as diferentes formas de apenas ofuscar dados sensíveis de uma String.

##### via API

Se você quiser um servidor local para lidar com o Maltese, basta rodar:

```bash
maltese server
```

E então você será capaz de ofuscar qualquer dado sensível via endpoint.

```bash
curl -X POST -H "Content-Type: application/json" -d '{ "text": "your text with sensitive personal data here" }' localhost:11435/api/maltese-obfuscate
```

Ou pode interagir com o Ollama via Maltese:
```bash
curl -X POST -H "Content-Type: application/json" -d '{ "model": "your-model", "text": "your text with sensitive personal data here", "stream": false }' localhost:11435/api/generate
```

Irá retornar "Oi, meu nome é [other_name]".

Mas se você quiser apenas ofuscar dados vi CLI, tente:

```bash
maltese obfuscate "your text with sensitive personal data here"
```

Para mais detalhes:
- via API: Com o server ligado acesse: ```https://localhost:11435/docs```.
- via Comando: Tente ```maltese --help```.

##### via Código

Se você estiver usando JavaScript:

```js
const { obfuscate } = require('malte');

obfuscate("Ontem eu fui para Los Angeles"); // "Ontem eu fui para Bagdá"
```

##### via Extensão

*A ideia do Maltese é interceptar e modificar dados sensíveis em tempo real em interações com IAs, manipulando a requisição para proteger a privacidade das informações.*

*A extensão para Maltese ainda está em desenvolvimento.*

##### Ignorando SPDs (Sensive Person Data)

Antes de ofuscar os dados sensíveis de uma String, é feito uma tokenização para dados que devam ser ignorados, tente seguir o Padrão:

```
maltese run deepkseek-r1:1.5b "Olá, meu nome é {{Lucas Santana}}."
```

Nesse caso, o valor origianl de ```Lucas Santana``` irá permanecer.
Obs: Isso irá funcionar via API, via Código e também via Extensão.

#### Arquitetura Simples

A arquitetura do Maltese é composta por três componentes principais:

*   **Classificação de SPD:** Identifica padrões sensíveis em textos.
*   **Gerador de SPD:** Cria dados com padrões falsos para substituir as informações sensíveis.
*   **Obfuscate:** Substitui os tokens originais pelos dados falsos, garantindo a ofuscação do prompt.

Obs: SPD é a sigla para Sensitive Personal Data (Dados Pessoais Sensíveis).

#### Processo de Ofuscação

1.  **Classificação:** Os dados sensíveis são classificados e identificados.
2.  **Geração:** Dados com padrões falsos são gerados para substituir as informações sensíveis.
3.  **Troca:** Os tokens originais são substituídos pelos dados falsos, resultando em um prompt ofuscado.

### Observações Importantes

1.  É crucial estar ciente de que a ofuscação de dados pode afetar a interpretação de certas informações. Por exemplo, ao perguntar o significado de um nome específico, a resposta pode ser afetada pela ofuscação.
2.  Há muitos casos onde a tecnologia do Maltese de ofuscação pode não gerar bons resultados, nesses casos, considere testar diferentes prompts até obter bons resultados.

### Próximos Passos

*   **Evolução Contínua:**
    *   **Padrões:** Um dos objetivos é implementar continuamente melhorias nos padrões de detecção de dados sensíveis e também na geração de dados falsos refinados, é por isso que o Maltese é completamente Open Source.

*   **Configuração de Ofuscação:**
    *   **Ignorar:** Implementar a função de ignorar tipos específicos de dados ao Ofuscar, para prompts mais específicos.
    *   **Mapa:** Implementar a opção de mapear alguns tipos de dados para padrões pré-definidos programaticamente.

*   **Níveis de Ofuscação:**
    *   **Simples:** Substituição de nomes por variantes (ex: João por John, Johan ou Yohan).
    *   **Médio:** Substituição de nomes por nomes aleatórios (ex: João por Pedro).
    *   **Avançado:** Alteração completa de cenários e personagens, mantendo o contexto.
    *   **Bruta:** Substituição de informações por marcadores genéricos (ex: \[Nome1] \[Nome2]).

*   **Proxy:**
    *   **Extensão:** Democratização do uso de Proxy, garantindo que além de dados ofuscados, cada requisição a modelos via API, como OpenAI e DeepSeek tenha um diferente endereço de IP, garantindo ainda maior privacidade.

### Plano para Implementações

A longo prazo, o objetivo é treinar um modelo de IA próprio para identificar padrões sensíveis e gerar ofuscação automaticamente, seguindo as regras definidas. Para alcançar esse objetivo, busca-se arrecadar fundos através do Cloudfloding, visando gastos com infraestrutura a fim de oferecer a privacidade de forma gratuita.

#### Johan Labs

Johan Labs é uma iniciativa livre focada em democratização de IAs através da otimização dos usos dos modelos. O objetivo é baratear ao máximo os custos relacionados ao uso de IA para diferentes tipos de contexto.

Maltese é o Passo 0 do [johanlabs/whitepaper](https://github.com/johanlabs/whitepaper) da iniciativa Johan Labs.

Junte-se a nós nesta jornada para proteger a privacidade na era da IA!
