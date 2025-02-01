# MongoDB To-Do API 📝

A simple to-do list to help user organizes their tasks!

![npm v10.9.0](https://img.shields.io/badge/npm-v10.9.0-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Node.js v20.18.0](https://img.shields.io/badge/Node%20js-v20.18.0-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js v4.21.2](https://img.shields.io/badge/Express%20js-v4.21.2-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB v8.0.4](https://img.shields.io/badge/MongoDB-v8.0.4-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis v7.4.1](https://img.shields.io/badge/Redis-v7.4.1-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white)

### Getting Started

To get started with the MongoDB To-Do API, follow these steps:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/Bibbeep/MongoDB-To-Do-API.git
    cd MongoDB-To-Do-API
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**
  Create a `.env` file in the root directory and add the following variables:

    ```env
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017
    JWT_SECRET=your_jwt_secret
    REDIS_URL=redis://localhost:6379
    ```

4. **Run the application:**
    ```bash
    npm run dev
    ```

5. **Access the API:**
  You can now access the API at http://localhost:3000 . Open your browser or API client and navigate to the endpoints.

### Features:

- **User authentication**:
    - Log in and register with email and password
    - Log out
- **To-do organizer**:
    - Add a new task
    - Edit a task
    - Delete a task
    - Retrieve tasks

### API Endpoints:

- `POST /api/v1/auth/register` - Registers a new user account
- `POST /api/v1/auth/login` - Logs in a user account
- `POST /api/v1/auth/logout`  - Logs out a user account
- `GET /api/v1/todos`  - Retrieves all user's tasks
- `GET /api/v1/todos/:id`  - Retrieves a specified user's task
- `POST /api/v1/todos`  - Adds a new task
- `PATCH /api/v1/todos/:id`  - Edits a user's task
- `DELETE /api/v1/todos/:id - Deletes a task`  - Deletes a user's task

### Response Examples:

- `POST /api/v1/auth/register` - Registers a new user account

  - Request:

  ```bash
  curl -X POST http://localhost:3000/api/v1/auth/register \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@mail.com",
      "fullName": "Test User",
      "password": "passphrase123"
    }'
  ```
  - Response (201):

  ```json
  {
    "status": "success",
    "message": "Successfully registered a new account.",
    "data": {
      "user": {
        "id": "64c77b5f9f1c4f4e8c7b92b1"
      }
    }
  }
  ```
---

- `POST /api/v1/auth/login` - Logs in a user account

  - Request:

  ```bash
  curl -X POST http://localhost:3000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@mail.com",
      "password": "passphrase123"
    }'
  ```

  - Response (200):

  ```json
  {
    "status": "success",
    "message": "Successfully logged in.",
    "data": {
      "user": {
        "id": "64c77b5f9f1c4f4e8c7b92b1",
        "email": "test@mail.com",
        "fullName": "Test User"
      },
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzNDU2Nzg5LCJuYW1lIjoiSm9zZXBoIn0.OpOSSw7e485LOP5PrzScxHb7SR6sAOMRckfFwi4rp7o"
    }
  }
  ```
---

- `POST /api/v1/auth/logout` - Logs out a user account

  - Request:

  ```bash
  curl -X POST http://localhost:3000/api/v1/auth/logout \
    -H "Authorization: Bearer $JWT_TOKEN"
  ```

  - Response (200):

  ```json
  {
    "status": "success",
    "message": "Successfully logged out."
  }
  ```
---

- `GET /api/v1/todos`  - Retrieves all user's tasks

  - Request:

  ```bash
  curl -X GET http://localhost:3000/api/v1/todos?userId=64c77b5f9f1c4f4e8c7b92b1&page=2&count=10&includeSubTodos=true \
    -H "Authorization: Bearer $JWT_TOKEN"
  ```

  - Response (200):

  ```json
  {
    "status": "success",
    "message": "Successfully retrieved all user's tasks.",
    "data": {
      "todo": [
        {
          "id": "64c77b5f9f1c4f4e8c7b98217",
          "title": "Finish MongoDB Project",
          "note": "Use Node.js, Express.js, MongoDB, and Redis!",
          "dueDate": "2025-01-27T23:59:59.000Z",
          "isDone": false,
          "doneAt": null,
          "createdAt": "2025-01-26T18:21:00.009Z",
          "updatedAt": "2025-01-26T21:21:00.000Z",
          "subTodos": [
            {
              "title": "Setup the project",
              "note": null,
              "dueDate": "2025-01-27T20:00:00.000Z",
              "isDone": false,
              "doneAt": null,
              "createdAt": "2025-01-26T21:21:00.000Z",
              "updatedAt": "2025-01-26T21:21:00.000Z",
            },
            ...
          ]
        },
        ...
      ],
      "meta": {
        "pagination": {
          "currentPage": 2,
          "links": {
            "next": "/api/v1/todos?userId=64c77b5f9f1c4f4e8c7b92b1&page=3&count=10",
            "prev": "/api/v1/todos?userId=64c77b5f9f1c4f4e8c7b92b1&page=1&count=10"
          },
          "perPage": 10,
          "total": 31,
          "totalPages": 4
        }
      }
    },
  }
  ```
---

- `GET /api/v1/todos/:id` - Retrieves a specified user's task

  - Request:

  ```bash
  curl -X GET http://localhost:3000/api/v1/todos/64c77b5f9f1c4f4e8c7b98217?includeSubTodos=true \
    -H "Authorization: Bearer $JWT_TOKEN"
  ```

  - Response (200):

  ```json
  {
    "status": "success",
    "message": "Successfully retrieved a task.",
    "data": {
      "todo": {
        "id": "64c77b5f9f1c4f4e8c7b98217",
        "title": "Finish MongoDB Project",
        "note": "Use Node.js, Express.js, MongoDB, and Redis!",
        "dueDate": "2025-01-27T23:59:59.000Z",
        "isDone": false,
        "doneAt": null,
        "createdAt": "2025-01-26T18:21:00.009Z",
        "updatedAt": "2025-01-26T21:21:00.000Z",
        "subTodos": [
          {
            "id": "64c77b5f9f1c4f4e8c7b93b2",
            "title": "Setup the project",
            "note": null,
            "dueDate": "2025-01-27T20:00:00.000Z",
            "isDone": false,
            "doneAt": null,
            "createdAt": "2025-01-26T21:21:00.000Z",
            "updatedAt": "2025-01-26T21:21:00.000Z",
          },
          ...
        ]
      }
    }
  }
  ```
---

- `POST /api/v1/todos` - Adds a new task

  - Request:

  ```bash
  curl -X POST http://localhost:3000/api/v1/todos \
    -H "Authorization: Bearer $JWT_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "title": "Take MongoDB Associate Developer Exam",
      "note": "https://learn.mongodb.com/learn/course/mongodb-associate-developer-exam-nodejs",
      "onDate": "2025-01-31T06:00:00.000Z",
      "dueDate": "2025-01-31T08:00:00.000Z",
      "subTodos": [
        {
          "title": "Purchase the exam",
          "note": "Use this voucher to get 100% discount: AHS3213S321321AD"
        },
        {
          "title": "Take the exam practice"
        }
      ]
    }'
  ```

  - Response (201):

  ```json
  {
    "status": "success",
    "message": "Successfully added a new task.",
    "data": {
      "todo": {
        "id": "64c77b5f9f1c4f4e8c5b98255"
      }
    }
  }
  ```
---

- `PATCH /api/v1/todos/64c77b5f9f1c4f4e8c5b98255` - Edits a user's task

  - Request

  ```bash
  curl -X PATCH http://localhost:3000/api/todos/64c77b5f9f1c4f4e8c5b98255?includeSubTodos=true \
    -H "Authorization: Bearer $JWT_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{ "dueDate": "2025-02-02T06:00:00.000Z" }'
  ```

  - Response (200):

  ```json
  {
    "status": "success",
    "message": "Successfully edited a task.",
    "data": {
      "todo": {
        "id": "64c77b5f9f1c4f4e8c5b98255"
      } 
    }
  }
  ```
---

- `DELETE /api/v1/todos/64c77b5f9f1c4f4e8c5b98255`  - Deletes a user's task

  - Request:

  ```bash
  curl -X DELETE http://localhost:3000/api/v1/todos/64c77b5f9f1c4f4e8c5b98255 \
    -H "Authorization: Bearer $JWT_TOKEN"
  ```

  - Response (200):

  ```json
  {
    "status": "success",
    "message": "Successfully deleted a task."
  }
  ```