# Template React

A template for React projects.

<details><summary><h2>Contents</h2></summary>

<!-- toc -->

- [Build](#build)
- [Develop](#develop)
- [Notes](#notes)
  * [Environments](#environments)
  * [Helpful Commands](#helpful-commands)
- [React Compiler](#react-compiler)
- [Expanding the ESLint configuration](#expanding-the-eslint-configuration)

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

## Notes

### Environments

4 environments: `production`, `staging`, `test`, and `development`. These
correspond to the `import.meta.env` variable in the browser. This is mostly
used for deciding if things are logged to the browser console.


### Helpful Commands

* `lsof -ti :8888 | xargs kill` - Kill process on port 8888
* `lsof -ti :8888 | xargs kill` -9 - Force kill if it won't die
* `pkill -f vite` - Kill any process matching "vite"




-------



- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
