# Low Code No Code Platform - Backend

The backend of the Low Code No Code Platform is built with Node.js and Express, providing a robust API for managing application data and component configurations.

## Directory Structure

```
server/
├── config/                # Configuration files
│   ├── db.js             # Database configuration
│   └── env.js            # Environment variables
├── controllers/          # Request handlers
│   ├── components.js     # Component management
│   ├── projects.js       # Project management
│   └── users.js         # User management
├── models/              # Database models
│   ├── Component.js     # Component schema
│   ├── Project.js       # Project schema
│   └── User.js         # User schema
├── routes/             # API routes
│   ├── components.js   # Component endpoints
│   ├── projects.js    # Project endpoints
│   └── users.js       # User endpoints
├── middleware/        # Custom middleware
│   ├── auth.js       # Authentication
│   └── validation.js # Request validation
├── utils/            # Utility functions
└── index.js         # Server entry point
```

## API Endpoints

### Components

```
GET    /api/components     # List all components
POST   /api/components     # Create new component
GET    /api/components/:id # Get component by ID
PUT    /api/components/:id # Update component
DELETE /api/components/:id # Delete component
```

### Projects

```
GET    /api/projects      # List all projects
POST   /api/projects      # Create new project
GET    /api/projects/:id  # Get project by ID
PUT    /api/projects/:id  # Update project
DELETE /api/projects/:id  # Delete project
```

### Users

```
POST   /api/users/register # Register new user
POST   /api/users/login    # Login user
GET    /api/users/profile  # Get user profile
PUT    /api/users/profile  # Update profile
```

### Templates

```
GET    /api/templates          # List all templates
POST   /api/templates          # Create new template
GET    /api/templates/:id      # Get template by ID
PUT    /api/templates/:id      # Update template
DELETE /api/templates/:id      # Delete template
GET    /api/templates/public   # List public templates
GET    /api/templates/user     # List user's templates
POST   /api/templates/:id/duplicate # Duplicate template
POST   /api/templates/:id/share     # Share template
```

## Database Schema

### Component
```javascript
{
  id: String,
  type: String,
  properties: {
    label: String,
    value: String,
    required: Boolean,
    validation: {
      required: Boolean,
      minLength: Number,
      maxLength: Number,
      pattern: String,
      custom: String
    },
    style: {
      width: String,
      height: String,
      color: String,
      // ... other style properties
    }
  },
  position: {
    x: Number,
    y: Number
  },
  projectId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Project
```javascript
{
  id: String,
  name: String,
  description: String,
  components: [ComponentSchema],
  userId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### User
```javascript
{
  id: String,
  username: String,
  email: String,
  password: String,
  projects: [ProjectSchema],
  createdAt: Date,
  updatedAt: Date
}
```

### Template
```javascript
{
  id: String,
  name: String,
  description: String,
  components: [ComponentSchema],
  isPublic: Boolean,
  tags: [String],
  userId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## Development

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (v6 or higher)

### Installation
```bash
cd server
npm install
```

### Environment Variables
Create a `.env` file in the server directory:
```
MONGODB_URI=mongodb://localhost:27017/lowcode-platform
PORT=5000
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Running Development Server
```bash
npm run dev
```
Starts the server with nodemon for development

### Running Production Server
```bash
npm start
```
Starts the server in production mode

## Available Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm test`: Run tests
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## Dependencies

### Core
- Express
- Mongoose
- JSON Web Token
- bcryptjs
- cors

### Development
- nodemon
- Jest
- Supertest
- ESLint
- Prettier

## Error Handling

The API uses a consistent error response format:
```javascript
{
  error: {
    message: String,
    code: Number,
    details: Object
  }
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Security

- JWT authentication
- Password hashing with bcrypt
- Request validation
- CORS configuration
- Rate limiting
- Security headers

## Contributing

1. Follow the API documentation
2. Write unit tests
3. Validate request/response schemas
4. Handle errors appropriately
5. Follow security best practices 