const testBoard = {
  name: 'Test Board',
  columns: [
    {
      name: 'To Do',
      tasks: [
        {
          title: 'Implement User Authentication',
          description: 'Add user authentication functionality to the application',
          status: 'In Progress',
          subtasks: [
            {
              title: 'Set up user registration',
              isCompleted: false,
            },
            {
              title: 'Implement login functionality',
              isCompleted: true,
            },
          ],
        },
        {
          title: 'Design Database Schema',
          description: 'Create a robust and scalable database schema',
          status: 'To Do',
          subtasks: [
            {
              title: 'Define entity relationships',
              isCompleted: false,
            },
            {
              title: 'Optimize performance',
              isCompleted: false,
            },
          ],
        },
      ],
    },
    {
      name: 'In Progress',
      tasks: [
        {
          title: 'Refactor Codebase',
          description: 'Improve code structure and readability',
          status: 'In Progress',
          subtasks: [
            {
              title: 'Extract reusable components',
              isCompleted: true,
            },
            {
              title: 'Update coding style',
              isCompleted: false,
            },
          ],
        },
      ],
    },
    {
      name: 'Done',
      tasks: [
        {
          title: 'Write Documentation',
          description: 'Document application features and usage guidelines',
          status: 'Completed',
          subtasks: [
            {
              title: 'Document API endpoints',
              isCompleted: true,
            },
            {
              title: 'Provide examples and tutorials',
              isCompleted: true,
            },
          ],
        },
      ],
    },
  ],
}

export { testBoard }
