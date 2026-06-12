// Optional Google sign-in gate for the Training Hub.
//
// OFF by default: while CLIENT_ID below is empty this file does nothing at
// all — no Google scripts load and the site behaves exactly as before. When
// a client ID is set, visitors must sign in with their @haileybury.com
// Google account before the hub is shown, and analytics events carry their
// email address so usage can be followed per member of staff
// (see docs/analytics-setup.md, "Identified usage").
//
// This is an identification layer, not a security wall: the site is static,
// so its content is still in the page source for anyone determined to read
// it. Don't put confidential material behind it.
//
// Create the client ID at console.cloud.google.com → APIs & Services →
// Credentials → Create credentials → OAuth client ID → Web application,
// with this site's origin under "Authorized JavaScript origins".
(function () {
    'use strict';

    const CLIENT_ID = ''; // e.g. '1234567890-abc.apps.googleusercontent.com'
    const ALLOWED_DOMAIN = 'haileybury.com';
    const SESSION_DAYS = 30; // ask staff to sign in again after this long
    const STORAGE_KEY = 'tt-user';
    // Local development, CI and file:// never gate (mirrors the analytics
    // filter in app.js, and keeps the smoke test green).
    const DEV_HOSTS = ['localhost', '127.0.0.1', ''];

    let user = null;

    function loadStoredUser() {
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (!stored || !stored.email) return null;
            if (Date.now() - (stored.ts || 0) > SESSION_DAYS * 24 * 60 * 60 * 1000) {
                localStorage.removeItem(STORAGE_KEY);
                return null;
            }
            return stored;
        } catch { return null; }
    }

    const enabled = Boolean(CLIENT_ID) && !DEV_HOSTS.includes(location.hostname);
    if (enabled) {
        user = loadStoredUser();
        // This file is loaded synchronously in <head> so the lock class lands
        // before first paint — signed-out visitors never glimpse the content.
        if (!user) document.documentElement.classList.add('sso-locked');
    }

    window.HubAuth = {
        enabled: () => enabled,
        gateActive: () => enabled && !user,
        user: () => user,
        signOut
    };

    if (!enabled) return;

    function decodeJwtPayload(jwt) {
        let part = jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        while (part.length % 4) part += '=';
        const bytes = Uint8Array.from(atob(part), (c) => c.charCodeAt(0));
        return JSON.parse(new TextDecoder().decode(bytes));
    }

    function showError(message) {
        const el = document.getElementById('ssoError');
        if (el) { el.textContent = message; el.hidden = false; }
    }

    function setContentInert(inert) {
        document.querySelectorAll('body > *:not(.sso-gate)').forEach((el) => {
            if (inert) el.setAttribute('inert', '');
            else el.removeAttribute('inert');
        });
    }

    function handleCredential(response) {
        let claims = null;
        try { claims = decodeJwtPayload(response.credential); } catch {}
        const email = claims && claims.email ? String(claims.email).toLowerCase() : '';
        const allowed = claims && claims.email_verified &&
            (claims.hd === ALLOWED_DOMAIN || email.endsWith('@' + ALLOWED_DOMAIN));
        if (!allowed) {
            try { google.accounts.id.disableAutoSelect(); } catch {}
            showError('Please sign in with your @' + ALLOWED_DOMAIN + ' account'
                + (email ? ' — you used ' + email : '') + '.');
            return;
        }
        user = { email, name: claims.name || email, ts: Date.now() };
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(user)); } catch {}
        document.documentElement.classList.remove('sso-locked');
        setContentInert(false);
        showAccountInFooter();
        document.dispatchEvent(new CustomEvent('hub:signed-in', {
            detail: { fresh: true, email: user.email }
        }));
    }

    function signOut() {
        try { localStorage.removeItem(STORAGE_KEY); } catch {}
        try { google.accounts.id.disableAutoSelect(); } catch {}
        location.reload();
    }

    function showAccountInFooter() {
        const box = document.getElementById('footerAccount');
        const emailEl = document.getElementById('footerAccountEmail');
        const signOutBtn = document.getElementById('signOutBtn');
        if (!box || !user) return;
        if (emailEl) emailEl.textContent = user.email;
        if (signOutBtn) signOutBtn.addEventListener('click', signOut);
        box.hidden = false;
    }

    function initGoogleSignIn() {
        if (!window.google || !google.accounts || !google.accounts.id) {
            showError('Could not load Google sign-in. Check your connection and refresh.');
            return;
        }
        google.accounts.id.initialize({
            client_id: CLIENT_ID,
            hd: ALLOWED_DOMAIN,
            auto_select: true,
            callback: handleCredential
        });
        const slot = document.getElementById('ssoButton');
        if (slot) {
            google.accounts.id.renderButton(slot, {
                type: 'standard', theme: 'filled_blue', size: 'large',
                text: 'signin_with', shape: 'pill'
            });
        }
        google.accounts.id.prompt(); // One Tap: usually a single click for staff
    }

    function start() {
        if (user) { showAccountInFooter(); return; } // signed in — skip Google scripts
        setContentInert(true);
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initGoogleSignIn;
        script.onerror = () => showError('Could not load Google sign-in. Check your connection and refresh.');
        document.head.appendChild(script);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
})();
