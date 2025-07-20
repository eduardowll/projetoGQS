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

## 🎯 Como Usar

### Página Principal
- Acesse `http://localhost:3000` para ver a página inicial
- Visualize listas de clientes e reservas cadastrados
- Use os botões de navegação para acessar os formulários

### Cadastro de Cliente
- Acesse `/clientes/novo` ou clique em "Cadastrar Cliente"
- Preencha os campos obrigatórios: Nome, Email, Telefone
- O campo Endereço é opcional
- O telefone é formatado automaticamente

### Cadastro de Reserva
- Acesse `/reservas/novo` ou clique em "Nova Reserva"
- Selecione um cliente da lista
- Defina data (mínimo: amanhã), hora e número de pessoas
- Adicione observações se necessário
- Escolha o status da reserva

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

## 📡 API Endpoints

### Clientes

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/clientes` | Criar novo cliente |
| GET | `/api/clientes` | Listar todos os clientes |
| GET | `/api/clientes/:id` | Buscar cliente por ID |
| PUT | `/api/clientes/:id` | Atualizar cliente |
| DELETE | `/api/clientes/:id` | Deletar cliente |

### Reservas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/reservas` | Criar nova reserva |
| GET | `/api/reservas` | Listar todas as reservas |
| GET | `/api/reservas/:id` | Buscar reserva por ID |
| PUT | `/api/reservas/:id` | Atualizar reserva |
| DELETE | `/api/reservas/:id` | Deletar reserva |

## 📊 Exemplos de Uso da API

### Criar Cliente
```bash
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "(11) 99999-9999",
    "endereco": "Rua A, 123"
  }'
```

### Criar Reserva
```bash
curl -X POST http://localhost:3000/api/reservas \
  -H "Content-Type: application/json" \
  -d '{
    "cliente_id": 1,
    "data_reserva": "2025-12-25",
    "hora_reserva": "19:30",
    "numero_pessoas": 4,
    "observacoes": "Mesa próxima à janela",
    "status": "ativa"
  }'
```

## 🎨 Características da Interface

- **Design Responsivo**: Funciona em desktop e mobile
- **Gradientes Modernos**: Interface visualmente atrativa
- **Feedback Visual**: Loading states e mensagens de erro/sucesso
- **Validação em Tempo Real**: Formatação automática de telefone
- **Navegação Intuitiva**: Botões claros e bem posicionados

## ✅ Validações Implementadas

### Cliente
- Nome, email e telefone são obrigatórios
- Validação de formato de email
- Email único no sistema
- Formatação automática de telefone

### Reserva
- Cliente, data, hora e número de pessoas são obrigatórios
- Data não pode ser no passado
- Formato de data: YYYY-MM-DD
- Formato de hora: HH:MM
- Número de pessoas entre 1 e 20
- Cliente deve existir no sistema

## 🔒 Tratamento de Erros

- Validação de dados de entrada
- Mensagens de erro específicas
- Códigos de status HTTP apropriados
- Tratamento de casos edge
- Logs de erro no servidor

## 🚀 Scripts Disponíveis

```bash
npm start          # Inicia o servidor em produção
npm run dev        # Inicia o servidor em modo desenvolvimento
npm test           # Executa testes unitários e de integração
npm run test:watch # Executa testes em modo watch
npm run test:coverage # Executa testes com relatório de cobertura
npm run cypress:open # Abre interface do Cypress
npm run cypress:run  # Executa testes E2E em modo headless
```

## 📝 Banco de Dados

O sistema utiliza SQLite com as seguintes tabelas:

### Tabela `clientes`
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `nome` (TEXT NOT NULL)
- `email` (TEXT UNIQUE NOT NULL)
- `telefone` (TEXT NOT NULL)
- `endereco` (TEXT)
- `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

### Tabela `reservas`
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `cliente_id` (INTEGER NOT NULL, FOREIGN KEY)
- `data_reserva` (DATE NOT NULL)
- `hora_reserva` (TIME NOT NULL)
- `numero_pessoas` (INTEGER NOT NULL)
- `observacoes` (TEXT)
- `status` (TEXT DEFAULT 'ativa')
- `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

## 🤝 Contribuição

Este é um projeto acadêmico desenvolvido para a disciplina de Gestão da Qualidade de Software. 

## 📄 Licença

Este projeto está sob a licença ISC.

## 👨‍💻 Autor

Desenvolvido como projeto final da disciplina TAD0203 - Gestão da Qualidade de Software.

---

**Data de Entrega**: 20/07/2025  
**Tema Escolhido**: 5. Sistema de Reservas e Clientes

