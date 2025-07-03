# Development

* **Start Hugo server**:

    ```bash
    hugo server --logLevel debug --disableFastRender --ignoreCache --noHTTPCache --templateMetrics
    ```

* **React dev**:

    - Go to: themes/plakarium/assets/react
    - Run: `npm run watch`

* **Compile Tailwind CSS**

    ```bash
    npx tailwindcss -c ./themes/plakarium/tailwind.config.js -i ./themes/plakarium/assets/css/main.css -o ./themes/plakarium/assets/css/main-compiled.css --watch
    ```

* **Autoreload when layout changes**

    - (requires to `brew install fswatch` on MacOS)
    - `./scripts/watch-layouts-changes.sh`

* **Change code highlight style**

    - `hugo gen chromastyles --style=monokailight > assets/css/chroma.css`
