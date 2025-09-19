// @ts-nocheck
import wixLocation from "wix-location-frontend";
import { GallerySystem } from "public/js/gdrive-gallery.js";

export async function initPhotosPage() {
  try {
    const repeater = $w("#galleriesRepeater");
    if (!repeater) {
      console.warn(
        "initPhotosPage: #galleriesRepeater not found. Add it in the Editor."
      );
      return;
    }

    // Optional skeleton states
    showIfExists("#loadingBox");
    hideIfExists("#emptyStateBox");

    repeater.data = [];
    const gallerySystem = new GallerySystem();
    const galleries = await gallerySystem.getGalleries();

    if (!galleries || galleries.length === 0) {
      hideIfExists("#loadingBox");
      showIfExists("#emptyStateBox");
      return;
    }

    repeater.data = galleries.map((g) => ({
      _id: g._id,
      name: g.name || "Untitled Gallery",
      description: g.description || "",
      coverImageUrl: g.coverImageUrl || "",
      totalPhotos: g.totalPhotos || 0,
    }));

    repeater.onItemReady(($item, itemData) => {
      try {
        if ($item("#galleryName")) $item("#galleryName").text = itemData.name;
        if ($item("#galleryDescription"))
          $item("#galleryDescription").text = itemData.description;
        if ($item("#photoCount"))
          $item("#photoCount").text = `${itemData.totalPhotos} Photos`;
        if ($item("#coverImage") && itemData.coverImageUrl)
          $item("#coverImage").src = itemData.coverImageUrl;
        if (
          $item("#viewGalleryBtn") &&
          typeof $item("#viewGalleryBtn").onClick === "function"
        ) {
          $item("#viewGalleryBtn").onClick(() =>
            wixLocation.to(`/gallery-view?folderId=${itemData._id}&open=1`)
          );
        }
      } catch (e) {
        console.log("initPhotosPage item bind error:", e);
      }
    });

    hideIfExists("#loadingBox");
  } catch (error) {
    console.error("initPhotosPage error:", error);
    hideIfExists("#loadingBox");
    showIfExists("#emptyStateBox");
  }
}

function showIfExists(selector) {
  try {
    const el = $w(selector);
    if (el && typeof el.show === "function") el.show();
  } catch (_) {}
}
function hideIfExists(selector) {
  try {
    const el = $w(selector);
    if (el && typeof el.hide === "function") el.hide();
  } catch (_) {}
}
