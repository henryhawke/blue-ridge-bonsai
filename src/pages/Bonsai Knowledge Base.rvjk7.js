import { authentication } from "wix-members-frontend";
import wixData from "wix-data";

$w.onReady(async function () {
  const isLoggedIn = authentication.loggedIn();
  // @ts-ignore - dataset ID is defined in the Wix editor for this page.
  const learningResourcesDataset = $w("#learningResourcesDataset");

  if (
    typeof learningResourcesDataset?.onReady !== "function" ||
    typeof learningResourcesDataset?.setFilter !== "function"
  ) {
    console.error(
      'Expected "#learningResourcesDataset" to be a Wix dataset element.',
    );
    return;
  }

  learningResourcesDataset.onReady(async () => {
    const filter = isLoggedIn
      ? wixData.filter()
      : wixData.filter().eq("membersOnly", false);

    await learningResourcesDataset.setFilter(filter);
  });
});
