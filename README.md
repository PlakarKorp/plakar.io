# Plakar.io

<div align="center">

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
**For**: Connecting Plakar to other services  
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

- Clone the repo or a fork of the repo including the submodules `git clone --recurse-submodules git@github.com:PlakarKorp/plakar.io.git`
- If you have cloned the repo but the submodules folder is empty or missing, you can pull them with `git submodule update --init --recursive`
- Run `npm install` at `themes/blowfish` and at the root of the repo to install blowfish dependencies and our dependencies
- Run `npm run dev` at the root of the repo to start the development server and watch for changes to the Tailwind CSS files
- To build the static site run `npm run build`
- You can test the CI locally with `act push`
