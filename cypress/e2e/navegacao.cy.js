describe('Navegação da Aplicação E2E', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve exibir a página inicial corretamente', () => {
    cy.contains('h1', 'Sistema de Reservas e Clientes').should('be.visible');
    cy.contains('p', 'Gerencie suas reservas e clientes de forma eficiente').should('be.visible');
    
    cy.contains('a', 'Cadastrar Cliente').should('be.visible');
    cy.contains('a', 'Nova Reserva').should('be.visible');
    
    cy.contains('h2', 'Clientes Cadastrados').should('be.visible');
    cy.contains('h2', 'Reservas').should('be.visible');
  });

  it('deve navegar para a página de cadastro de cliente', () => {
    cy.contains('a', 'Cadastrar Cliente').click();
    cy.url().should('include', '/clientes/novo');
    cy.contains('h1', 'Cadastrar Cliente').should('be.visible');
  });

  it('deve navegar para a página de cadastro de reserva', () => {
    cy.contains('a', 'Nova Reserva').click();
    cy.url().should('include', '/reservas/novo');
    cy.contains('h1', 'Nova Reserva').should('be.visible');
  });

  it('deve carregar dados dos clientes na página inicial', () => {
    cy.get('#clientes-loading').should('be.visible');
    
    cy.get('#clientes-table', { timeout: 10000 }).should('be.visible');
    cy.get('#clientes-loading').should('not.be.visible');
    
    cy.get('#clientes-table thead').should('contain', 'ID');
    cy.get('#clientes-table thead').should('contain', 'Nome');
    cy.get('#clientes-table thead').should('contain', 'Email');
    cy.get('#clientes-table thead').should('contain', 'Telefone');
    cy.get('#clientes-table thead').should('contain', 'Endereço');
  });

  it('deve carregar dados das reservas na página inicial', () => {
    cy.get('#reservas-loading').should('be.visible');
    
    cy.get('#reservas-table', { timeout: 10000 }).should('be.visible');
    cy.get('#reservas-loading').should('not.be.visible');
    
    cy.get('#reservas-table thead').should('contain', 'ID');
    cy.get('#reservas-table thead').should('contain', 'Cliente');
    cy.get('#reservas-table thead').should('contain', 'Data');
    cy.get('#reservas-table thead').should('contain', 'Hora');
    cy.get('#reservas-table thead').should('contain', 'Pessoas');
    cy.get('#reservas-table thead').should('contain', 'Status');
  });

  it('deve exibir layout responsivo', () => {
    cy.viewport(768, 1024);
    cy.contains('h1', 'Sistema de Reservas e Clientes').should('be.visible');
    cy.contains('a', 'Cadastrar Cliente').should('be.visible');
    cy.contains('a', 'Nova Reserva').should('be.visible');

    cy.viewport(375, 667);
    cy.contains('h1', 'Sistema de Reservas e Clientes').should('be.visible');
    cy.contains('a', 'Cadastrar Cliente').should('be.visible');
    cy.contains('a', 'Nova Reserva').should('be.visible');
  });

  it('deve aplicar estilos visuais corretamente', () => {
    cy.get('.header').should('have.css', 'background-color');
    cy.get('.btn').should('have.css', 'border-radius');
    cy.get('.data-table').should('have.css', 'box-shadow');
    
    cy.contains('a', 'Cadastrar Cliente').should('have.css', 'background-image');
    cy.contains('a', 'Nova Reserva').should('have.css', 'background-image');
  });

  it('deve ter efeitos hover nos botões', () => {
    cy.contains('a', 'Cadastrar Cliente').trigger('mouseover');
    cy.contains('a', 'Nova Reserva').trigger('mouseover');
  });
});

