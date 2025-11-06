# Template React

[![tests](https://img.shields.io/github/actions/workflow/status/nichoth/template-react/nodejs.yml?style=flat-square)](https://github.com/nichoth/template-react/actions/workflows/nodejs.yml)


A template for React projects. This was created with `npm create vite@latest`
with Typescript + React, and I added some opinions too &mdash;
[Netlify](https://www.netlify.com/) as host, Netlify lambda functions,
[@substrate-system/tapout](https://github.com/substrate-system/tapout) for tests,
and [@preact/signals-react](https://github.com/preactjs/signals/tree/main/packages/react)
for application state.

<details><summary><h2>Contents</h2></summary>

<!-- toc -->

- [Build](#build)
- [Develop](#develop)
- [Test](#test)
- [Notes](#notes)
  * [Environments](#environments)
  * [Lint](#lint)
- [React Compiler](#react-compiler)

<!-- tocstop -->

</details>

## Build

Build the app for production.

```sh
npm run build
```

Vite handles TypeScript for bundling, but it doesn’t do type checking.
It just strips types and runs the code through esbuild. The command
`tsc -b` does the type checking.


## Develop

Start a `vite` localhost server.

```sh
npm start
```

Use the `@substrate-system/debug` module for logging.


-------


## Test

Run some tests locally in a browser:

```sh
npm test
```

This uses [@substrate-system/tapout](https://github.com/substrate-system/tapout)
to run tests in a browser environment.

In the tests we pass in a mock API server.

-------

## Notes & Opinions

### Environments

4 environments: `production`, `staging`, `test`, and `development`. These
correspond to the `import.meta.env` variable in the browser. This is mostly
used for deciding if things are logged to the browser console. Logging is
enabled for the staging branch and the local dev site.

### Headers

Response headers are configured to use either `src/_headers/production` or
`src/_headers/staging`, depending on the deploy context. This is configured
in [./netlify.toml](./netlify.toml).

### Debug Logs

We use [`@substrate-system/debug`](https://github.com/substrate-system/debug)
for logging. It looks at the env variable `import.meta.env.DEV`. See
[`isDev` function](./src/app.tsx#L102)

### Redirects

Redirects are configured as for [an SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA).
Everything will redirect to the index page. This is configured in `netlify.toml`.
See the `[[redirects]]` key:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200 
```


### Lint

Lint, and fix everything fixable:

```sh
npm run lint -- --fix
```


-------



## React Compiler

The React Compiler is not enabled on this template because of its impact on
dev & build performances. To add it, see
[this documentation](https://react.dev/learn/react-compiler/installation).
