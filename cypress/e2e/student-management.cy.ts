describe("Student Management", () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.visit("/admin/students")
  })

  it("should display students list", () => {
    cy.getByTestId("students-page").should("be.visible")
    cy.getByTestId("students-table").should("be.visible")
    cy.getByTestId("add-student-button").should("be.visible")
    cy.getByTestId("search-input").should("be.visible")
  })

  it("should search for students", () => {
    cy.getByTestId("search-input").type("John")
    cy.getByTestId("students-table").should("contain", "John")
  })

  it("should open add student modal", () => {
    cy.getByTestId("add-student-button").click()
    cy.getByTestId("student-modal").should("be.visible")
    cy.getByTestId("modal-title").should("contain", "Add Student")
  })

  it("should add a new student", () => {
    cy.fixture("students").then((students) => {
      cy.getByTestId("add-student-button").click()

      // Fill form
      cy.getByTestId("firstName-input").type(students.validStudent.firstName)
      cy.getByTestId("lastName-input").type(students.validStudent.lastName)
      cy.getByTestId("email-input").type(students.validStudent.email)
      cy.getByTestId("studentId-input").type(students.validStudent.studentId)
      cy.getByTestId("dateOfBirth-input").type(students.validStudent.dateOfBirth)
      cy.getByTestId("phone-input").type(students.validStudent.phone)
      cy.getByTestId("program-select").select(students.validStudent.program)
      cy.getByTestId("year-select").select(students.validStudent.year)

      // Submit form
      cy.getByTestId("save-student-button").click()

      // Verify success
      cy.getByTestId("success-message").should("contain", "Student added successfully")
      cy.getByTestId("students-table").should("contain", students.validStudent.firstName)
    })
  })

  it("should edit a student", () => {
    cy.fixture("students").then((students) => {
      // Click edit button for first student
      cy.getByTestId("students-table").within(() => {
        cy.get('[data-testid="edit-student-button"]').first().click()
      })

      cy.getByTestId("student-modal").should("be.visible")
      cy.getByTestId("modal-title").should("contain", "Edit Student")

      // Update fields
      cy.getByTestId("firstName-input").clear().type(students.editStudent.firstName)
      cy.getByTestId("lastName-input").clear().type(students.editStudent.lastName)
      cy.getByTestId("email-input").clear().type(students.editStudent.email)

      // Save changes
      cy.getByTestId("save-student-button").click()

      // Verify success
      cy.getByTestId("success-message").should("contain", "Student updated successfully")
      cy.getByTestId("students-table").should("contain", students.editStudent.firstName)
    })
  })

  it("should delete a student", () => {
    // Click delete button for first student
    cy.getByTestId("students-table").within(() => {
      cy.get('[data-testid="delete-student-button"]').first().click()
    })

    // Confirm deletion
    cy.getByTestId("confirm-delete-modal").should("be.visible")
    cy.getByTestId("confirm-delete-button").click()

    // Verify success
    cy.getByTestId("success-message").should("contain", "Student deleted successfully")
  })

  it("should view student details", () => {
    cy.getByTestId("students-table").within(() => {
      cy.get('[data-testid="view-student-button"]').first().click()
    })

    cy.getByTestId("student-details-modal").should("be.visible")
    cy.getByTestId("student-info").should("be.visible")
    cy.getByTestId("student-grades").should("be.visible")
    cy.getByTestId("student-attendance").should("be.visible")
  })

  it("should filter students by program", () => {
    cy.getByTestId("program-filter").select("Computer Science")
    cy.getByTestId("students-table").should("contain", "Computer Science")
  })

  it("should export students list", () => {
    cy.getByTestId("export-button").click()
    cy.getByTestId("export-menu").should("be.visible")
    cy.getByTestId("export-csv").click()
    // Verify download (this might need additional setup)
  })
})
