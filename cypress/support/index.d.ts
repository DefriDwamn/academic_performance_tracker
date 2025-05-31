/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      loginAsAdmin(): Chainable<void>
      loginAsStudent(): Chainable<void>
      logout(): Chainable<void>
    }
  }
  