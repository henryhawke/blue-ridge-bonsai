/**
 * event-system.js  (public)
 *
 * EventSystem: populates Wix Repeaters and handles event-page logic.
 *
 * Required element IDs (per-page — set in Wix editor):
 *  Events list page:
 *    #eventsRepeater   Repeater  — main events list
 *    #loadingState     Container — shown while loading
 *    #emptyState       Container — shown when no results
 *    #categoryFilter   Dropdown  — category filter selector
 *    #searchInput      TextInput — search box (optional)
 *
 *  Event detail page:
 *    #eventTitle       Text
 *    #eventDate        Text
 *    #eventLocation    Text
 *    #eventDescription Text / Rich Text
 *    #eventImage       Image
 *    #registerButton   Button
 *    #registrationInfo Text — shows capacity / registration status
 *
 * Repeater item IDs (inside each repeater item):
 *    #itemTitle        Text
 *    #itemDate         Text
 *    #itemLocation     Text
 *    #itemImage        Image
 *    #itemCategory     Text
 *    #itemButton       Button — "Learn More" / "Register"
 *
 * Usage:
 *   import { EventSystem } from 'public/js/event-system';
 *   const es = new EventSystem($w);
 *   await es.init();
 */

import { dataService } from 'public/js/data-service';

/** @param {Date|string|null} d */
function formatEventDate(d) {
  if (!d) return '';
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month:   'short',
    day:     'numeric',
    year:    'numeric',
  });
}

export class EventSystem {
  /**
   * @param {function} $w  — Wix selector function passed from page code
   */
  constructor($w) {
    this.$w = $w;
    this._allEvents = [];
    this._categories = [];
    this._activeCategory = null;
    this._searchQuery = '';
  }

  // ─── Initialization ────────────────────────────────────────────────────────

  /**
   * Loads events and populates the events list repeater.
   * Call this from $w.onReady().
   */
  async init() {
    this._showLoading(true);

    try {
      const [events, categories] = await Promise.all([
        dataService.getEvents({ limit: 50 }),
        dataService.getEventCategories(),
      ]);

      this._allEvents = events;
      this._categories = categories;

      this._populateCategoryFilter();
      this._renderEvents(events);
    } catch (err) {
      console.error('EventSystem.init failed:', err);
      this._showEmpty(true);
    } finally {
      this._showLoading(false);
    }
  }

  // ─── Filter / Search ───────────────────────────────────────────────────────

  /** @param {string|null} categoryId */
  filterByCategory(categoryId) {
    this._activeCategory = categoryId;
    this._applyFilters();
  }

  /** @param {string} query */
  search(query) {
    this._searchQuery = query.toLowerCase().trim();
    this._applyFilters();
  }

  _applyFilters() {
    let filtered = this._allEvents;

    if (this._activeCategory) {
      filtered = filtered.filter(e =>
        (e.categories || []).some(c => c === this._activeCategory)
      );
    }

    if (this._searchQuery) {
      filtered = filtered.filter(e =>
        (e.title || '').toLowerCase().includes(this._searchQuery) ||
        (e.description || '').toLowerCase().includes(this._searchQuery) ||
        (e.location || '').toLowerCase().includes(this._searchQuery)
      );
    }

    this._renderEvents(filtered);
  }

  // ─── Rendering ─────────────────────────────────────────────────────────────

  /** @param {Array} events */
  _renderEvents(events) {
    const $w = this.$w;

    if (events.length === 0) {
      this._showEmpty(true);
      return;
    }

    this._showEmpty(false);

    try {
      $w('#eventsRepeater').data = events.map(e => ({
        _id: e._id || String(Math.random()),
        title: e.title || '',
        date: formatEventDate(e.startDate),
        location: e.location || '',
        image: e.imageUrl || '',
        category: (e.categories || [])[0] || '',
        slug: e.slug || e._id,
        registrationEnabled: e.registrationEnabled,
      }));

      $w('#eventsRepeater').onItemReady(($item, itemData) => {
        _safeSet($item, '#itemTitle', el => { el.text = itemData.title; });
        _safeSet($item, '#itemDate',  el => { el.text = itemData.date; });
        _safeSet($item, '#itemLocation', el => { el.text = itemData.location; });
        _safeSet($item, '#itemCategory', el => { el.text = itemData.category; });

        if (itemData.image) {
          _safeSet($item, '#itemImage', el => { el.src = itemData.image; });
        }

        _safeSet($item, '#itemButton', el => {
          el.label = itemData.registrationEnabled ? 'Register' : 'Learn More';
          el.onClick(() => {
            $w('#eventsRepeater').forItems([itemData._id], () => {});
          });
        });

        $item('#eventsRepeater').customClassList?.add('brbs-event-card');
      });
    } catch (err) {
      console.warn('EventSystem._renderEvents: eventsRepeater not found on this page', err.message);
    }
  }

  _populateCategoryFilter() {
    const $w = this.$w;

    if (this._categories.length === 0) return;

    try {
      const options = [
        { label: 'All Events', value: '' },
        ...this._categories.map(c => ({ label: c.name, value: c.id })),
      ];

      $w('#categoryFilter').options = options;
      $w('#categoryFilter').onChange(event => {
        this.filterByCategory(event.target.value || null);
      });
    } catch {
      // categoryFilter not on this page — skip
    }
  }

  // ─── State Helpers ─────────────────────────────────────────────────────────

  _showLoading(visible) {
    _safeSet(this.$w, '#loadingState', el => {
      visible ? el.show() : el.hide();
    });
  }

  _showEmpty(visible) {
    _safeSet(this.$w, '#emptyState', el => {
      visible ? el.show() : el.hide();
    });
  }

  // ─── Detail Page ───────────────────────────────────────────────────────────

  /**
   * Populates the event detail page with a single event's data.
   * Call from the Event Details page $w.onReady().
   *
   * @param {string} eventId
   */
  async loadEventDetail(eventId) {
    if (!eventId) return;

    const event = await dataService.getEventById(eventId);
    if (!event) return;

    const $w = this.$w;

    _safeSet($w, '#eventTitle',       el => { el.text = event.title; });
    _safeSet($w, '#eventDate',        el => { el.text = formatEventDate(event.startDate); });
    _safeSet($w, '#eventLocation',    el => { el.text = event.location; });
    _safeSet($w, '#eventDescription', el => { el.text = event.description; });

    if (event.imageUrl) {
      _safeSet($w, '#eventImage', el => { el.src = event.imageUrl; });
    }

    if (!event.registrationEnabled) {
      _safeSet($w, '#registerButton', el => { el.disable(); });
      _safeSet($w, '#registrationInfo', el => { el.text = 'Registration not required.'; });
    } else if (event.capacity !== null) {
      const spotsLeft = event.capacity - (event.totalRegistrations || 0);
      _safeSet($w, '#registrationInfo', el => {
        el.text = spotsLeft > 0
          ? `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} remaining`
          : 'This event is full.';
      });
      if (spotsLeft <= 0) {
        _safeSet($w, '#registerButton', el => { el.disable(); });
      }
    }
  }
}

// ─── Internal Helpers ─────────────────────────────────────────────────────────

/**
 * Calls fn($w(selector)) only if the element exists.
 * Silences the "element not found" errors Wix throws.
 */
function _safeSet($w, selector, fn) {
  try {
    fn($w(selector));
  } catch {
    // element not present on this page — no-op
  }
}
