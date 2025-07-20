# Sistema de Reservas e Clientes

Sistema web desenvolvido em JavaScript com arquitetura MVC para gerenciamento de reservas e clientes. Projeto desenvolvido como trabalho final da disciplina de Gestão da Qualidade de Software.

## 📋 Sobre o Projeto

Este sistema permite:
- Cadastro e gerenciamento de clientes
- Criação e controle de reservas
- Interface web responsiva e moderna
- API RESTful completa
- Persistência de dados com SQLite
- Testes unitários, de integração e E2E

## 🔧 Instalação e Configuração

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes)

### Passos para instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd sistema-reservas-clientes
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor**
   ```bash
   npm start
   ```

4. **Acesse a aplicação**
   ```
   http://localhost:3000
   ```
## 🧪 Executando os Testes

### Testes Unitários e de Integração (Jest)

```bash
# Executar todos os testes
npm test

# Executar testes com coverage
npm run test:coverage

# Executar testes em modo watch
npm run test:watch
```

### Testes E2E (Cypress)

```bash
# Abrir interface do Cypress
npm run cypress:open

# Executar testes em modo headless
npm run cypress:run
```

**Importante**: Para os testes E2E, certifique-se de que o servidor esteja rodando em `http://localhost:3000`.
