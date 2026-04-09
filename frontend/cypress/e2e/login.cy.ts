/// <reference types="cypress" />
describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login with valid credentials and redirect to events', () => {
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button').contains('Sign in').click();

    cy.url().should('include', '/events');
    cy.get('.event-card').should('have.length.at.least', 1);
  });
});
