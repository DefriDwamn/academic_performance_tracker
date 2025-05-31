describe("Analytics", () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.visit("/admin/analytics")
  })

  it("should display analytics dashboard", () => {
    cy.getByTestId("analytics-page").should("be.visible")
    cy.getByTestId("performance-metrics").should("be.visible")
    cy.getByTestId("attendance-statistics").should("be.visible")
    cy.getByTestId("grade-distribution").should("be.visible")
  })

  it("should display performance charts", () => {
    cy.getByTestId("performance-chart").should("be.visible")
    cy.getByTestId("trend-chart").should("be.visible")
    cy.getByTestId("comparison-chart").should("be.visible")
  })

  it("should filter analytics by date range", () => {
    cy.getByTestId("date-range-picker").click()
    cy.getByTestId("start-date").type("2023-09-01")
    cy.getByTestId("end-date").type("2023-12-31")
    cy.getByTestId("apply-filter").click()

    cy.getByTestId("analytics-data").should("be.visible")
  })

  it("should filter by program", () => {
    cy.getByTestId("program-filter").select("Computer Science")
    cy.getByTestId("analytics-data").should("contain", "Computer Science")
  })

  it("should display top performers", () => {
    cy.getByTestId("top-performers").should("be.visible")
    cy.getByTestId("performer-list").should("have.length.at.least", 1)
  })

  it("should display attendance trends", () => {
    cy.getByTestId("attendance-trends").should("be.visible")
    cy.getByTestId("monthly-attendance").should("be.visible")
    cy.getByTestId("course-attendance").should("be.visible")
  })

  it("should generate analytics report", () => {
    cy.getByTestId("generate-report-button").click()
    cy.getByTestId("report-modal").should("be.visible")
    cy.getByTestId("report-type-select").select("Performance Report")
    cy.getByTestId("include-charts-checkbox").check()
    cy.getByTestId("generate-pdf-button").click()

    cy.getByTestId("success-message").should("contain", "Report generated successfully")
  })

  it("should export analytics data", () => {
    cy.getByTestId("export-data-button").click()
    cy.getByTestId("export-format-select").select("CSV")
    cy.getByTestId("confirm-export-button").click()
  })

  it("should view detailed student analytics", () => {
    cy.getByTestId("student-analytics-tab").click()
    cy.getByTestId("student-select").select("John Doe")
    cy.getByTestId("student-performance-chart").should("be.visible")
    cy.getByTestId("student-attendance-chart").should("be.visible")
    cy.getByTestId("student-progress-timeline").should("be.visible")
  })
})
