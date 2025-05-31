describe("Attendance Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.visit("/admin/attendance")
  })

  it("should display attendance page", () => {
    cy.getByTestId("attendance-page").should("be.visible")
    cy.getByTestId("attendance-table").should("be.visible")
    cy.getByTestId("date-picker").should("be.visible")
    cy.getByTestId("course-filter").should("be.visible")
  })

  it("should filter attendance by date", () => {
    const today = new Date().toISOString().split("T")[0]
    cy.getByTestId("date-picker").type(today)
    cy.getByTestId("attendance-table").should("be.visible")
  })

  it("should mark attendance", () => {
    cy.getByTestId("attendance-table").within(() => {
      cy.get('[data-testid="attendance-status"]').first().click()
      cy.get('[data-testid="status-present"]').click()
    })

    cy.getByTestId("save-attendance-button").click()
    cy.getByTestId("success-message").should("contain", "Attendance saved successfully")
  })

  it("should bulk mark attendance", () => {
    cy.getByTestId("select-all-checkbox").click()
    cy.getByTestId("bulk-actions").should("be.visible")
    cy.getByTestId("mark-all-present").click()

    cy.getByTestId("save-attendance-button").click()
    cy.getByTestId("success-message").should("contain", "Attendance saved successfully")
  })

  it("should view attendance statistics", () => {
    cy.getByTestId("attendance-stats").should("be.visible")
    cy.getByTestId("present-count").should("be.visible")
    cy.getByTestId("absent-count").should("be.visible")
    cy.getByTestId("late-count").should("be.visible")
    cy.getByTestId("attendance-rate").should("be.visible")
  })

  it("should generate attendance report", () => {
    cy.getByTestId("generate-report-button").click()
    cy.getByTestId("report-options").should("be.visible")
    cy.getByTestId("date-range-picker").should("be.visible")
    cy.getByTestId("generate-pdf-report").click()
  })
})
