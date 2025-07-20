describe('Cadastro de Cliente E2E', () => {
  beforeEach(() => {
    cy.visit('/clientes/novo');
  });

  it('deve exibir o formulário de cadastro de cliente', () => {
    cy.contains('h1', 'Cadastrar Cliente').should('be.visible');
    cy.get('#nome').should('be.visible');
    cy.get('#email').should('be.visible');
    cy.get('#telefone').should('be.visible');
    cy.get('#endereco').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Cadastrar Cliente');
  });

  it('deve cadastrar um cliente com dados válidos', () => {
    const cliente = {
      nome: 'João Silva Teste',
      email: `joao.teste.${Date.now()}@email.com`,
      telefone: '(11) 99999-9999',
      endereco: 'Rua Teste, 123'
    };

    cy.get('#nome').type(cliente.nome);
    cy.get('#email').type(cliente.email);
    cy.get('#telefone').type(cliente.telefone);
    cy.get('#endereco').type(cliente.endereco);

    cy.get('button[type="submit"]').click();

    cy.get('.alert-success')
      .should('be.visible')
      .and('contain', 'Cliente cadastrado com sucesso!');

    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('deve exibir erro para campos obrigatórios vazios', () => {
    cy.get('button[type="submit"]').click();

    cy.get('.alert-error')
      .should('be.visible')
      .and('contain', 'Por favor, preencha todos os campos obrigatórios.');
  });

  it('deve exibir erro para email inválido', () => {
    cy.get('#nome').type('João Silva');
    cy.get('#email').type('email-invalido');
    cy.get('#telefone').type('(11) 99999-9999');

    cy.get('button[type="submit"]').click();

    cy.get('.alert-error')
      .should('be.visible');
  });

  it('deve formatar o telefone automaticamente', () => {
    cy.get('#telefone').type('11999999999');
    cy.get('#telefone').should('have.value', '(11) 99999-9999');
  });

  it('deve navegar de volta para a página inicial', () => {
    cy.contains('a', 'Voltar').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('deve exibir loading durante o envio', () => {
    const cliente = {
      nome: 'Teste Loading',
      email: `loading.${Date.now()}@email.com`,
      telefone: '(11) 88888-8888'
    };

    cy.get('#nome').type(cliente.nome);
    cy.get('#email').type(cliente.email);
    cy.get('#telefone').type(cliente.telefone);

    cy.get('button[type="submit"]').click();

    cy.get('#submit-loading').should('be.visible');
    cy.get('#submit-text').should('not.be.visible');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('deve limpar o formulário após cadastro bem-sucedido', () => {
    const cliente = {
      nome: 'Teste Limpar',
      email: `limpar.${Date.now()}@email.com`,
      telefone: '(11) 77777-7777'
    };

    cy.get('#nome').type(cliente.nome);
    cy.get('#email').type(cliente.email);
    cy.get('#telefone').type(cliente.telefone);

    cy.get('button[type="submit"]').click();

    cy.get('.alert-success').should('be.visible');

    cy.get('#nome').should('have.value', '');
    cy.get('#email').should('have.value', '');
    cy.get('#telefone').should('have.value', '');
    cy.get('#endereco').should('have.value', '');
  });
});

