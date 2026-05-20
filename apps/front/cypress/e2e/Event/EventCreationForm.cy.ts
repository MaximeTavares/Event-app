import { fillEventForm } from "../../support/fillEventForm";
import { testUser } from "../../support/testUser";

describe("Event creation", () => {
	before(() => {
		cy.checkTestUser();
	});

	beforeEach(() => {
		cy.session("user", () => {
			cy.login(testUser.email, testUser.password);
		});
	});

	it("Should access to events page", () => {
		cy.visit("/me/events");
	});

	it("Should open the creation form", () => {
		cy.visit("/me/events");
		cy.get('[data-cy="create-event"]').click();
		cy.url().should("include", "/events/create");
	});

	it("Should show error on empty title", () => {
		// Open the form
		cy.visit("/me/events");
		cy.get('[data-cy="create-event"]').click();
		cy.url().should("include", "/events/create");

		cy.get('input[name="title"]').type("fdqsfqsdfsdqf").clear().blur();
		cy.contains("Le titre est requis").should("be.visible");

		cy.get('textarea[name="description"]').type("fdqsfqsdfsdqf").clear().blur();
		cy.contains("Le titre est requis").should("be.visible");
	});

	it("Should show error on empty description", () => {
		// Open the form
		cy.visit("/me/events");
		cy.get('[data-cy="create-event"]').click();
		cy.url().should("include", "/events/create");

		cy.get('textarea[name="description"]').type("fdqsfqsdfsdqf").clear().blur();
		cy.contains("La description est requise").should("be.visible");
	});

	it("Should show error on empty program", () => {
		// Open the form
		cy.visit("/me/events");
		cy.get('[data-cy="create-event"]').click();
		cy.url().should("include", "/events/create");

		cy.get('textarea[name="program"]').type("fdqsfqsdfsdqf").clear().blur();
		cy.contains("Le programme est requis").should("be.visible");
	});

	it("Should show error on end date before start date", () => {
		// Open the form
		cy.visit("/me/events");
		cy.get('[data-cy="create-event"]').click();
		cy.url().should("include", "/events/create");

		cy.get('[data-cy="start-date"]').type("2026-02-25");
		cy.get('[data-cy="end-date"]').type("2026-02-19");

		cy.contains("La date de fin doit être après la date de début").should("be.visible");
	});

	it("Should show error on empty address number", () => {
		// Open the form
		cy.visit("/me/events");
		cy.get('[data-cy="create-event"]').click();
		cy.url().should("include", "/events/create");

		cy.get('[data-cy="address-number"]').type("fdqsfqsdfsdqf").clear().blur();
		cy.contains("Le numéro de rue est requis").should("be.visible");
	});

	it("Should show error on empty address street name", () => {
		// Open the form
		cy.visit("/me/events");
		cy.get('[data-cy="create-event"]').click();
		cy.url().should("include", "/events/create");

		cy.get('[data-cy="address-street-name"]').type("fdqsfqsdfsdqf").clear().blur();
		cy.contains("Le nom de rue est requis").should("be.visible");
	});

	it("Should show error on empty city", () => {
		// Open the form
		cy.visit("/me/events");
		cy.get('[data-cy="create-event"]').click();
		cy.url().should("include", "/events/create");

		cy.get('[data-cy="city"]').type("fdqsfqsdfsdqf").clear().blur();
		cy.contains("La ville est requise").should("be.visible");
	});

	it("Should show error on empty postal code", () => {
		// Open the form
		cy.visit("/me/events");
		cy.get('[data-cy="create-event"]').click();
		cy.url().should("include", "/events/create");

		cy.get('[data-cy="address-pc"]').type("fdqsfqsdfsdqf").clear().blur();
		cy.contains("Le code postal est requis").should("be.visible");
	});

	it("Should show error on empty country", () => {
		// Open the form
		cy.visit("/me/events");
		cy.get('[data-cy="create-event"]').click();
		cy.url().should("include", "/events/create");

		cy.get('[data-cy="country"]').type("fdqsfqsdfsdqf").clear().blur();
		cy.contains("Le pays est requis").should("be.visible");
	});

	it("Submit button should be disable on not completed form", () => {
		// Open the form
		cy.visit("/me/events");
		cy.get('[data-cy="create-event"]').click();
		cy.url().should("include", "/events/create");

		cy.get('[data-cy="submit-event"]').should("be.disabled");
	});

	it("Submit button should be enable on completed form", () => {
		// Open the form
		cy.visit("/me/events");
		cy.get('[data-cy="create-event"]').click();
		cy.url().should("include", "/events/create");

		fillEventForm();

		cy.get('[data-cy="submit-event"]').should("be.enabled");
	});

	it("Should create an event successfully", () => {
		cy.intercept({
			method: "POST",
			url: "**/events",
		}).as("createEvent");

		cy.visit("/me/events");
		cy.get('[data-cy="create-event"]').click();

		fillEventForm();

		cy.get('[data-cy="submit-event"]').click();

		cy.wait("@createEvent").its("response.statusCode").should("eq", 201);

		cy.contains("Événement créé avec succès").should("be.visible");
	});
});
