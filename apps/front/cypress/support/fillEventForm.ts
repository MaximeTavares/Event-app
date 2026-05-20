import { faker } from "@faker-js/faker";

const startDate = faker.date.soon({ days: 10 });
const endDate = faker.date.soon({ days: 5, refDate: startDate });

export const fillEventForm = () => {
	cy.get('input[name="title"]').type(faker.lorem.words(3));
	cy.get('textarea[name="description"]').type(faker.lorem.paragraph());
	cy.get('textarea[name="program"]').type(faker.lorem.paragraph());
	cy.get('[data-cy="start-date"]').type(startDate.toISOString().split("T")[0]);
	cy.get('[data-cy="end-date"]').type(endDate.toISOString().split("T")[0]);
	cy.get('[data-cy="address-number"]').type(faker.location.buildingNumber());
	cy.get("[data-cy=address-street-name]").type(faker.location.street());
	cy.get('[data-cy="address-pc"]').type(faker.location.zipCode());
	cy.get('[data-cy="city"]').type(faker.location.city());
	cy.get('[data-cy="country"]').type(faker.location.country());
};