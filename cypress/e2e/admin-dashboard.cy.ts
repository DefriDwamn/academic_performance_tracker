describe("Admin Dashboard", () => {
  beforeEach(() => {
    cy.loginAsAdmin()
  })

  it("should display dashboard overview", () => {
    cy.getByTestId("admin-dashboard").should("be.visible")
    cy.getByTestId("stats-cards").should("be.visible")
    cy.getByTestId("total-students-card").should("be.visible")
    cy.getByTestId("total-courses-card").should("be.visible")
    cy.getByTestId("average-grade-card").should("be.visible")
    cy.getByTestId("attendance-rate-card").should("be.visible")
  })

  it("should display charts and analytics", () => {
    cy.getByTestId("performance-chart").should("be.visible")
    cy.getByTestId("attendance-chart").should("be.visible")
    cy.getByTestId("grade-distribution-chart").should("be.visible")
  })

  it("should navigate to students page", () => {
    cy.getByTestId("nav-students").click()
    cy.url().should("include", "/admin/students")
    cy.getByTestId("students-page").should("be.visible")
  })

  it("should navigate to grades page", () => {
    cy.getByTestId("nav-grades").click()
    cy.url().should("include", "/admin/grades")
    cy.getByTestId("grades-page").should("be.visible")
  })

  it("should navigate to attendance page", () => {
    cy.getByTestId("nav-attendance").click()
    cy.url().should("include", "/admin/attendance")
    cy.getByTestId("attendance-page").should("be.visible")
  })

  it("should navigate to analytics page", () => {
    cy.getByTestId("nav-analytics").click()
    cy.url().should("include", "/admin/analytics")
    cy.getByTestId("analytics-page").should("be.visible")
  })

  it("should display recent activities", () => {
    cy.getByTestId("recent-activities").should("be.visible")
    cy.getByTestId("activity-list").should("be.visible")
  })
})
