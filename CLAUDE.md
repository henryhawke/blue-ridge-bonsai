# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Wix Velo website repository for the Blue Ridge Bonsai Society (BRBS). The site uses Wix's Git Integration & CLI tools for local development and deployment.

## Development Commands

### Core Development Commands
- `npm install` - Install dependencies and sync Wix types
- `wix dev` - Start the Local Editor for real-time testing and development
- `npm run lint` - Run ESLint to check code quality

### Testing & Preview
- Use `wix dev` to test changes in the Local Editor before committing
- The Local Editor syncs with your local IDE for real-time development

## Architecture & Structure

### Wix Velo Framework
This project uses Wix Velo, a full-stack development platform with specific conventions:

**Frontend Architecture:**
- **Page Code** (`src/pages/`): Contains page-specific JavaScript files
  - Files follow the pattern: `{Page Name}.{internal-id}.js`
  - `masterPage.js` contains global site functionality
  - Each page file corresponds to a page in the Wix editor
  - Uses `$w.onReady()` for DOM manipulation and event handling

**Backend Architecture:**
- **Backend Code** (`src/backend/`): Server-side functionality
  - Web modules (`.jsw` files) expose backend functions to frontend
  - `permissions.json` configures function access levels (siteOwner, siteMember, anonymous)
  - Can include `data.js`, `routers.js`, `events.js`, `http-functions.js`, `jobs.config`

**Public Code** (`src/public/`): Shared utility functions accessible across the site

### Import Conventions
- Backend imports: `import { functionName } from 'backend/fileName';`
- Public imports: `import { functionName } from 'public/fileName';`
- **Do not use relative paths** - Wix requires absolute imports from these specific folders

### Page Structure
The site includes pages for:
- Membership management (Join BRBS, My Membership, Account Settings)
- Educational content (Beginner's Guide, Bonsai Knowledge Base, FAQ)
- Community features (Discussion, Groups, Events, Projects)
- E-commerce (Checkout, Plans & Pricing, Paywall)
- Gallery and resources (Photos, Other Resources)

### Configuration Files
- `wix.config.json`: Contains site ID and UI version
- `jsconfig.json`: TypeScript configuration with references to Wix type definitions
- `permissions.json`: Defines access levels for backend web module functions

## Development Workflow

1. **Local Development**: Use `wix dev` to start the Local Editor
2. **Code Changes**: Edit files in your IDE, changes sync automatically
3. **Testing**: Test functionality in the Local Editor before committing
4. **Page Management**: Create/delete pages in the Wix editor, not in the IDE
5. **File Naming**: Never rename page code files - Wix uses these names for page association

## Important Constraints

- Page code files cannot be created locally - must be created in Wix editor
- Page code files should not be renamed - breaks Wix's file association
- All backend web module functions require permission configuration in `permissions.json`
- Import statements must use Wix's absolute path convention, not relative paths
- The main branch is automatically deployed to the live Wix site