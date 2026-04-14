/// <reference types="cypress" />

describe('RSVP to Event', () => {
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
    cy.get('.event-card').should('have.length.at.least', 1);
  });

  it('should RSVP and then cancel RSVP on an event', () => {
    // Click the "Learn more" link inside the first event card
    cy.get('.event-card').first().find('a.learn-more').click();

    // On event details page, click RSVP button
    cy.contains('button', /RSVP|Attend/i).click();

    // After RSVP, button should change to "Cancel RSVP"
    cy.contains('button', /Cancel RSVP/i).should('be.visible');

    // Cancel RSVP
    cy.contains('button', /Cancel RSVP/i).click();

    // Button should revert to "RSVP"
    cy.contains('button', /RSVP|Attend/i).should('be.visible');
  });
});
