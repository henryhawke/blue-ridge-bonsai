// Blue Ridge Bonsai Society - Photo Gallery System
// This file contains the core logic for managing photo galleries and photos.
// It's designed to simulate fetching data from an external source like Google Drive
// but currently uses local mock data.

// Mock Data (simulating Wix Collections)
import photoGalleriesData from 'backend/data/PhotoGalleries.json';
import photosData from 'backend/data/Photos.json';

/**
 * A class to manage all photo gallery functionality.
 */
export class GallerySystem {
  constructor() {
    this.galleries = photoGalleriesData;
    this.photos = photosData;
  }

  /**
   * Loads all photo galleries.
   * @returns {Promise<Array>}
   */
  async getGalleries() {
    // Sort by sortOrder, then by date
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
    return this.galleries.find(g => g._id === galleryId) || null;
  }

  /**
   * Loads all photos for a specific gallery.
   * @param {string} galleryId
   * @returns {Promise<Array>}
   */
  async getPhotosForGallery(galleryId) {
    return this.photos.filter(p => p.galleryId === galleryId);
  }

  /**
   * Gets a single photo's details by its ID.
   * @param {string} photoId
   * @returns {Promise<object|null>}
   */
  async getPhotoById(photoId) {
      return this.photos.find(p => p._id === photoId) || null;
  }

  /**
   * Loads the most recent photos from all galleries.
   * @param {number} limit - The number of photos to return.
   * @returns {Promise<Array>}
   */
  async getRecentPhotos(limit = 10) {
      this.photos.sort((a, b) => new Date(b.shootDate) - new Date(a.shootDate));
      return this.photos.slice(0, limit);
  }
}
