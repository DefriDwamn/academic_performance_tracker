describe("Authentication", () => {
    beforeEach(() => {
      cy.visit("/auth/login")
    })
  
    it("should display login form", () => {
      cy.get('[data-testid="login-form"]').should("be.visible")
      cy.get('[data-testid="email-input"]').should("be.visible")
      cy.get('[data-testid="password-input"]').should("be.visible")
      cy.get('[data-testid="login-button"]').should("be.visible")
      cy.contains("Welcome Back").should("be.visible")
    })
  
    it("should show validation errors for empty fields", () => {
      cy.get('[data-testid="login-button"]').click()
      cy.contains("Invalid email address").should("be.visible")
      cy.contains("Password must be at least 6 characters").should("be.visible")
    })
    
    it("should logout successfully", () => {
      // Login first
      cy.get('[data-testid="email-input"]').type("admin@example.com")
      cy.get('[data-testid="password-input"]').type("admin123")
      cy.get('[data-testid="login-button"]').click()
  
      // Wait for dashboard to load
      cy.url({ timeout: 10000 }).should("include", "/dashboard")
  
      // Click user menu and logout
      cy.get('[data-testid="user-menu"]').click()
      cy.get('[data-testid="logout-button"]').click()
  
      // Should redirect to login
      cy.url().should("include", "/auth/login")
    })
  })
  