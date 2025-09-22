// Blue Ridge Bonsai Society - Photo Gallery System
// This file contains the core logic for managing photo galleries and photos.
// It supports two data sources:
// 1) Google Drive (preferred) — configured via public/config/gallery.config.js and backend web module
// 2) Local mock JSON (fallback)

// Data source config
import { DRIVE_ROOT_FOLDER_ID } from 'public/config/gallery.config.js';

// Backend (Drive) API
import { listGalleries, listPhotos } from 'backend/google-drive-gallery';

// Mock Data (simulating Wix Collections)
import photoGalleriesData from 'backend/data/PhotoGalleries.json';
import photosData from 'backend/data/Photos.json';

/**
 * A class to manage all photo gallery functionality.
 */
export class GallerySystem {
  constructor() {
    // Fallback data
    this.galleries = photoGalleriesData;
    this.photos = photosData;
    // Drive toggle: if a root folder is provided, use Drive
    this.useDrive = Boolean(DRIVE_ROOT_FOLDER_ID);
  }

  /**
   * Loads all photo galleries.
   * @returns {Promise<Array>}
   */
  async getGalleries() {
    if (this.useDrive) {
      try {
        const galleries = await listGalleries({ rootFolderId: DRIVE_ROOT_FOLDER_ID });
        return galleries;
      } catch (e) {
        console.error('Error loading galleries from Drive, falling back to mock data:', e);
        // fall through to mock
      }
    }

    // Mock fallback: sort by sortOrder, then by date
    this.galleries.sort((a, b) => {
      if (a.sortOrder && b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }
      return new Date(b.createdDate) - new Date(a.createdDate);
    });
    return this.galleries;
  }

  /**
   * Gets a single gallery's details by its ID.
   * @param {string} galleryId
   * @returns {Promise<object|null>}
   */
  async getGalleryById(galleryId) {
    if (this.useDrive) {
      // In Drive mode, gallery IDs are folder IDs; re-list and find
      const galleries = await this.getGalleries();
      return galleries.find(g => g._id === galleryId) || null;
    }
    return this.galleries.find(g => g._id === galleryId) || null;
  }

  /**
   * Loads all photos for a specific gallery.
   * @param {string} galleryId - In Drive mode, this is the Google Drive folder ID.
   * @returns {Promise<Array>}
   */
  async getPhotosForGallery(galleryId) {
    if (this.useDrive) {
      try {
        const photos = await listPhotos({ folderId: galleryId });
        return photos.map(normalizePhotoItem);
      } catch (e) {
        console.error('Error loading photos from Drive:', e);
        return [];
      }
    }
    return this.photos
      .filter(p => p.galleryId === galleryId)
      .map(normalizePhotoItem);
  }

  /**
   * Gets a single photo's details by its ID.
   * @param {string} photoId
   * @returns {Promise<object|null>}
   */
  async getPhotoById(photoId) {
    if (this.useDrive) {
      // Not efficient but acceptable: scan recent from all galleries when needed
      const galleries = await this.getGalleries();
      for (const g of galleries) {
        const photos = await this.getPhotosForGallery(g._id);
        const found = photos.find(p => p._id === photoId);
        if (found) return found;
      }
      return null;
    }
    return this.photos.find(p => p._id === photoId) || null;
  }

  /**
   * Loads the most recent photos from all galleries.
   * @param {number} limit - The number of photos to return.
   * @returns {Promise<Array>}
   */
  async getRecentPhotos(limit = 10) {
    if (this.useDrive) {
      const galleries = await this.getGalleries();
      const batches = await Promise.all(
        galleries.map(g => this.getPhotosForGallery(g._id))
      );
      const all = batches.flat().map(normalizePhotoItem);
      all.sort((a, b) => new Date(b.shootDate || 0) - new Date(a.shootDate || 0));
      return all.slice(0, limit);
    }
    this.photos.sort((a, b) => new Date(b.shootDate) - new Date(a.shootDate));
    return this.photos.slice(0, limit).map(normalizePhotoItem);
  }
}

function normalizePhotoItem(photo) {
  if (!photo) return photo;
  const src = photo.src || photo.originalUrl || photo.imageUrl || photo.url || '';
  const thumbnailSrc = photo.thumbnailSrc || photo.thumbnailUrl || src;
  return {
    ...photo,
    src,
    thumbnailSrc,
    type: photo.type || 'image'
  };
}
