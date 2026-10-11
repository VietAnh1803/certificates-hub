# Nguyen Viet Anh — Certificate Collection

A public, static collection of the eleven unique course certificates supplied in
`C:\Certificates`. Original PDFs are copied byte-for-byte. Previews are rendered
from those PDFs; duplicate scans do not become extra credentials.

The site supports issuer filters, title/credential search, date sorting, accessible
certificate dialogs, original-PDF viewing/downloads, and the seven Coursera
verification links embedded in the original documents. The Canva badge is included.
No account, analytics, or external script is required for visitors.

Live collection: https://vietanh1803.github.io/certificates-hub/

## Deployment

GitHub Actions publishes `dist/` to GitHub Pages on each push to `main`.
The workflow can also be started manually from the Actions tab. No build step,
hosting token, or additional dependency is required. All asset paths are relative
so the site works under the repository's Pages URL.

To update the collection, place the original PDFs in `C:\Certificates`, update
the entries in `build_catalog.py`, run `python build_catalog.py`, inspect the site,
then commit and push the updated catalog and assets. The script requires Python
and Poppler's `pdftoppm` for the previews. Alternatively, edit the static files
in `dist/` directly and push them.

`build_catalog.py` prepares source documents and faithful previews. `dist/` is the
complete buildless site. `.openai/hosting.json` retains the identity of the earlier
Sites publication; GitHub Pages uses only `dist/` and the Actions workflow.
