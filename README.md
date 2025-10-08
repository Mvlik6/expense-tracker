# ExpenseTracker

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.3.

## Docker Deployment

This application is containerized using Docker for easy deployment and scaling.

### Prerequisites

- Docker
- Docker Compose (optional, for easier management)

### Quick Start with Docker

1. **Build and run with Docker Compose (Recommended):**
   ```bash
   docker-compose up --build
   ```
   The application will be available at `http://localhost:4200`

2. **Build and run with Docker directly:**
   ```bash
   # Build the image
   docker build -t expense-tracker .
   
   # Run the container
   docker run -p 4200:80 expense-tracker
   ```

3. **Stop the application:**
   ```bash
   # With Docker Compose
   docker-compose down
   
   # With Docker directly
   docker stop <container-id>
   ```

### Docker Features

- **Multi-stage build**: Optimized for production with minimal final image size
- **Nginx server**: High-performance web server with gzip compression and caching
- **Health checks**: Built-in health monitoring
- **Security headers**: Enhanced security configuration
- **Angular routing support**: Proper handling of client-side routing

### Development

For development, you can still use the Angular CLI:

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
