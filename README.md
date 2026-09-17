# hfcReds VPM Packages

VRChat Creator Companion (VCC) listing for my packages, hosted at
**https://hfcred.github.io/VPM-Listing/**

## Adding the listing to the VCC

Open the page above and click **Add to VCC**, or add this URL under
_Settings > Packages > Add Repository_:

```
https://hfcRed.github.io/VPM-Listing/index.json
```

## Packages

| Package             | Repository                                    |
| ------------------- | --------------------------------------------- |
| Animation Repathing | https://github.com/hfcRed/Animation-Repathing |

## How it works

- [`source.json`](source.json) describes the VPM listing and lists the GitHub repositories whose releases should be included.
- [`scripts/build-index.ts`](scripts/build-index.ts) reads every release of those repositories, takes the `package.json` and `.zip` assets, hashes the zip and writes `static/index.json` and `src/lib/generated/listing.json`.
- The page is a [SvelteKit](https://svelte.dev/docs/kit) site prerendered with `adapter-static`.
- The [Build Repo Listing](.github/workflows/build-listing.yml) workflow runs the script and SvelteKit build and deploys the output to GitHub Pages. It runs on every push to `main` and whenever a package repository dispatches the workflow after publishing a release (the package repo needs a personal access token with _Actions: write_ on this repository, stored as a secret).

## Development

```sh
pnpm install
pnpm generate   # builds static/index.json and the page data from GitHub (GITHUB_TOKEN optional)
pnpm dev        # start dev server on http://localhost:5173/
pnpm build      # generate + production build into build/
pnpm preview`   # preview the output on http://localhost:4173/
pnpm check      # analyze Svelte code
pnpm lint       # format and analyze all code
```

Set `BASE_PATH=/VPM-Listing` when building for GitHub Pages, the workflow does this automatically.

## Adding a package

Add the repository to `githubRepos` in `source.json`. The packages releases need a `package.json` asset and a `.zip` asset containing the package. For an example you can take a look at the
[Animation-Repathing](https://github.com/hfcRed/Animation-Repathing/blob/main/.github/workflows/release.yml) release workflow.
