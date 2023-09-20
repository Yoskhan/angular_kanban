describe('Board Test', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/tasks', { fixture: 'tasks' });
    cy.intercept('GET', 'api/users', { fixture: 'assignees' });
    cy.intercept('GET', 'api/tags', { fixture: 'tags' });

    cy.intercept('GET', 'api/me', { fixture: 'user' }).as('getUserRequest');

    cy.intercept('POST', 'api/signin', {
      fixture: 'login',
    });

    cy.intercept('POST', 'api/task', {
      fixture: 'addNewTask',
    });
  });

  beforeEach(() => {
    cy.visit('/auth');

    cy.get('input[name="username"]').click({ force: true }).type('username');

    cy.get('input[name="password"]').click({ force: true }).type('password1');

    cy.get('button.login-register-btn').click();
  });

  it('should login', () => {
    cy.url().should('include', '/board');
  });

  it('should visit "/board" route', () => {
    cy.url().should('include', '/board');
  });

  it('should display list of courses', () => {
    cy.contains('Update Homepage Content');
    cy.get('app-task').should('have.length', 9);
  });

  it('should add new task', () => {
    cy.get('.add-new-btn').click({ force: true });
    cy.get('input[formControlName="name"]')
      .click({ force: true })
      .type('New Task Name');

    cy.get('textarea[formControlName="description"]')
      .click({ force: true })
      .type('New Task Description');

    cy.get('mat-select[formControlName="assignee"]').click({ force: true });

    cy.get('mat-option[id="mat-option-14"]').click({ force: true });
    cy.get('button[type="submit"]').click({ force: true });

    cy.contains('New Task Name');
  });

  it('should logout', () => {
    cy.get('.header__logout').click({ force: true });
    cy.contains('Switch to Sign Up');
  });
});
