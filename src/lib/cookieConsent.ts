import * as CookieConsent from 'vanilla-cookieconsent'

export function initCookieConsent() {
  if (typeof window === 'undefined') return
  void CookieConsent.run({ categories: { necessary: { enabled: true, readOnly: true }, analytics: {} }, language: { default: 'en', translations: { en: { consentModal: { title: 'We use cookies', description: 'Essential cookies keep this example working. Analytics cookies are optional.', acceptAllBtn: 'Accept all', acceptNecessaryBtn: 'Reject analytics', showPreferencesBtn: 'Manage preferences' }, preferencesModal: { title: 'Cookie preferences', acceptAllBtn: 'Accept all', acceptNecessaryBtn: 'Reject analytics', savePreferencesBtn: 'Save preferences', closeIconLabel: 'Close', sections: [] } } } } })
}
