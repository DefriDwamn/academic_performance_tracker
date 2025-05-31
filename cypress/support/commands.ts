/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      loginAsAdmin(): Chainable<void>
      loginAsStudent(): Chainable<void>
      logout(): Chainable<void>
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>
      waitForPageLoad(): Chainable<void>
    }
  }
}

// Custom command to login
Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/login")
  cy.getByTestId("email-input").type(email)
  cy.getByTestId("password-input").type(password)
  cy.getByTestId("login-button").click()
  cy.waitForPageLoad()
})

// Login as admin
Cypress.Commands.add("loginAsAdmin", () => {
  cy.login("admin@example.com", "admin123")
})

// Login as student
Cypress.Commands.add("loginAsStudent", () => {
  cy.login("student1@example.com", "password123")
})

// Logout
Cypress.Commands.add("logout", () => {
  cy.getByTestId("user-menu").click()
  cy.getByTestId("logout-button").click()
  cy.url().should("include", "/login")
})

// Get element by test id
Cypress.Commands.add("getByTestId", (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`)
})

// Wait for page to load
Cypress.Commands.add("waitForPageLoad", () => {
  cy.get('[data-testid="loading"]', { timeout: 1000 }).should("not.exist")
})

export {}
