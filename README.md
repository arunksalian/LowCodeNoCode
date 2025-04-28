# Low Code No Code Platform

A modern low-code/no-code platform with drag-and-drop functionality, built with React and Node.js. This platform allows users to create web applications without writing code through a visual interface and deploy them instantly to production.

## Features

- **Visual Builder Interface**
  - Drag and drop components
  - Real-time preview
  - Property editor for component customization
  - Multiple component support
  - Component resizing and positioning

- **Authentication & Security**
  - JWT-based authentication
  - Protected routes
  - Secure API endpoints
  - User-specific templates

- **Deployment System**
  - One-click deployment
  - Automatic Next.js app generation
  - Netlify integration
  - Live URL for each template
  - Deployment history tracking

- **Component Library**
  - Form Components
    - Text Input
    - Select Dropdown
    - Checkbox
    - Radio Group
    - Text Area
    - Date Picker
  - Layout Components
    - Container
    - Grid Layout
    - Card
  - Display Components
    - Text Block
    - Button
    - Divider
    - Icon
    - Image
    - Table

- **Advanced Functionality**
  - Component validation rules
  - Conditional logic
  - Responsive layouts
  - Real-time updates
  - Size properties
    - Width and Height
    - Min/Max dimensions
    - Custom units (px, %, vw, vh)
  - Component relationships
  - Property inheritance

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (v6 or higher)
- Git (for deployment)
- A Netlify account (for deployment)

## Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd LowCodeNoCode
   ```

2. Install server dependencies:
   ```bash
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd client
   npm install
   cd ..
   ```

4. Create a `.env` file in the root directory:
   ```
   MONGODB_URI=mongodb://root:example@localhost:27017/lowcode?authSource=admin
   PORT=5000
   JWT_SECRET=your_jwt_secret_here
   ```

## Deployment Configuration

1. **Netlify Setup**
   - Create a Netlify account if you don't have one
   - Install Netlify CLI:
     ```bash
     npm install -g netlify-cli
     ```
   - Login to Netlify:
     ```bash
     netlify login
     ```

2. **Environment Variables**
   Add these to your Netlify site settings:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

## Running the Application

1. Make sure MongoDB is running on your system

2. Start the development servers:
   ```bash
   npm run dev
   ```
   This will start:
   - Backend server on port 5000
   - Frontend development server on port 3000

## Using the Platform

### Authentication
1. **Register/Login**
   - Default admin credentials:
     - Email: admin@example.com
     - Password: admin123
   - Create new account using the registration form
   - Login to access protected features

### Template Management
1. **Creating Templates**
   - Click 'New Template' button
   - Add a name and description
   - Set visibility (public/private)
   - Save your template

2. **Deploying Templates**
   - Open a template
   - Click 'Deploy Template' button
   - Wait for deployment to complete
   - Access your live template using the provided URL

### Basic Operations
1. **Adding Components**
   - Drag components from the left panel
   - Drop them onto the canvas
   - Multiple components can be added
   - Components can be positioned anywhere

2. **Editing Components**
   - Click on a component to select it
   - Use the right panel to edit properties
   - Changes are applied in real-time

3. **Size Properties**
   - Control component dimensions
   - Set width and height
   - Define min/max dimensions
   - Use different units (px, %, vw, vh)
   - Example values:
     - "100px" for fixed size
     - "50%" for relative size
     - "auto" for automatic sizing

4. **Validation Rules**
   - Set required fields
   - Define min/max length
   - Add custom validation patterns
   - Create conditional validation

### Component Types

1. **Form Components**
   - Text Input: For text entry
   - Select: Dropdown selection
   - Checkbox: Boolean selection
   - Radio: Multiple choice
   - Text Area: Long text input
   - Date Picker: Date selection

2. **Layout Components**
   - Container: Group components
   - Grid: Create layouts
   - Card: Display content in cards

3. **Display Components**
   - Text: Display text content
   - Button: Interactive buttons
   - Divider: Visual separation
   - Icon: Display icons
   - Image: Show images
   - Table: Display tabular data

## Troubleshooting

### Port Already in Use

If you see "Something is already running on port 3000" or "address already in use :::5000":

1. Find and stop the process using the port:
   ```bash
   # For Windows
   netstat -ano | findstr :5000
   netstat -ano | findstr :3000
   taskkill /PID [PID] /F

   # For Linux/Mac
   lsof -i :5000
   lsof -i :3000
   kill -9 [PID]
   ```

2. Or use different ports by updating:
   - `.env` file for backend
   - `client/package.json` proxy setting
   - `server/index.js` port variable

### Material-UI Issues

If you encounter Material-UI related errors:

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules
   rm -rf client/node_modules
   npm install
   cd client && npm install
   ```

2. Make sure all Material-UI imports are from @mui/* packages:
   ```javascript
   // Correct imports
   import { Button } from '@mui/material';
   import { styled } from '@mui/material/styles';
   ```

## Project Structure

```
LowCodeNoCode/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── utils/         # Utility functions
│   │   └── App.js         # Main React component
│   └── package.json       # Frontend dependencies
├── server/                # Node.js backend
│   ├── routes/           # API routes
│   ├── models/           # MongoDB models
│   └── index.js          # Server entry point
└── package.json          # Backend dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
