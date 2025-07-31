# Blue Ridge Bonsai Society 🌸

This repository contains the code for the Blue Ridge Bonsai Society website, built on the Wix platform and using Velo.

This guide provides the correct instructions for setting up your local development environment, making changes, and seeing them on your Wix site.

**Please follow these instructions carefully. Previous documentation in this repository was incorrect.**

## How Velo Integration Works

Your Wix site is connected to this GitHub repository. However, simply committing and pushing changes to the `main` branch is **not** enough to make them appear on your live site.

You must use the **Wix Local Editor** to see your code changes and then **publish** the site from the Wix Editor to make them live.

## Step 1: Set Up Your Local Environment

First, you need to set up your computer to work with Velo.

1.  **Install Prerequisites:**
    *   [Git](https://git-scm.com/download)
    *   [Node.js](https://nodejs.org/en/download/) (version 14.8 or later)
    *   [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (comes with Node.js)

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
    *   It will open the **Wix Local Editor** on your computer.
    *   It will watch your local files for changes and sync them with the Local Editor instantly.

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
