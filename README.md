# Blue Ridge Bonsai Society 🌸

This repository contains the code for the Blue Ridge Bonsai Society website, built on the Wix platform and using Velo.

This guide provides the correct instructions for setting up your local development environment, making changes, and seeing them on your Wix site.

**Please follow these instructions carefully. Previous documentation in this repository was incorrect.**

## Why Get Wix Studio?

Wix Studio is essential for professional web development and design work. Here's why you need a Wix Studio account for basic development tasks:

### **Advanced Development Capabilities**

- **Custom Code Integration**: Add custom JavaScript, CSS, and HTML directly to your site
- **API Development**: Build custom backend functionality with Velo's serverless architecture
- **Database Management**: Create and manage custom databases for dynamic content
- **Third-party Integrations**: Connect external services and APIs seamlessly

### **Professional Design Tools**

- **375+ Professional Templates**: Industry-specific templates with built-in business tools
- **Advanced Design System**: Custom design tokens, component libraries, and responsive layouts
- **Animation & Interactions**: Create sophisticated micro-interactions and animations
- **Advanced Typography**: Custom font integration and advanced text styling

### **Development Workflow**

- **Local Development**: Use the Wix CLI for local development with real-time preview
- **Version Control**: Git integration for collaborative development
- **Code Editor**: Built-in code editor with syntax highlighting and debugging
- **Live Preview**: Real-time preview of changes during development

### **Performance & SEO**

- **Optimized Performance**: Built-in performance optimization and caching
- **SEO Tools**: Advanced SEO management and optimization features
- **CDN Integration**: Global content delivery network for fast loading
- **Mobile Optimization**: Automatic mobile responsiveness and optimization

### **Business & E-commerce Features**

- **Advanced E-commerce**: Multi-channel selling, inventory management, and payment processing
- **Booking Systems**: Custom booking and appointment scheduling
- **Member Management**: Advanced user management and authentication
- **Analytics & Tracking**: Comprehensive analytics and conversion tracking

### **Collaboration & Management**

- **Team Collaboration**: Multi-user access with role-based permissions
- **Client Management**: Professional client handoff and management tools
- **Project Management**: Built-in project tracking and milestone management
- **White-label Solutions**: Brand customization for agencies

### **Security & Reliability**

- **Enterprise Security**: SSL certificates, DDoS protection, and security monitoring
- **99.9% Uptime**: Reliable hosting with guaranteed uptime
- **Backup & Recovery**: Automatic backups and disaster recovery
- **GDPR Compliance**: Built-in privacy and data protection features

### **Support & Resources**

- **Developer Community**: Active community with forums, tutorials, and webinars
- **Technical Support**: Priority support for Studio users
- **Documentation**: Comprehensive API and development documentation
- **Learning Resources**: Tutorials, courses, and best practices

**Without Wix Studio, you're limited to basic drag-and-drop functionality and cannot access the advanced development features needed for professional websites like the Blue Ridge Bonsai Society.**

## Wix Studio Development Environment Setup

This guide will help you set up a complete Wix Studio development environment for professional web development.

### **Prerequisites**

Before setting up your Wix Studio development environment, ensure you have:

