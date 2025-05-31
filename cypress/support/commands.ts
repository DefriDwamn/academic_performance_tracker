/// <reference types="cypress" />

declare global {
    namespace Cypress {
      interface Chainable {
        login(email: string, password: string): Chainable<void>
        loginAsAdmin(): Chainable<void>
        loginAsStudent(): Chainable<void>
      }
    }
  }
  
  // Custom command to login
  Cypress.Commands.add("login", (email: string, password: string) => {
    cy.visit("/auth/login")
    cy.get('[data-testid="email-input"]').type(email)
    cy.get('[data-testid="password-input"]').type(password)
    cy.get('[data-testid="login-button"]').click()
    cy.url({ timeout: 10000 }).should("include", "/dashboard")
  })
  
  // Login as admin
  Cypress.Commands.add("loginAsAdmin", () => {
    cy.login("admin@example.com", "admin123")
  })
  
  // Login as student
  Cypress.Commands.add("loginAsStudent", () => {
    cy.login("student1@example.com", "password123")
  })
  
  export {}
  