# Bundled motion dependencies

- GSAP 3.15.0, installed from the official `gsap` npm package. Its original distribution header and license link are preserved in `gsap.min.js`. GSAP is subject to its own license, not this repository's MIT license: https://gsap.com/standard-license/ .
- Lenis 1.3.27, installed from the official `lenis` npm package. MIT license copied beside the distribution.

The exact package versions are also recorded in `frontend_tools/package-lock.json`. Node is only needed for optional frontend development/QA; the Python app reads these bundled distribution files directly.
