# hfcReds VPM Packages

VRChat Creator Companion (VCC) listing for my packages, hosted at
**https://hfcred.github.io/VPM-Listing/**

## Adding the listing to the VCC

Open the page above and click **Add to VCC**, or add this URL under
*Settings > Packages > Add Repository*:

```
https://hfcRed.github.io/VPM-Listing/index.json
```

## Packages

| Package | Repository |
| --- | --- |
| Animation Repathing | https://github.com/hfcRed/Animation-Repathing |

## How it works

- [`source.json`](source.json) describes the listing and lists the GitHub repositories whose releases should be included.
- The [Build Repo Listing](.github/workflows/build-listing.yml) workflow checks out VRChat's [package-list-action](https://github.com/vrchat-community/package-list-action), which reads every release of those repositories, generates `index.json` and renders the landing page in [`Website`](Website), then deploys it to GitHub Pages.
- The workflow runs when `source.json` or the website changes or when a package repository dispatches it after publishing a release (they need a personal access token with *Actions: write* on this repository stored as a secret).

Based on VRChat's [template-package-listing](https://github.com/vrchat-community/template-package-listing).
