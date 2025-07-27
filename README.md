# Blue Ridge Bonsai Society Website 🌸
## Phase 2: Atmospheric UI & Design System - COMPLETE ✅

### 🌟 Advanced Bonsai-Themed Website with Liquid Glass Navigation

This is the Blue Ridge Bonsai Society website built with Wix Velo, featuring cutting-edge atmospheric UI design, liquid glass navigation, and comprehensive accessibility.

## Set up this repository in your IDE
This repo is connected to a Wix site. That site tracks this repo's default branch. Any code committed and pushed to that branch from your local IDE appears on the site.

Before getting started, make sure you have the following things installed:
* [Git](https://git-scm.com/download)
* [Node](https://nodejs.org/en/download/), version 14.8 or later.
* [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) or [yarn](https://yarnpkg.com/getting-started/install)
* An SSH key [added to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).

To set up your local environment and start coding locally, do the following:

1. Open your terminal and navigate to where you want to store the repo.
1. Clone the repo by running `git clone <your-repository-url>`.
1. Navigate to the repo's directory by running `cd <directory-name>`.
1. Install the repo's dependencies by running `npm install` or `yarn install`.
1. Install the Wix CLI by running `npm install -g @wix/cli` or `yarn global add @wix/cli`.  
   Once you've installed the CLI globally, you can use it with any Wix site's repo.

For more information, see [Setting up Git Integration & Wix CLI](https://support.wix.com/en/article/velo-setting-up-git-integration-wix-cli-beta).

## Write Velo code in your IDE
Once your repo is set up, you can write code in it as you would in any other non-Wix project. The repo's file structure matches the [public](https://support.wix.com/en/article/velo-working-with-the-velo-sidebar#public), [backend](https://support.wix.com/en/article/velo-working-with-the-velo-sidebar#backend), and [page code](https://support.wix.com/en/article/velo-working-with-the-velo-sidebar#page-code) sections in Editor X.

Learn more about [this repo's file structure](https://support.wix.com/en/article/velo-understanding-your-sites-github-repository-beta).

## Test your code with the Local Editor
The Local Editor allows you test changes made to your site in real time. The code in your local IDE is synced with the Local Editor, so you can test your changes before committing them to your repo. You can also change the site design in the Local Editor and sync it with your IDE.

Start the Local Editor by navigating to this repo's directory in your terminal and running `wix dev`.

For more information, see [Working with the Local Editor](https://support.wix.com/en/article/velo-working-with-the-local-editor-beta).

## Preview and publish with the Wix CLI
The Wix CLI is a tool that allows you to work with your site locally from your computer's terminal. You can use it to build a preview version of your site and publish it. You can also use the CLI to install [approved npm packages](https://support.wix.com/en/article/velo-working-with-npm-packages) to your site.

Learn more about [working with the Wix CLI](https://support.wix.com/en/article/velo-working-with-the-wix-cli-beta).

## 🚀 Features Implemented

**Phase 1: Liquid Glass Navigation & Information Architecture**
- ✅ Advanced liquid glass navigation with backdrop-filter effects
- ✅ Content-aware theming and auto-hide functionality  
- ✅ Complete information architecture with 50+ mapped pages
- ✅ Comprehensive accessibility (WCAG 2.1 AA compliance)
- ✅ Wix Velo integration with member authentication

**Phase 2: Atmospheric UI & Design System**
- ✅ Comprehensive design system with Blue Ridge color palette
- ✅ Glassmorphism components (cards, buttons, modals, forms)
- ✅ Advanced animation system with performance optimization
- ✅ Responsive grid and layout system
- ✅ Micro-interactions and hover effects
- ✅ Interactive component library with auto-initialization
- ✅ Seasonal atmospheric effects (floating leaves/petals)
- ✅ Time-based theming (morning/day/evening)

## 🎨 Design System

**Color Palette:**
- Primary: Mountain Sage (#6B8E6F)
- Secondary: Cloud White (#FEFFFE), Mountain Haze (#E8EDE9)
- Accent: Autumn Gold (#D4A574)
- Semantic: Success, Warning, Error, Info colors

**Typography:**
- Font: Inter (300-800 weights)
- Modular scale (1.250 ratio)
- Responsive sizing

**Components:**
- Glass Cards (12+ variants)
- Atmospheric Buttons
- Interactive Forms
- Progress Indicators
- Notifications/Toasts
- Modals with backdrop effects

## 📱 Usage for Wix Elements

```html
<!-- Convert any element to a glass card -->
<div data-card-type="feature" data-component="card">Content</div>

<!-- Make buttons atmospheric -->
<button data-component="button" data-variant="primary">Click Me</button>

<!-- Add progress bars -->
<div data-component="progress" data-progress="75" data-progress-max="100"></div>
```

## 🌐 Live Integration

The website automatically applies:

1. **Atmospheric Theming**: Pages detect theme based on content
2. **Seasonal Effects**: Animations change based on current month
3. **Time-based Adjustments**: Different looks for morning/day/evening
4. **Component Auto-Discovery**: Elements become interactive automatically
5. **Full Accessibility**: WCAG 2.1 AA compliance with screen reader support

## 📊 Performance & Accessibility

- Hardware-accelerated animations
- Intersection Observers for scroll effects
- WCAG 2.1 AA compliant
- Screen reader support
- Keyboard navigation
- Reduced motion preferences
- High contrast mode support

**Ready for real-time viewing in Wix Studio! 🚀**
