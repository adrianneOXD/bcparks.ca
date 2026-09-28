# Specs

### AI test agents
The team uses both Claude Code and GitHub Copilot, so Playwright's test
agents exist in two formats: `.claude/agents/` and `.github/agents/`.
Both are generated. Don't edit them directly. After upgrading
`@playwright/test`, run `npm run agents:update` and commit the result.