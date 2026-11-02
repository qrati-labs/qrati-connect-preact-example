# Preact crawler discovery audit

- Run: `20261018T041138Z-4a690417536948f68a8d835b4f3421c4`
- Scope: `origin/main` at `002faea7e6dd8505cdf5b570229c4e3407f0fabf`; public crawler discovery and static metadata for `/connect/preact-example` (`public/robots.txt`, `public/sitemap.xml`, `index.html`, worker path rewrite).
- Result: no confirmed defect.

## Trace and evidence

`public/robots.txt` allows all crawlers and advertises `https://qrati.com/connect/preact-example/sitemap.xml`. `public/sitemap.xml` lists the matching canonical page `https://qrati.com/connect/preact-example`. `index.html` defines the same canonical and Open Graph URL, page title/description, and JSON-LD software application metadata. The Cloudflare worker rewrites the public `/connect/preact-example` prefix to the asset root before serving static files; nested paths under the prefix are stripped consistently, so the root robots and sitemap assets are available through the advertised mounted URL.

The path boundary is static asset discovery/metadata only; application startup and the embedded gallery are out of scope. No source or tests changed. No issue was created.

## Impact, confidence, limitations

No user-facing crawler discovery failure was evidenced from the repository trace. Confidence is limited to configured source behavior. No live HTTP request, deployed Worker behavior, crawler rendering, or search indexing was verified.

## Tests and checks

No tests authored. Tests/build/lint/type-check/install were **NOT RUN BY BUGHUNTER**. `git diff --check` is permitted and was run before delivery.

## Timing

- Started: 2026-10-18 04:11:38 UTC (09:41:38 IST)
- Completed: 2026-10-18 04:12:37 UTC (09:42:37 IST)
- Total measured duration: 59 seconds (00:59)
- Phase records: preflight 00:22 (already performed by scheduler); repository selection/source trace/report/PR delivery 00:37.
