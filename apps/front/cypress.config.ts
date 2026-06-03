import { defineConfig } from 'cypress';

export default defineConfig({
    allowCypressEnv: false,

    e2e: {
        setupNodeEvents() {
            // implement node event listeners here
        },
        specPattern: 'cypress/e2e/**/*.cy.ts',
        // supportFile: 'cypress/support/e2e.ts',
        baseUrl: 'http://localhost:5173',
    },
});
