// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

// TESTING
import { authentication } from "wix-members-frontend";
import wixData from "wix-data";

$w.onReady(async function () {
  const isLoggedIn = authentication.loggedIn();
  // @ts-ignore - dataset ID is defined in the Wix editor for this page.
  const learningResourcesDataset = $w("#dataset1");

  if (
    typeof learningResourcesDataset?.onReady !== "function" ||
    typeof learningResourcesDataset?.setFilter !== "function"
  ) {
    console.error('Expected "#LearningResources" to be a Wix dataset element.');
    return;
  }

  learningResourcesDataset.onReady(async () => {
    const filter = isLoggedIn
      ? wixData.filter()
      : wixData.filter().eq("membersOnly", false);
    const filterDescription = isLoggedIn
      ? "no items were filtered out because the member is logged in"
      : 'items with "membersOnly" set to true were filtered out';

    await learningResourcesDataset.setFilter(filter);
    console.log(
      `[Member Knowledge Base] Successfully applied dataset filter: ${filterDescription}.`,
    );
  });
});
