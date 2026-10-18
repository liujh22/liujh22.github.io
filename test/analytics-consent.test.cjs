const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

function loadConsent() {
  let options;
  const window = {
    dataLayer: [],
    CookieConsent: { run: (value) => (options = value) },
  };
  const source = fs
    .readFileSync(path.join(__dirname, "../_scripts/cookie-consent-setup.js"), "utf8")
    .replace(/^---\n[\s\S]*?\n---\n/, "")
    .replaceAll("{{ site.google_analytics }}", "G-TEST123456");
  vm.runInNewContext(source, { window, console, setTimeout });
  return {
    window,
    options,
    lastConsent: () => Array.from(window.dataLayer.at(-1)),
  };
}

// CookieConsent v3 callbacks receive a cookie object, not a category boolean map.
function consentData(categories) {
  return {
    cookie: {
      categories,
      revision: 0,
      data: null,
      consentId: "test-consent",
      consentTimestamp: "2026-10-17T12:00:00.000Z",
      lastConsentTimestamp: "2026-10-17T12:00:00.000Z",
      languageCode: "en",
      services: { necessary: [], analytics: [] },
    },
  };
}

function assertConsent(app, analytics) {
  const [command, action, values] = app.lastConsent();
  assert.equal(command, "consent");
  assert.equal(action, "update");
  assert.equal(values.analytics_storage, analytics);
  for (const field of ["ad_storage", "ad_user_data", "ad_personalization"]) {
    assert.equal(values[field], "denied");
  }
}

test("analytics and advertising remain disabled before a visitor chooses", () => {
  const app = loadConsent();
  const [command, action, values] = app.lastConsent();
  assert.equal(command, "consent");
  assert.equal(action, "default");
  for (const field of ["analytics_storage", "ad_storage", "ad_user_data", "ad_personalization"]) {
    assert.equal(values[field], "denied");
  }
  assert.equal(app.window["ga-disable-G-TEST123456"], true);
  assert.equal(app.options.mode, "opt-in");
  assert.equal(app.options.categories.analytics.enabled, false);
});

test("first and saved consent grant analytics using CookieConsent v3's cookie payload", () => {
  const app = loadConsent();
  assert.equal(typeof app.options.onConsent, "function");
  app.options.onConsent(consentData(["necessary", "analytics"]));
  assertConsent(app, "granted");
  assert.equal(app.window["ga-disable-G-TEST123456"], false);
});

test("saved rejection remains disabled and a later opt-in grants analytics only", () => {
  const app = loadConsent();
  assert.equal(typeof app.options.onConsent, "function");
  app.options.onConsent(consentData(["necessary"]));
  assertConsent(app, "denied");
  assert.equal(app.window["ga-disable-G-TEST123456"], true);
  app.options.onChange({
    ...consentData(["necessary", "analytics"]),
    changedCategories: ["analytics"],
    changedServices: { analytics: [] },
  });
  assertConsent(app, "granted");
  assert.equal(app.window["ga-disable-G-TEST123456"], false);
});

test("withdrawal disables Google collection and instructs CookieConsent to clear GA cookies and reload", () => {
  const app = loadConsent();
  assert.equal(typeof app.options.onConsent, "function");
  app.options.onConsent(consentData(["necessary", "analytics"]));
  app.options.onChange({
    ...consentData(["necessary"]),
    changedCategories: ["analytics"],
    changedServices: { analytics: [] },
  });
  assertConsent(app, "denied");
  assert.equal(app.window["ga-disable-G-TEST123456"], true);
  const cleanup = app.options.categories.analytics.autoClear;
  assert.equal(cleanup.reloadPage, true);
  for (const name of ["_ga", "_ga_TEST123456"]) {
    assert.ok(cleanup.cookies.some((rule) => rule.name.test(name)));
  }
  assert.ok(cleanup.cookies.every((rule) => !rule.name.test("cc_cookie")));
});
