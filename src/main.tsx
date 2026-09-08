import { render } from 'preact'
import './index.css'
import { App } from './app.tsx'
import { initCookieConsent } from './lib/cookieConsent'

void initCookieConsent()

render(<App />, document.getElementById('app')!)
