/// <reference types="cypress" />

describe('Register', () => {
  const uniqueEmail = `user${Date.now()}@example.com`;
  const password = 'password123';

  it('should register a new user and redirect to events', () => {
    cy.visit('/register');

    cy.get('input[name="name"]').type('New User');
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="rePassword"]').type(password);
    cy.get('button').contains('Sign up').click();

    cy.url().should('include', '/events');
    cy.get('.event-card').should('have.length.at.least', 1);
  });

  it('should show error when passwords do not match', () => {
    cy.visit('/register');

    cy.get('input[name="name"]').type('New User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="rePassword"]').type('different');

    // The submit button should be disabled
    cy.get('button').contains('Sign up').should('be.disabled');

    // The error message should be visible
    cy.contains('Passwords do not match').should('be.visible');
  });
});
