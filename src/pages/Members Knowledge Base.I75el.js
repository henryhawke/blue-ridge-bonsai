import wixUsers from 'wix-users';
import wixData from 'wix-data';

$w.onReady(async function () {
    const isLoggedIn = wixUsers.currentUser.loggedIn;
    // @ts-ignore - dataset ID is defined in the Wix editor for this page.
    const learningResourcesDataset = $w('#learningResourcesDataset');

    if (!isLoggedIn) {
        await learningResourcesDataset.setFilter(
            wixData.filter().eq('membersOnly', false)
        );
    } else {
        await learningResourcesDataset.setFilter(wixData.filter());
    }
});
