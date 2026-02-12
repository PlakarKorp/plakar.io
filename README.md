# Plakar.io

<div align="center">

<img src="./assets/img/logo/Plakar_Effortless_Backup_Logo_Icon.svg" alt="Plakar Logo" width="200"/>

[![Join our Discord community](https://img.shields.io/badge/Discord-Join%20Us-purple?logo=discord&logoColor=white&style=for-the-badge)](https://discord.gg/A2yvjS6r2C)
[![Subscribe on YouTube](https://img.shields.io/badge/YouTube-Subscribe-red?logo=youtube&logoColor=white&style=for-the-badge)](https://www.youtube.com/@PlakarKorp)
[![Join our Subreddit](https://img.shields.io/badge/Reddit-Join%20r%2Fplakar-orange?logo=reddit&logoColor=white&style=for-the-badge)](https://www.reddit.com/r/plakar/)

</div>

## Documentation Structure

### Getting Started (Tutorials)
**For**: Brand new users  
**Goal**: Teach basics, build confidence  
**Examples**: Installation, first backup

### Guides (How-to)
**For**: Users solving specific problems  
**Goal**: Step-by-step recipes assuming basic knowledge  
**Examples**: Back up PostgreSQL, create Kloset store, automate backups

### References
**For**: Looking up technical details  
**Goal**: Describe commands, options, APIs  
**Examples**: CLI commands, configuration files, flags

### Explanations
**For**: Understanding concepts  
**Goal**: Provide context, discuss trade-offs  
**Examples**: How Plakar works, backup strategies

### Integrations
**For**: Connecting Plakar to external services  
**Goal**: Setup and configuration for integrations  
**Examples**: S3, SFTP, tar, Notion, Google Drive, Proton Drive

---

## Where Does My Doc Belong?

1. **Brand new to Plakar?** → Getting Started
2. **"How do I..."?** → Guide
3. **Command/option/API?** → Reference
4. **"Why does it work this way?"** → Explanation
5. **Service integration?** → Integration

---

## Development

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
  - `hugo gen chromastyles --style=monokailight > ./themes/plakarium/assets/css/chroma.css`
  - `hugo gen chromastyles --style=native > ./themes/plakarium/assets/css/native.css`
