import { afterEach, describe, expect, it, vi } from 'vitest'

const runConsent = vi.fn()
vi.mock('vanilla-cookieconsent', () => ({
  run: runConsent,
  acceptedCategory: () => false,
}))

const { initCookieConsent } = await import('../src/lib/cookieConsent')

function resetConsentState() {
  sessionStorage.clear()
  runConsent.mockReset()
  vi.stubGlobal('fetch', vi.fn())
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
})

describe('cookie consent geo response validation', () => {
  it('fails closed on a non-OK JSON response without caching it', async () => {
    resetConsentState()
    vi.mocked(fetch).mockResolvedValue(new Response('{"required":false}', { status: 503 }))

    await initCookieConsent()

    expect(runConsent).toHaveBeenCalledWith(expect.objectContaining({ mode: 'opt-in', autoShow: true }))
    expect(sessionStorage.getItem('qrati_geo_consent_required')).toBeNull()
  })

  it('fails closed when a successful response has a missing or non-boolean required field', async () => {
    resetConsentState()
    vi.mocked(fetch).mockResolvedValue(new Response('{"required":"false"}', { status: 200 }))

    await initCookieConsent()

    expect(runConsent).toHaveBeenCalledWith(expect.objectContaining({ mode: 'opt-in', autoShow: true }))
    expect(sessionStorage.getItem('qrati_geo_consent_required')).toBeNull()
  })
})
