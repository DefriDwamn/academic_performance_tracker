describe("Student Dashboard", () => {
  beforeEach(() => {
    cy.loginAsStudent()
  })

  it("should display student dashboard", () => {
    cy.getByTestId("student-dashboard").should("be.visible")
    cy.getByTestId("welcome-message").should("be.visible")
    cy.getByTestId("student-stats").should("be.visible")
    cy.getByTestId("current-gpa").should("be.visible")
    cy.getByTestId("attendance-rate").should("be.visible")
  })

  it("should navigate to grades page", () => {
    cy.getByTestId("nav-grades").click()
    cy.url().should("include", "/student/grades")
    cy.getByTestId("student-grades-page").should("be.visible")
  })

  it("should display student grades", () => {
    cy.visit("/student/grades")
    cy.getByTestId("grades-list").should("be.visible")
    cy.getByTestId("semester-filter").should("be.visible")
    cy.getByTestId("gpa-summary").should("be.visible")
  })

  it("should navigate to attendance page", () => {
    cy.getByTestId("nav-attendance").click()
    cy.url().should("include", "/student/attendance")
    cy.getByTestId("student-attendance-page").should("be.visible")
  })

  it("should display attendance record", () => {
    cy.visit("/student/attendance")
    cy.getByTestId("attendance-calendar").should("be.visible")
    cy.getByTestId("attendance-summary").should("be.visible")
    cy.getByTestId("monthly-stats").should("be.visible")
  })

  it("should navigate to profile page", () => {
    cy.getByTestId("nav-profile").click()
    cy.url().should("include", "/student/profile")
    cy.getByTestId("student-profile-page").should("be.visible")
  })

  it("should update profile information", () => {
    cy.visit("/student/profile")
    cy.getByTestId("edit-profile-button").click()

    cy.getByTestId("phone-input").clear().type("+1234567890")
    cy.getByTestId("address-input").clear().type("123 New Address St")

    cy.getByTestId("save-profile-button").click()
    cy.getByTestId("success-message").should("contain", "Profile updated successfully")
  })

  it("should view academic progress", () => {
    cy.visit("/student/analytics")
    cy.getByTestId("progress-chart").should("be.visible")
    cy.getByTestId("grade-trends").should("be.visible")
    cy.getByTestId("course-performance").should("be.visible")
  })
})
