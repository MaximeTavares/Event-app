import { fillEventForm } from "../../support/fillEventForm";
import { testUser } from "../../support/testUser";

describe("Event deletion", () => {
	before(() => {
		cy.checkTestUser();
	});

	beforeEach(() => {
		cy.session("user", () => {
			cy.login(testUser.email, testUser.password);
		});
	});

	it("Should delete an event", () => {
		cy.intercept("POST", "**/events").as("createEvent");

		cy.visit("/me/events");
		cy.get('[data-cy="create-event"]').click();

		fillEventForm();

		cy.get('[data-cy="submit-event"]').click();

		cy.wait("@createEvent").then((interception) => {
			const id = interception.response?.body.data.id;

			cy.intercept("DELETE", `**/events/${id}`).as("deleteEvent");

			cy.visit(`/events/${id}`);

			cy.get('[data-cy="delete-modal"]').click();

			cy.contains("Voulez vous vraiment supprimer cet évènement ?").should("be.visible");

			cy.get('[data-cy="delete-event"]').click();

			// Check API call
			cy.wait("@deleteEvent").its("response.statusCode").should("eq", 200);

			// Check UI
			cy.contains("Événement supprimé avec succés.").should("be.visible");
		});
	});
});
