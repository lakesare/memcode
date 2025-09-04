# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Memcode is an open-source flashcards application built with React frontend and Node.js/Express backend. It uses PostgreSQL for persistence and supports spaced repetition learning. The project also includes a secondary application called **Meresei** - a calendar app for non-24 sleep wake disorder - that runs on the same infrastructure using virtual host routing.

## Development Commands

### Database Setup
```bash
# Create/reset development database
make db-reset

# Drop database
make db-drop

# Run specific migration
make db-migrate

# Dump database for backup
make db-dump

# Restore from dump
make db-restore
```

### Development Server
```bash
# Start backend development server with hot reload and debugging
make start

# Start frontend webpack compilation with hot reload 
make frontend-webpack

# Both commands should be run simultaneously for full development
```

### Testing
```bash
# Run backend tests
make test-backend

# Run frontend tests
make test-frontend

# Reset test database
make test-db-reset
```

**Note on Testing**: This project has minimal tests by design. Only a few critical utility functions have tests. Do not write new tests unless specifically requested - the project prioritizes rapid development and manual testing over comprehensive test coverage.

### Production/Heroku Commands
```bash
# Deploy to Heroku
make heroku-deploy

# Build for production (automatically run on Heroku)
make heroku-postbuild

# Access Heroku database console
make heroku-db-console

# Pull production database to local
make heroku-db-pull
```

## Architecture Overview

### Dual Application Setup
The codebase hosts two applications using virtual host routing:
- **Memcode** (main flashcards app): Default routes and memcode.com
- **Meresei** (calendar for non-24 sleep wake disorder): Routed via vhost for meresei.com domains

Both applications are deployed on the same Heroku server but serve completely different purposes and user bases.

### Backend Architecture (Node.js/Express)
- **Entry Point**: `backend/index.js` - Sets up vhost routing and starts server
- **API Layer**: Dynamic controller routing via `/api/:controllerName.:methodName`
- **Database**: PostgreSQL with Knex (migrating from pg-promise)
- **Models**: Located in `backend/models/` with dedicated model classes
- **Path Aliases**: Uses `#~/` for backend imports (configured in package.json)

Key backend concepts:
- Controllers follow naming pattern (e.g., `CourseApi`, `UserApi`)
- Middleware pipeline: SSL redirect → CORS → authentication → error handling
- Spaced repetition algorithm for flashcard scheduling
- **Database Migration**: Currently transitioning from pg-promise to Knex query builder

### API Response Pattern
All backend endpoints should use standardized response methods:
```javascript
response.success(obj)      // 200 status with data object
response.error(string)     // 500 status with error message  
response.validation(array) // 400 status with validation errors
```

These are injected by the `injectResponseTypes` middleware.

### Frontend Architecture (React/Redux)
- **Entry Point**: `frontend/index.js` - React app with Redux store
- **Build System**: Webpack with separate dev/production configs
- **State Management**: Redux with connected components
- **Routing**: React Router for SPA navigation
- **Path Aliases**: Uses `~/` for frontend imports

Key frontend concepts:
- Page components in `frontend/pages/` correspond to routes
- Reusable components in `frontend/components/` and `frontend/appComponents/`
- API calls through centralized services in `frontend/api/`
- CSS modules and SCSS for styling

### CSS and Styling
The project uses CSS modules with SCSS for component styling. Follow these patterns:

#### CSS Modules Pattern
```scss
// Single :local() wrapper per component
:local(.componentName) {
  .childClass {
    // styles
  }
  
  .anotherChild {
    // nested styles
    
    .deeplyNested {
      // deep nesting is preferred
      
      &:hover {
        // pseudo-selectors
      }
    }
  }
}
```

#### Component Usage
```jsx
import css from './index.scss';

// Only the main wrapper uses css object
<div className={css.componentName}>
  {/* All nested elements use string classNames */}
  <div className="childClass">
    <div className="anotherChild">
      <div className="deeplyNested">Content</div>
    </div>
  </div>
</div>
```

#### Styling Guidelines
- **Single :local() wrapper** - Only one per component file
- **Deep nesting preferred** - Unlike some CSS traditions, we embrace deep nesting for component isolation
- **String classNames** - Use string literals for nested classes, not `css.className`
- **SCSS features** - Use variables, mixins, and nesting as needed
- **Component-scoped** - All styles are automatically scoped to prevent conflicts

### Database Schema
Core entities:
- **Users**: OAuth-based authentication (GitHub/Google)
- **Courses**: Flashcard collections with categories
- **Problems**: Individual flashcards with different types
- **Learning Progress**: Spaced repetition tracking with easiness factors
- **Notifications**: User activity notifications

### Database Query Migration
- **Legacy**: pg-promise with raw SQL queries
- **Current**: Knex query builder with knex-stringcase for camelCase conversion
- **Pattern**: New API routes should use Knex, old ones gradually being migrated

## Development Workflow

### Environment Setup
1. Copy `env.example.js` to `env.js` and fill required values
2. Set up PostgreSQL with user 'postgres' and password 'postgres'
3. Run `make db-reset` to create database schema
4. Run `npm install` to install dependencies