- **Node.js** (v18.16.0 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/download)
- **Wix Studio Account** - [Sign up here](https://www.wix.com/studio)
- **Code Editor** (VS Code recommended) - [Download here](https://code.visualstudio.com/)

### **Step 1: Install Wix CLI**

The Wix Command Line Interface (CLI) is essential for local development:

```bash
# Install Wix CLI globally
npm install -g @wix/cli

# Verify installation
wix --version
```

### **Step 2: Authenticate with Wix**

Connect your local environment to your Wix Studio account:

```bash
# Login to your Wix account
wix login

# This will open your browser for authentication
# Follow the prompts to complete the login process
```

### **Step 3: Set Up Your Development Site**

Create a new development site or connect to an existing one:

```bash
# Create a new development site
wix create-site

# Or connect to an existing site
wix connect-site

# List your available sites
wix sites list
```

### **Step 4: Clone Your Site Repository**

If your site is connected to Git, clone the repository:

```bash
# Clone your site's repository
git clone <your-site-repository-url>
cd <your-site-directory>

# Install dependencies
npm install
```

### **Step 5: Start Local Development**

Launch your local development environment:

```bash
# Start the local development server
wix dev

# This will:
# - Open the Wix Local Editor
# - Watch for file changes
# - Provide real-time preview
# - Enable hot reloading
```

### **Step 6: Configure Your IDE**

Set up your preferred code editor for optimal development:

#### **VS Code Setup**

```json
// .vscode/settings.json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

#### **Recommended VS Code Extensions**

- **Wix Velo** - Official Wix Velo extension
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **GitLens** - Git integration
- **Auto Rename Tag** - HTML/XML tag editing

### **Step 7: Development Workflow**

#### **File Structure**

```
your-wix-site/
├── src/
│   ├── pages/           # Page-specific code
│   ├── public/          # Static assets
│   │   ├── js/         # JavaScript files
│   │   ├── styles/     # CSS files
│   │   └── global.css  # Global styles
│   └── backend/        # Backend code
├── package.json
├── wix.config.json
└── README.md
```

#### **Development Commands**

```bash
# Start development server
wix dev

# Build for production
wix build

# Deploy to staging
wix deploy --stage

# Deploy to production
wix deploy --prod

# View deployment status
wix deployments list
```

### **Step 8: Version Control Setup**

Set up Git for collaborative development:

```bash
# Initialize Git repository (if not already done)
git init

# Add your files
git add .

# Create initial commit
git commit -m "Initial commit"

# Connect to remote repository
git remote add origin <your-repository-url>
git push -u origin main
```

### **Step 9: Environment Configuration**

Create environment-specific configurations:

```bash
# Create environment files
touch .env.local
touch .env.staging
touch .env.production
```

#### **Environment Variables**

```bash
# .env.local
WIX_SITE_ID=your-site-id
WIX_API_KEY=your-api-key
NODE_ENV=development

# .env.staging
WIX_SITE_ID=your-staging-site-id
NODE_ENV=staging

# .env.production
WIX_SITE_ID=your-production-site-id
NODE_ENV=production
```

### **Step 10: Testing and Quality Assurance**

Set up testing and code quality tools:

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/jest-dom

# Install linting tools
npm install --save-dev eslint prettier

# Install type checking
npm install --save-dev typescript @types/node
```

#### **Testing Configuration**

```json
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}
```

### **Step 11: Deployment Pipeline**

Set up automated deployment workflows:

#### **GitHub Actions Example**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Wix Studio

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm install
      - run: npm run build
      - run: wix deploy --prod
        env:
          WIX_API_KEY: ${{ secrets.WIX_API_KEY }}
```

### **Step 12: Performance Optimization**

Configure your site for optimal performance:

#### **Build Optimization**

```json
// wix.config.json
{
  "build": {
    "minify": true,
    "sourceMaps": false,
    "optimizeImages": true
  },
  "performance": {
    "lazyLoading": true,
    "codeSplitting": true
  }
}
```

### **Troubleshooting Common Issues**

#### **CLI Installation Issues**

```bash
# Clear npm cache
npm cache clean --force

# Reinstall Wix CLI
npm uninstall -g @wix/cli
npm install -g @wix/cli
```

#### **Authentication Issues**

```bash
# Clear authentication cache
wix logout
wix login
```

#### **Development Server Issues**

```bash
# Clear development cache
wix dev --clear-cache

# Restart development server
wix dev --force
```

### **Best Practices**

1. **Code Organization**

   - Use modular architecture
   - Separate concerns (UI, logic, data)
   - Follow consistent naming conventions

2. **Version Control**

   - Commit frequently with descriptive messages
   - Use feature branches for new development
   - Review code before merging

3. **Testing**

   - Write unit tests for critical functions
   - Test across different browsers
   - Validate responsive design

4. **Performance**

   - Optimize images and assets
   - Minimize bundle size
   - Use lazy loading where appropriate

5. **Security**
   - Never commit sensitive data
   - Use environment variables for secrets
   - Validate user inputs

### **Resources and Support**

- **Official Documentation**: [dev.wix.com](https://dev.wix.com)
- **Wix Studio Community**: [community.wix.com](https://community.wix.com)
- **CLI Documentation**: [dev.wix.com/docs/build-apps/developer-tools/cli](https://dev.wix.com/docs/build-apps/developer-tools/cli)
- **Velo API Reference**: [dev.wix.com/docs/velo](https://dev.wix.com/docs/velo)

## How Velo Integration Works

Your Wix site is connected to this GitHub repository. However, simply committing and pushing changes to the `main` branch is **not** enough to make them appear on your live site.

You must use the **Wix Local Editor** to see your code changes and then **publish** the site from the Wix Editor to make them live.

## Step 1: Set Up Your Local Environment

First, you need to set up your computer to work with Velo.

1.  **Install Prerequisites:**

    - [Git](https://git-scm.com/download)
    - [Node.js](https://nodejs.org/en/download/) (version 14.8 or later)
    - [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (comes with Node.js)

2.  **Clone the Repository:**
    Open your terminal, navigate to where you want to store your project, and run:

    ```bash
    git clone <your-repository-url>
    cd <repository-directory-name>
    ```

3.  **Install Dependencies:**
    Install the necessary packages for the project:

    ```bash
    npm install
    ```

4.  **Install the Wix CLI:**
    The Wix Command Line Interface (CLI) is required to work with your site locally. Install it globally:
    ```bash
    npm install -g @wix/cli
    ```

## Step 2: Start the Local Development Server

The Wix Local Editor is a local version of the Wix Editor that runs on your computer and syncs with your local code files. This is where you will see your changes reflected in real-time.

1.  **Log in to Wix:**
    In your terminal, run the following command to log in to your Wix account:

    ```bash
    wix login
    ```

    This will open a browser window for you to log in.

2.  **Start the Dev Server:**
    From the root directory of your project, run:
    ```bash
    wix dev
    ```
    This command will do two things:
    - It will open the **Wix Local Editor** on your computer.
    - It will watch your local files for changes and sync them with the Local Editor instantly.

## Step 3: Making and Viewing Code Changes

Now you can start coding!

1.  **Edit the Code:**
    Open the project in your favorite code editor (like VS Code). You can now edit the files in the `src` directory. For example, you can change styles in `src/public/global.css` or add logic to `src/pages/masterPage.js`.

2.  **View Changes in the Local Editor:**
    As you save your files, the `wix dev` command will automatically sync them to the Local Editor. You can see your changes reflected there immediately. Use the "Preview" mode in the Local Editor to see the site as a visitor would.

    This is the primary way you should be developing and testing your code.

## Step 4: Publishing Your Site

When you are happy with your changes in the Local Editor, you need to publish them to make them live on your actual website.

1.  **Sync to the Wix Editor:**
    In the Local Editor, your changes are synced automatically. You can open your live site editor on wix.com to see the changes there as well.

2.  **Publish:**
    Click the **Publish** button in the main Wix Editor (the one in your browser) to make your changes live for everyone to see.

## Summary of the Correct Workflow

1.  Run `wix dev` in your terminal.
2.  Edit code in your local IDE.
3.  See changes in the Local Editor that opened.
4.  When ready, go to the main Wix Editor online and click **Publish**.

---

This repository has been updated to use a simpler, more robust method for applying styles and custom functionality that follows Velo best practices. The previous complex "workaround system" has been removed.
