# CLAUDE.md
Project instructions for AI-assisted development on the FlyRank AI Frontend Engineering Capstone.
## Project Overview
This is a frontend engineering internship repository for building AI-assisted web applications. The codebase prioritizes clarity, accessibility, and maintainability over speed of generation.
**Author:** Sarah Ngumbao  
**Repository:** https://github.com/sarahdama715/Front-End-AI-engineering-
## Tech Stack
- HTML, CSS, JavaScript (vanilla unless a framework is explicitly added)
- Node.js 20+ for tooling (when `package.json` exists)
- Git + GitHub for version control
Do NOT introduce frameworks, libraries, or build tools unless the user explicitly requests them or they already exist in the repo.
## Repository Layout
public/ # Static assets (images, fonts) src/ ├── index.html ├── css/ ├── js/ └── components/

## Commands
bash
npm install      # Install dependencies
npm run dev      # Start dev server
npm run build    # Production build
npm test         # Run tests
Until package.json exists, do not assume npm scripts are available.

Coding Conventions
HTML
Use semantic elements (header, main, nav, section, footer).
Include lang on <html> and meaningful alt text on images.
Keep markup accessible: labels for inputs, ARIA only when native HTML is insufficient.

CSS
Use mobile-first responsive design.
Prefer CSS custom properties for theme tokens (colors, spacing, typography).
Use class names that describe purpose, not appearance (e.g. .card, not .blue-box).
Avoid !important unless overriding third-party styles.

JavaScript
Use const by default; let only when reassignment is needed.
Prefer small, single-purpose functions.
Use async/await for asynchronous operations.
Do not commit console.log debugging statements.

General
Match existing file naming and folder conventions before adding new patterns.
Keep changes focused — one feature or fix per commit when possible.
Never commit secrets, API keys, or .env files.

AI-Assisted Development Rules
When generating or editing code:
Read before writing — Inspect existing files and conventions first.
Minimize scope — Change only what the task requires.
Explain trade-offs — Note accessibility, performance, or security implications when relevant.
Verify output — Ensure generated code runs and does not break existing behavior.
Update docs — If structure or commands change, update README.md and this file.

MUST
Write accessible, responsive UI by default.
Handle loading, empty, and error states in UI components.
Keep README.md and CLAUDE.md in sync with the actual repo state.
Use the correct clone URL: https://github.com/sarahdama715/Front-End-AI-engineering-.git

MUST NOT
Add dependencies without stating why they are needed.
Generate placeholder lorem ipsum in production UI — use realistic copy.
Over-engineer abstractions for simple tasks.
Reference files or scripts that do not exist in the repo.
