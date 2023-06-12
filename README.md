# Kanban Board
Your assignment is to create a kanban board app. Kanban board is a workflow management tool for tracking tasks. The goal of the app is to enable users to add, update and filter tasks while displaying data in a meaningful and practical manner. You are encouraged to be creative and deviate from the specification as long you don’t break expected features.

Task is defined with a name, description, tags, reporter (user who created the task), assignee (user assigned to the task) and blocked by tasks (other tasks that block this task).

Tags can be added to a task to categorize the task more precisely thus allowing the user to filter the tasks by them.

User who creates a task is the reporter, the task can be assigned to the reporter or any other user.fe-kanban-josip_paradzik


## Features specification
1. User sign up & login
2. Create a task
Users should be able to create a new task.
3. Update a task
Users should be able to add and remove task tags, blocked by tasks and change
assignee of the task and task status.
4. The board should have 3 columns: todo, in progress and done.
5. Tasks are placed in columns according to their status.
6. Drag & drop tasks from one column to another to update their status.
7. Tag usage visualisation
Visualise ratio of used tags. Group tag ratios in 2 categories: a. frontend/backend/system
b. feature/bug
Example: If there are four tasks with a frontend tag, two with a backend tag and one with a system tag, ratio is 4:2:1 (frontend:backend:system), that data should be visualised somehow to the user, for example: .
8. Filter tasks by attributes
Tasks on the board should be filterable by a text input that accepts attribute:value format.Forexample, inputtags:feature,frontendshouldfindtasksthat have both feature and frontend tags. assignee:John should find tasks assigned to user John*, etc.

## Get started
Kanban API docs:
https://documenter.getpostman.com/view/2866330/kanban-api/RVnWjzSA

Install Kanban API (requires sudo on linux) `$ npm install -g @ag04/kanban-api`

Start Kanban API `$ kanban-api-start`

Reset database data `$ kanban-api-flush-db`
