# 📊 AI Measure Register 

Bem-vindo ao projeto **AI Measure Register**! Este é um serviço desenvolvido com NestJS para leitura de medidores (potencialmente de água, energia, etc.), facilitando o monitoramento e a gestão de consumo.

## 📦 Estrutura do Projeto

```plaintext
ai-meter-reader/
├── src/                   # Código-fonte principal
│   ├── app.module.ts      # Módulo principal da aplicação
│   ├── app.controller.ts  # Controlador principal
│   ├── app.service.ts     # Serviço principal
│   └── measurer-photo/           # Módulo para leitura dos medidores
│       ├── measurer-photo.module.ts
│       ├── measurer-photo.controller.ts
│       ├── measurer-photo.service.ts
│       └── dto/           # Data Transfer Objects para as leituras
│       └── entities/      # Entidades relacionadas à leitura
├── test/                  # Testes end-to-end
├── Dockerfile             # Dockerfile para construir a imagem Docker
├── docker-compose.yml     # Arquivo para orquestração de containers Docker
└── README.md              # Documentação do projeto
```

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js**: Certifique-se de ter o [Node.js](https://nodejs.org/) instalado na versão 14 ou superior.
- **Docker**: Para rodar a aplicação em um container Docker, você precisará do [Docker](https://www.docker.com/).

### Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/biamesquitap/ai-measure-register-api.git
   cd ia-measure-register-api
   ```

2. **Instale as dependências:**

   Com Yarn:

   ```bash
   yarn install
   ```

   Ou com npm:

   ```bash
   npm install
   ```

3. **Configuração:**

   Crie um arquivo `.env` na raiz do projeto e adicione suas variáveis de ambiente:

   ```plaintext
   DATABASE_URL=postgres://user:password@localhost:5432/database
   PORT=3000
   ```

### Executando a Aplicação

- **Modo Desenvolvimento:**

  ```bash
  yarn start:dev
  ```

  Ou com npm:

  ```bash
  npm run start:dev
  ```

  A aplicação estará rodando em `http://localhost:3000`.

### 🚀 Deploy com Docker Compose

Para facilitar o processo de deploy da aplicação, você pode utilizar o Docker Compose. Esse processo orquestra a criação dos containers necessários para rodar o serviço **AI Measure Register** e seus componentes dependentes.

#### Passos para Deploy

1. **Certifique-se de que o Docker e o Docker Compose estão instalados em seu ambiente.**

   - Você pode verificar se o Docker está instalado executando:

     ```bash
     docker --version
     ```

   - E para o Docker Compose:

     ```bash
     docker-compose --version
     ```

2. **Deploy da Aplicação:**

   - Para construir e iniciar a aplicação juntamente com os serviços necessários, execute o comando abaixo na raiz do projeto:

   - E para iniciar em Linux e Mac:
     ```bash
     GEMINI_API_KEY=seu_valor_da_api_key docker-compose up -d
     ```

   - E para iniciar em Windows:
     ```bash
     $env:GEMINI_API_KEY="seu_valor_da_api_key" 
     docker-compose up -d
     ```


## 🧪 Testes

Rodar os testes end-to-end:

```bash
yarn test:e2e
```

Ou com npm:

```bash
npm run test:e2e
```

### Testes Unitários

Para rodar os testes unitários:

```bash
yarn test

```bash
npm run test

## 📘 Endpoints

Aqui estão alguns dos principais endpoints da API:

- **GET `/measurer-photo`**: Obtém todas as leituras.
- **POST `/measurer-photo`**: Cria uma nova leitura.
- **PUT `/measurer-photo/:id/confirm`**: Confirma a leitura com o ID especificado.

## 🛠️ Tecnologias Utilizadas

- **NestJS**: Framework para construção de aplicações escaláveis em Node.js.
- **TypeScript**: Superset de JavaScript que adiciona tipos estáticos.
- **Docker**: Para containerização da aplicação.
- **PostgreSQL**: Banco de dados relacional.

## 🎯 Próximos Passos

- **Melhorar cobertura de testes**
- **Implementar autenticação e autorização**
- **Adicionar suporte para múltiplos tipos de medidores**

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir um _pull request_ ou _issue_.
