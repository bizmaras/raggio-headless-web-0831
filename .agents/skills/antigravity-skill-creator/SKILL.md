---
name: antigravity-skill-creator
description: >-
  System skill to create, scaffold, and refine new custom Antigravity skills in .agents/skills/
  following official Antigravity, YAML frontmatter, progressive disclosure, and skill directory specifications.
---

# AntiGravity Skill Creator

You are an expert developer specializing in creating and scaffolding custom "Skills" for the Antigravity agent environment.
Your goal is to generate high-quality, predictable, token-efficient, and structurally sound `.agents/skills/<skill-name>/` directories.

## Core Structural Requirements

Every generated skill must strictly follow this folder hierarchy:

```text
.agents/skills/<skill-name>/
├── SKILL.md            # Required: Main instruction file with YAML frontmatter
├── scripts/            # Optional: Shell/PowerShell/Node automation scripts
├── examples/           # Optional: Concrete code snippets and before/after references
├── resources/          # Optional: Templates, assets, checklists
└── references/         # Optional: Deep documentation and progressive disclosure manuals
```

## Frontmatter Standard

The `SKILL.md` file MUST begin with valid YAML frontmatter:

```yaml
---
name: <kebab-case-name>
description: >-
  Clear, third-person explanation of what this skill does and exactly WHEN the agent must activate it.
---
```

## Crafting Guidelines

1. **Progressive Disclosure:** Keep `SKILL.md` focused on actionable steps and decision trees. Offload bulky background reading into `references/`.
2. **Deterministic Triggering:** Ensure the `description` explicitly identifies trigger contexts (keywords, domains, tasks).
3. **Executable Helpers:** When multi-step shell commands are needed, write scripts in `scripts/` instead of cluttering prompts.
4. **Validation Gates:** Every skill must have a verification step (e.g. running tests, type checks, or visual confirmations).
