# Start Hugo server:
    hugo server --logLevel debug --disableFastRender --ignoreCache --noHTTPCache --templateMetrics
# React dev:
    Go to: themes/plakarium/assets/react
    Run: npm run watch
# Compile Tailwind CSS:
    npx tailwindcss -c ./themes/plakarium/tailwind.config.js -i ./themes/plakarium/assets/css/main.css -o ./themes/plakarium/assets/css/main-compiled.css --watch
