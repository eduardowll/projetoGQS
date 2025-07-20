describe('Cadastro de Reserva E2E', () => {
  let clienteId;

  before(() => {
    cy.request('POST', '/api/clientes', {
      nome: 'Cliente Cypress',
      email: `cypress.${Date.now()}@email.com`,
      telefone: '(11) 99999-9999'
    }).then((response) => {
      clienteId = response.body.data.id;
    });
  });

  beforeEach(() => {
    cy.visit('/reservas/novo');
  });

  it('deve exibir o formulário de cadastro de reserva', () => {
    cy.contains('h1', 'Nova Reserva').should('be.visible');
    cy.get('#cliente_id').should('be.visible');
    cy.get('#data_reserva').should('be.visible');
    cy.get('#hora_reserva').should('be.visible');
    cy.get('#numero_pessoas').should('be.visible');
    cy.get('#observacoes').should('be.visible');
    cy.get('#status').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Criar Reserva');
  });

  it('deve carregar a lista de clientes no select', () => {
    cy.get('#cliente_id').should('contain', 'Selecione um cliente');
    cy.get('#cliente_id option').should('have.length.greaterThan', 1);
    cy.get('#cliente_id').should('contain', 'Cliente Cypress');
  });

  it('deve definir data mínima como amanhã', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    cy.get('#data_reserva').should('have.attr', 'min', tomorrowStr);
    cy.get('#data_reserva').should('have.value', tomorrowStr);
  });

  it('deve criar uma reserva com dados válidos', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    cy.get('#cliente_id').select('Cliente Cypress');
    cy.get('#data_reserva').clear().type(tomorrowStr);
    cy.get('#hora_reserva').type('19:30');
    cy.get('#numero_pessoas').type('4');
    cy.get('#observacoes').type('Mesa próxima à janela');
    cy.get('#status').select('ativa');

    cy.get('button[type="submit"]').click();

    cy.get('.alert-success')
      .should('be.visible')
      .and('contain', 'Reserva criada com sucesso!');

    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('deve exibir erro para campos obrigatórios vazios', () => {
    cy.get('button[type="submit"]').click();

    cy.get('.alert-error')
      .should('be.visible')
      .and('contain', 'Por favor, preencha todos os campos obrigatórios.');
  });

  it('deve validar número mínimo e máximo de pessoas', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    cy.get('#cliente_id').select('Cliente Cypress');
    cy.get('#data_reserva').clear().type(tomorrowStr);
    cy.get('#hora_reserva').type('19:30');
    cy.get('#numero_pessoas').type('0');

    cy.get('button[type="submit"]').click();

    cy.get('.alert-error')
      .should('be.visible')
      .and('contain', 'O número de pessoas deve estar entre 1 e 20.');
  });

  it('deve navegar de volta para a página inicial', () => {
    cy.contains('a', 'Voltar').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('deve exibir loading durante o envio', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    cy.get('#cliente_id').select('Cliente Cypress');
    cy.get('#data_reserva').clear().type(tomorrowStr);
    cy.get('#hora_reserva').type('20:00');
    cy.get('#numero_pessoas').type('2');

    cy.get('button[type="submit"]').click();

    cy.get('#submit-loading').should('be.visible');
    cy.get('#submit-text').should('not.be.visible');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('deve limpar o formulário após cadastro bem-sucedido', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    cy.get('#cliente_id').select('Cliente Cypress');
    cy.get('#data_reserva').clear().type(tomorrowStr);
    cy.get('#hora_reserva').type('18:00');
    cy.get('#numero_pessoas').type('3');
    cy.get('#observacoes').type('Teste observação');

    cy.get('button[type="submit"]').click();

    cy.get('.alert-success').should('be.visible');

    cy.get('#cliente_id').should('have.value', '');
    cy.get('#hora_reserva').should('have.value', '');
    cy.get('#numero_pessoas').should('have.value', '');
    cy.get('#observacoes').should('have.value', '');
    cy.get('#status').should('have.value', 'ativa');
    cy.get('#data_reserva').should('have.value', tomorrowStr);
  });

  it('deve permitir diferentes status de reserva', () => {
    cy.get('#status option').should('have.length', 3);
    cy.get('#status').should('contain', 'Ativa');
    cy.get('#status').should('contain', 'Cancelada');
    cy.get('#status').should('contain', 'Concluída');

    cy.get('#status').select('cancelada');
    cy.get('#status').should('have.value', 'cancelada');
  });
});

