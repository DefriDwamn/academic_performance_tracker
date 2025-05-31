describe("Grades Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.visit("/admin/grades")
  })

  it("should display grades page", () => {
    cy.getByTestId("grades-page").should("be.visible")
    cy.getByTestId("grades-table").should("be.visible")
    cy.getByTestId("add-grade-button").should("be.visible")
    cy.getByTestId("student-filter").should("be.visible")
    cy.getByTestId("course-filter").should("be.visible")
  })

  it("should filter grades by student", () => {
    cy.getByTestId("student-filter").select("John Doe")
    cy.getByTestId("grades-table").should("contain", "John Doe")
  })

  it("should filter grades by course", () => {
    cy.getByTestId("course-filter").select("CS101")
    cy.getByTestId("grades-table").should("contain", "CS101")
  })

  it("should add a new grade", () => {
    cy.fixture("grades").then((grades) => {
      cy.getByTestId("add-grade-button").click()
      cy.getByTestId("grade-modal").should("be.visible")

      // Fill form
      cy.getByTestId("student-select").select(grades.newGrade.studentId)
      cy.getByTestId("course-select").select(grades.newGrade.courseId)
      cy.getByTestId("score-input").type(grades.newGrade.score.toString())
      cy.getByTestId("maxScore-input").type(grades.newGrade.maxScore.toString())
      cy.getByTestId("letterGrade-input").type(grades.newGrade.letterGrade)
      cy.getByTestId("semester-select").select(grades.newGrade.semester)

      // Submit
      cy.getByTestId("save-grade-button").click()

      // Verify
      cy.getByTestId("success-message").should("contain", "Grade added successfully")
      cy.getByTestId("grades-table").should("contain", grades.newGrade.letterGrade)
    })
  })

  it("should edit a grade", () => {
    cy.getByTestId("grades-table").within(() => {
      cy.get('[data-testid="edit-grade-button"]').first().click()
    })

    cy.getByTestId("grade-modal").should("be.visible")
    cy.getByTestId("score-input").clear().type("90")
    cy.getByTestId("letterGrade-input").clear().type("A-")

    cy.getByTestId("save-grade-button").click()
    cy.getByTestId("success-message").should("contain", "Grade updated successfully")
  })

  it("should delete a grade", () => {
    cy.getByTestId("grades-table").within(() => {
      cy.get('[data-testid="delete-grade-button"]').first().click()
    })

    cy.getByTestId("confirm-delete-modal").should("be.visible")
    cy.getByTestId("confirm-delete-button").click()
    cy.getByTestId("success-message").should("contain", "Grade deleted successfully")
  })

  it("should calculate GPA correctly", () => {
    cy.getByTestId("gpa-display").should("be.visible")
    cy.getByTestId("gpa-value").should("contain", "3.")
  })

  it("should export grades report", () => {
    cy.getByTestId("export-grades-button").click()
    cy.getByTestId("export-options").should("be.visible")
    cy.getByTestId("export-pdf").click()
  })
})
