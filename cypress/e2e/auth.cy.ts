describe("Authentication", () => {
  beforeEach(() => {
    cy.visit("/login")
  })

  it("should display login form", () => {
    cy.getByTestId("login-form").should("be.visible")
    cy.getByTestId("email-input").should("be.visible")
    cy.getByTestId("password-input").should("be.visible")
    cy.getByTestId("login-button").should("be.visible")
    cy.contains("Student Management System").should("be.visible")
  })

  it("should show validation errors for empty fields", () => {
    cy.getByTestId("login-button").click()
    cy.contains("Email is required").should("be.visible")
    cy.contains("Password is required").should("be.visible")
  })

  it("should show error for invalid credentials", () => {
    cy.getByTestId("email-input").type("invalid@email.com")
    cy.getByTestId("password-input").type("wrongpassword")
    cy.getByTestId("login-button").click()

    cy.contains("Invalid credentials").should("be.visible")
  })

  it("should login successfully as admin", () => {
    cy.loginAsAdmin()
    cy.url().should("include", "/admin/dashboard")
    cy.getByTestId("admin-dashboard").should("be.visible")
    cy.getByTestId("user-menu").should("contain", "Admin")
  })

  it("should login successfully as student", () => {
    cy.loginAsStudent()
    cy.url().should("include", "/student/dashboard")
    cy.getByTestId("student-dashboard").should("be.visible")
    cy.getByTestId("user-menu").should("contain", "Student")
  })

  it("should logout successfully", () => {
    cy.loginAsAdmin()
    cy.logout()
    cy.url().should("include", "/login")
  })
})
