import { fillEventForm } from '../../support/fillEventForm';

describe('Event creation', () => {
    before(() => {
        cy.checkTestUser();
    });

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.loginByApi();

        cy.visit('/me/events');
        cy.get('[data-cy="create-event"]').should('be.visible');
    });

    it('should access events page', () => {
        cy.url().should('include', '/me/events');
        cy.getCookie('refresh_token').should('exist');
    });

    it('should open creation form', () => {
        cy.get('[data-cy="create-event"]').click();
        cy.url().should('include', '/events/create');
    });

    it('should show validation errors when fields are cleared', () => {
        cy.get('[data-cy="create-event"]').click();

        cy.get('input[name="title"]').type('test').clear().blur();

        cy.contains('Le titre est requis').should('be.visible');

        cy.get('textarea[name="description"]').type('test').clear().blur();

        cy.contains('La description est requise').should('be.visible');

        cy.get('textarea[name="program"]').type('test').clear().blur();

        cy.contains('Le programme est requis').should('be.visible');
    });

    it('should validate date logic', () => {
        cy.get('[data-cy="create-event"]').click();

        cy.get('[data-cy="start-date"]').type('2026-02-25');
        cy.get('[data-cy="end-date"]').type('2026-02-19');

        cy.contains('La date de fin doit être après la date de début').should('be.visible');
    });

    it('should disable submit when form is incomplete', () => {
        cy.get('[data-cy="create-event"]').click();

        cy.get('[data-cy="submit-event"]').should('be.disabled');
    });

    it('should enable submit when form is valid', () => {
        cy.get('[data-cy="create-event"]').click();

        fillEventForm();

        cy.get('[data-cy="submit-event"]').should('be.enabled');
    });

    it('should create event successfully', () => {
        cy.intercept('POST', '**/events').as('createEvent');

        cy.get('[data-cy="create-event"]').click();

        fillEventForm();

        cy.get('[data-cy="submit-event"]').click();

        cy.wait('@createEvent').its('response.statusCode').should('eq', 201);

        cy.contains('Événement créé avec succès').should('be.visible');
    });
});
