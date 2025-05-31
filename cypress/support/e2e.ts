// Import commands.js using ES2015 syntax:
import "./commands"

// Hide fetch/XHR requests from command log
Cypress.on("window:before:load", (win) => {
  cy.stub(win.console, "error").as("consoleError")
  cy.stub(win.console, "warn").as("consoleError")
})
