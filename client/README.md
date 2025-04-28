# Low Code No Code Platform - Frontend

The frontend of the Low Code No Code Platform is built with React and Material-UI, providing a modern and intuitive interface for building web applications without code.

## Directory Structure

```
client/
├── src/
│   ├── components/           # React components
│   │   ├── PropertyEditor.js # Component property editor
│   │   ├── RenderComponent.js# Component renderer
│   │   └── ...
│   ├── utils/               # Utility functions
│   │   ├── validation.js    # Form validation
│   │   └── ...
│   ├── styles/              # Styling files
│   └── App.js              # Main React component
├── public/                 # Static files
└── package.json           # Frontend dependencies
```

## Key Components

### PropertyEditor
- Manages component properties and settings
- Supports various input types:
  - Text fields
  - Dropdowns
  - Checkboxes
  - Date pickers
- Handles validation rules
- Manages component sizing
- Supports conditional logic

### RenderComponent
- Renders different component types
- Supports:
  - Form components (Input, Select, etc.)
  - Layout components (Container, Grid, etc.)
  - Display components (Text, Button, etc.)
- Handles component styling
- Manages component state
- Implements validation logic

## Component Properties

### Size Properties
- Width and Height
- Min/Max dimensions
- Supported units:
  - Pixels (px)
  - Percentage (%)
  - Viewport width (vw)
  - Viewport height (vh)
  - Auto

### Validation Properties
- Required fields
- Min/Max length
- Pattern matching
- Custom validation
- Conditional validation
- Cross-field validation

### Style Properties
- Colors
- Typography
- Spacing
- Borders
- Shadows
- Custom CSS

## Development

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation
```bash
cd client
npm install
```

### Running Development Server
```bash
npm start
```
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### Building for Production
```bash
npm run build
```
Creates optimized production build in `build` folder

### Testing
```bash
npm test
```
Runs the test suite

## Available Scripts

- `npm start`: Start development server
- `npm test`: Run tests
- `npm run build`: Create production build
- `npm run eject`: Eject from Create React App
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## Dependencies

### Core
- React
- React DOM
- React Router

### UI Framework
- @mui/material
- @mui/icons-material
- @mui/x-date-pickers
- @emotion/react
- @emotion/styled

### Development
- TypeScript
- ESLint
- Prettier
- Jest
- Testing Library

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the code style guidelines
2. Write meaningful commit messages
3. Add tests for new features
4. Update documentation as needed
5. Create pull requests for review

## Template Management

### Saving Templates
1. **Save Current Layout**
   - Click the "Save Template" button in the top toolbar
   - Enter a template name and description
   - Choose visibility (private/public)
   - Click "Save"

2. **Template Properties**
   ```javascript
   {
     name: String,
     description: String,
     components: [ComponentSchema],
     isPublic: Boolean,
     tags: [String],
     createdAt: Date,
     updatedAt: Date
   }
   ```

### Using Templates
1. **Load Template**
   - Click "Templates" in the sidebar
   - Browse available templates
   - Click "Use Template" to load
   - Customize as needed

2. **Template Categories**
   - Form Templates
   - Dashboard Templates
   - Landing Page Templates
   - Custom Templates

### Template Actions
- Save as New Template
- Export Template
- Share Template
- Delete Template
- Duplicate Template 