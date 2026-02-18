// masterPage.js — runs on every page of the site.
//
// REQUIRED ELEMENT IDs (set in Wix editor on the Master Page):
//
//  Navigation bar:
//    #siteMenu          Menu / Navigation widget
//    #memberMenu        Container — shown only to logged-in members
//    #loginButton       Button    — visible when logged OUT
//    #logoutButton      Button    — visible when logged IN
//    #memberAvatar      Image     — current member's profile photo (logged in)
//    #memberNameText    Text      — current member's display name (logged in)
//
//  Optional scroll-aware header:
//    #headerContainer   Container — the top header strip
//
// ─────────────────────────────────────────────────────────────────────────────

import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
import { currentMember } from 'wix-members-frontend';

$w.onReady(function () {
  _initAuth();
  _initScrollHeader();
  _setActiveNavLink();
});

// ─── Auth / Member Menu ───────────────────────────────────────────────────────

function _initAuth() {
  const isLoggedIn = wixUsers.currentUser.loggedIn;

  if (isLoggedIn) {
    _showMemberState();
  } else {
    _showGuestState();
  }

  // Login button — opens Wix member login lightbox
  _safeOn('#loginButton', 'onClick', () => {
    wixUsers.promptLogin({ mode: 'login' }).catch(() => {});
  });

  // Logout button — logout() returns void; navigate after calling it
  _safeOn('#logoutButton', 'onClick', () => {
    wixUsers.logout();
    wixLocation.to('/');
  });
}

function _showMemberState() {
  _safeCall('#loginButton',  el => el.hide());
  _safeCall('#logoutButton', el => el.show());
  _safeCall('#memberMenu',   el => el.show());

  // Populate member display name and avatar via the current wix-members API
  currentMember
    .getMember({ fieldsets: ['FULL'] })
    .then(member => {
      const name = member.profile?.nickname || 'Member';

      _safeCall('#memberNameText', el => { el.text = name; });

      const photoUrl = member.profile?.profilePhoto?.url;
      if (photoUrl) {
        _safeCall('#memberAvatar', el => { el.src = photoUrl; });
      }
    })
    .catch(() => {});
}

function _showGuestState() {
  _safeCall('#loginButton',  el => el.show());
  _safeCall('#logoutButton', el => el.hide());
  _safeCall('#memberMenu',   el => el.hide());
}

// ─── Scroll-Aware Header ──────────────────────────────────────────────────────

function _initScrollHeader() {
  // Adds the brbs-nav--scrolled CSS class when the user scrolls down.
  // Requires #headerContainer to exist on the master page.
  try {
    // #headerContainer is not in the auto-generated MasterPageElementsMap, so
    // we cast $w to bypass the strict selector check while keeping the try/catch
    // safety net for the case where the element doesn't exist at runtime.
    // @ts-ignore
    const header = /** @type {{ customClassList: { add(c: string): void; remove(c: string): void } }} */ ($w('#headerContainer'));
    header.customClassList.add('brbs-nav');

    // Approximate scroll position via a sentinel element placed at the top of
    // the page body (#scrollSentinel). onViewportLeave = scrolled down;
    // onViewportEnter = back at top. No redundant $w('Document') call needed.
    _safeOn('#scrollSentinel', 'onViewportLeave', () => {
      header.customClassList.add('brbs-nav--scrolled');
    });
    _safeOn('#scrollSentinel', 'onViewportEnter', () => {
      header.customClassList.remove('brbs-nav--scrolled');
    });
  } catch {
    // headerContainer not on this page — skip scroll behaviour
  }
}

// ─── Active Nav Link ──────────────────────────────────────────────────────────

function _setActiveNavLink() {
  // Maps URL path prefixes to element IDs of nav link buttons/text elements.
  // Add entries here for each top-level nav item you have.
  const NAV_MAP = {
    '/about':    '#navAbout',
    '/events':   '#navEvents',
    '/learn':    '#navLearn',
    '/join':     '#navJoin',
    '/photos':   '#navPhotos',
    '/members':  '#navMembers',
  };

  const currentPath = wixLocation.path.join('/').toLowerCase();

  Object.entries(NAV_MAP).forEach(([path, selector]) => {
    if (currentPath.startsWith(path.slice(1))) {
      _safeCall(selector, el => {
        el.customClassList?.add('brbs-nav-link--active');
      });
    }
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Calls fn(element) if the element exists; silently skips otherwise. */
function _safeCall(selector, fn) {
  try {
    fn($w(selector));
  } catch {
    // element not on master page — no-op
  }
}

/** Registers an event handler on an element if it exists. */
function _safeOn(selector, eventName, handler) {
  try {
    $w(selector)[eventName](handler);
  } catch {
    // element not on master page — no-op
  }
}
