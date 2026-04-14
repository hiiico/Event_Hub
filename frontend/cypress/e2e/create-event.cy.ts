/// <reference types="cypress" />

describe('Create Event', () => {
  beforeEach(() => {
    // Register test user if not exists
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/register',
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      },
      failOnStatusCode: false
    });
    cy.visit('/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button').contains('Sign in').click();

    cy.url().should('include', '/events');
    cy.get('.event-card', { timeout: 10000 }).should('have.length.at.least', 1);
    cy.get('button.btn--accent').contains('Create event').should('exist');
  });

  it('should create a new event', () => {
    cy.get('button.btn--accent').contains('Create event').click();

    cy.url().should('include', '/events/create');
    cy.get('input[name="title"]', { timeout: 15000 }).should('exist');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateTime = tomorrow.toISOString().slice(0, 16); // YYYY-MM-DDThh:mm

    cy.get('form').within(() => {
      cy.get('input[name="title"]').type('Cypress Test Event');
      cy.get('textarea[name="description"]').type('Created by E2E test');
      cy.get('input[name="dateTime"]').type(dateTime);
      cy.get('app-location-picker input').type('Test Location');
      cy.get('select[name="category"]').select('Tech');
      cy.get('button[type="submit"]').click();
    });

    cy.url({ timeout: 10000 }).should('match', /\/events\/[a-f0-9]+/);

    cy.visit('/events');
    cy.get('.event-card', { timeout: 10000 }).should('contain', 'Cypress Test Event');
  });
});
