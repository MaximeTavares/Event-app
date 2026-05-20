import { fillEventForm } from "../../support/fillEventForm";
import { testUser } from "../../support/testUser";

describe("Event update", () => {
	before(() => {
		cy.checkTestUser();
	});

	beforeEach(() => {
		cy.session("user", () => {
			cy.login(testUser.email, testUser.password);
		});
	});

	it("Should update an event", () => {
		cy.intercept("POST", "**/events").as("createEvent");

		cy.visit("/me/events");
		cy.get('[data-cy="create-event"]').click();

		fillEventForm();

		cy.get('[data-cy="submit-event"]').click();

		cy.wait("@createEvent").then((interception) => {
			const id = interception.response?.body.data.id;

			cy.intercept("PATCH", `**/events/${id}`).as("updateEvent");

			cy.visit(`/events/${id}`);

			cy.get('[data-cy="edit-modal"]').click();

			cy.contains("Modification d'évènement").should("be.visible");

			// Update a field
			cy.get('[data-cy="event-title"]').clear().type("Updated event for Cy test purpose");

			// Submit update
			cy.get('[data-cy="submit-event"]').click();

			// API check
			cy.wait("@updateEvent").its("response.statusCode").should("eq", 200);

			// UI check
			cy.contains("Updated event for Cy test purpose").should("be.visible");
			cy.contains("Événement mis à jour avec succés.").should("be.visible");
		});
	});
});
