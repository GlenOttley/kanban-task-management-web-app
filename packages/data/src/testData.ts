const testBoard = {
  _id: '648b3751ca1086b836a2f0c5',
  name: 'Test Board',
  columns: [
    {
      _id: '648b377eca1086b836a2f0c6',
      name: 'To Do',
      tasks: [
        {
          _id: '648b378dca1086b836a2f0c7',
          title: 'Implement User Authentication',
          description: 'Add user authentication functionality to the application',
          status: 'In Progress',
          subtasks: [
            {
              _id: '648b3799ca1086b836a2f0c8',
              title: 'Set up user registration',
              isCompleted: false,
            },
            {
              _id: '648b379fca1086b836a2f0c9',
              title: 'Implement login functionality',
              isCompleted: true,
            },
          ],
          column: '648b377eca1086b836a2f0c6',
        },
        {
          _id: '648b37a4ca1086b836a2f0ca',
          title: 'Design Database Schema',
          description: 'Create a robust and scalable database schema',
          status: 'To Do',
          subtasks: [
            {
              _id: '648b37acca1086b836a2f0cb',
              title: 'Define entity relationships',
              isCompleted: false,
            },
            {
              _id: '648b37b1ca1086b836a2f0cc',
              title: 'Optimize performance',
              isCompleted: false,
            },
          ],
          column: '648b377eca1086b836a2f0c6',
        },
      ],
    },
    {
      _id: '648b37b7ca1086b836a2f0cd',
      name: 'In Progress',
      tasks: [
        {
          _id: '648b37c2ca1086b836a2f0ce',
          title: 'Refactor Codebase',
          description: 'Improve code structure and readability',
          status: 'In Progress',
          subtasks: [
            {
              _id: '648b37c7ca1086b836a2f0cf',
              title: 'Extract reusable components',
              isCompleted: true,
            },
            {
              _id: '648b37cbca1086b836a2f0d0',
              title: 'Update coding style',
              isCompleted: false,
            },
          ],
          column: '648b37b7ca1086b836a2f0cd',
        },
      ],
    },
    {
      _id: '648b37d3ca1086b836a2f0d1',
      name: 'Done',
      tasks: [
        {
          _id: '4',
          title: 'Write Documentation',
          description: 'Document application features and usage guidelines',
          status: 'Completed',
          subtasks: [
            {
              _id: '648b37dbca1086b836a2f0d2',
              title: 'Document API endpoints',
              isCompleted: true,
            },
            {
              _id: '648b37e0ca1086b836a2f0d3',
              title: 'Provide examples and tutorials',
              isCompleted: true,
            },
          ],
          column: '648b37d3ca1086b836a2f0d1',
        },
      ],
    },
  ],
}

export { testBoard }
