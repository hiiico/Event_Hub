/// <reference types="cypress" />

describe('RSVP to Event', () => {
  beforeEach(() => {
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

    // On event details page, click RSVP button (adjust text to match – maybe "RSVP" or "Attend")
    cy.contains('button', /RSVP|Attend/i).click();

    // After RSVP, button should change to "Cancel RSVP"
    cy.contains('button', /Cancel RSVP/i).should('be.visible');

    // Cancel RSVP
    cy.contains('button', /Cancel RSVP/i).click();

    // Button should revert to "RSVP"
    cy.contains('button', /RSVP|Attend/i).should('be.visible');
  });
});
