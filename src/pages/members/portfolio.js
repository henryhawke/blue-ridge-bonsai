// Blue Ridge Bonsai Society - Member Portfolio Page
// This page displays the bonsai collection for the logged-in member.

import { MembershipSystem } from 'public/js/membership-system.js';
// import wixLocation from 'wix-location';

// Mock Velo APIs
const wixLocation = { to: (url) => console.log(`Navigating to: ${url}`) };

let membershipSystem;
let currentMember;

$w.onReady(function () {
    console.log("🚀 Initializing Member Portfolio Page");
    initializePortfolioPage();
});

async function initializePortfolioPage() {
    membershipSystem = new MembershipSystem();
    currentMember = await membershipSystem.getCurrentMemberProfile();

    if (!currentMember) {
        $w('#mainContainer').html = "<h1>Please log in to view your portfolio.</h1>";
        return;
    }

    createPageStructure();
    displayPortfolio();
    console.log("✅ Member Portfolio Page initialization complete.");
}

function createPageStructure() {
    const pageHTML = `
        <div id="portfolioPageContainer" class="portfolio-page-container">
            <div class="page-header text-center">
                <h1>My Bonsai Portfolio</h1>
                <p>A personal collection for ${currentMember.firstName} ${currentMember.lastName}</p>
            </div>
            <div id="portfolioContainer" class="portfolio-grid">
                <!-- Portfolio items will be rendered here -->
            </div>
        </div>
    `;
    $w('#mainContainer').html(pageHTML);
}

function displayPortfolio() {
    const container = $w('#portfolioContainer');
    const collection = currentMember.bonsaiCollection;

    if (!collection || collection.trim() === "") {
        container.html = "<p>Your portfolio is empty. Add your first tree!</p>";
        return;
    }

    const trees = collection.split(',').map(tree => tree.trim());

    const portfolioHTML = trees.map(treeName => `
        <div class="portfolio-item-card glass-card">
            <div class="portfolio-item-image">
                <img src="https://static.wixstatic.com/media/nsplsh_b28663b715a3461287e134a0a27d94b3~mv2.jpg/v1/fill/w_400,h_300,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/nsplsh_b28663b715a3461287e134a0a27d94b3~mv2.jpg" alt="A placeholder image for a bonsai tree" />
            </div>
            <div class="portfolio-item-content">
                <h3 class="tree-name">${treeName}</h3>
                <p class="tree-species">Species information not yet available.</p>
            </div>
        </div>
    `).join("");

    container.html = portfolioHTML;
}