### Development Process
1. Start backend: `make start` (runs on port 3000 with nodemon)
2. Start frontend build: `make frontend-webpack` (watches for changes)
3. Access app at `http://localhost:3000`

### Code Style
- ESLint configured with Airbnb style guide (extensive customizations in `.eslintrc.js`)
- Relaxed rules for development velocity over strict adherence
- Supports both class and functional React components
- **DO NOT use `export const`** - Always use default exports or named exports in object form

### Testing Philosophy
- Minimal test coverage by design - only critical utility functions are tested
- Focus on manual testing and rapid iteration
- Do not write new tests unless explicitly requested

## Key Technical Details

### Authentication
Uses OAuth providers (GitHub, Google) with JWT tokens for session management.

### File Uploads
Images uploaded to AWS S3 with multer-s3 integration.

### Offline Support
Service worker registered for production builds to enable offline flashcard review.

### Multi-App Deployment
Single deployment supports both Memcode and Meresei apps through vhost routing, allowing domain-based application switching.

### Build Process
- Frontend: Webpack compilation to `backend/webpacked/` for serving
- Backend: ES modules with import/export syntax
- Production: Heroku-compatible with automatic builds

## Common Patterns

### API Endpoints
- **Prefer dynamic routing**: `/api/CourseApi.getPublicCourses` over traditional REST
- Dynamic routing: `/api/CourseApi.getPublicCourses`
- Traditional REST: `/api/courses/:id` (legacy pattern)
- Both GET and POST supported for API calls
- Always use standardized response methods: `response.success()`, `response.error()`, and `response.validation()`

#### API Response Examples
```javascript
// Success response (200)
response.success({ user: userData, token: jwtToken });

// Server error response (500)
response.error('Database connection failed');

// Validation error response (400)
response.validation([
  'Username is required',
  'Email must be valid',
  'Password must be at least 6 characters'
]);
```

### Database Queries
- **Always use Knex**: New development should exclusively use Knex query builder from `#~/db/knex.js`
- **Legacy routes**: pg-promise queries (being phased out - do not use for new code)
- Snake_case in database, camelCase in application code via knex-stringcase
- Transaction support for complex operations

### State Management
- Redux store with thunk middleware
- Connected components pattern
- Local component state for UI-only concerns

### Frontend Patterns

#### SPE (Status/Payload/Error) Pattern
The codebase uses a consistent SPE pattern for managing async operations and API calls:

```javascript
// State management
state = {
  speApiCall: {} // Empty object initially
}

// API call with SPE dispatch
api.SomeApi.someMethod(
  (speApiCall) => this.setState({ speApiCall }),
  requestData
)

// SPE object structure:
// - status: 'request' | 'success' | 'failure' | undefined
// - payload: data (on success)
// - error: error message (on failure)
```

#### Loading Component Pattern
Use the Loading component to handle different states automatically:

```jsx
import Loading from '~/components/Loading';

// Basic usage - handles request/success/failure states
<Loading spe={this.state.speApiCall}>
  Content to show on success
</Loading>

// With payload access
<Loading spe={this.state.speApiCall}>{(payload) =>
  <div>{payload.someData}</div>
}</Loading>

// Show only specific states
<Loading enabledStatuses={['failure']} spe={this.state.speApiCall} />
<Loading enabledStatuses={['success', 'error']} spe={this.state.speApiCall} />
```

#### Standard Form Pattern
Consistent form state management and input handling:

```javascript
// Form state management
state = {
  formState: {
    field1: '',
    field2: ''
  }
}

// Input props helper
inputProps = () => ({
  formState: this.state.formState,
  updateFormState: (formState) => this.setState({ formState })
})

// Usage in render
<TextInput {...this.inputProps()} label="Field 1" name="field1" />
<TextInput {...this.inputProps()} label="Field 2" name="field2" type="email" />
```

#### Form Submission with SPE
Combine forms with SPE pattern for clean submit handling:

```javascript
handleSubmit = (event) => {
  event.preventDefault();
  
  // Prevent double submission
  if (this.state.speSubmit.status === 'request') return;

  api.SomeApi.submit(
    (speSubmit) => {
      this.setState({ speSubmit });
      if (speSubmit.status === 'success') {
        // Handle success (redirect, close modal, etc.)
      }
    },
    this.state.formState
  );
}

// In render - button state and error display
<Loading enabledStatuses={['failure']} spe={this.state.speSubmit} />
<button 
  disabled={this.state.speSubmit.status === 'request'}
  type="submit"
>
  {this.state.speSubmit.status === 'request' ? 'Loading...' : 'Submit'}
</button>
```

## Development Tips

- Use `make` commands rather than direct npm/node commands
- Database resets are safe and fast for development
- Frontend hot reload works through webpack dev config
- Backend auto-restart via nodemon for file changes
- Manual testing is preferred over writing automated tests
- When creating new API endpoints, use Knex instead of pg-promise
- Always use the standardized response methods (`.success`, `.error`, `.validation`)

## Meresei Integration

Meresei is a separate application for managing non-24 sleep wake disorder calendars. It:
- Shares the same server infrastructure as Memcode
- Uses virtual host routing for domain separation
- Has its own frontend build system (`meresei/frontend/`)
- Is completely independent in terms of functionality and user base
