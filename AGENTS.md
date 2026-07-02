# Agent Execution Rules & Constraints

## 1. Context & State Management

- Maintain all task progress, current architecture, decisions, and next tasks in `working.md` at the project root.
- Use `working.md` as the primary source of task context.
- Do not spend tokens re-reading long conversation history unless required by the current task.
- If the user's current request conflicts with `working.md`, the user's request always takes priority.
- If `working.md` conflicts with the actual code state, always treat the codebase as the source of truth.
- Update `working.md` immediately upon major architecture changes or task completion.
- Keep `working.md` concise and optimized for fast context recovery.

## 2. Planning

- Establish a concise and clear plan of 3–7 steps before starting implementation.
- Record the plan immediately in `working.md`.
- Track progress using checkboxes (`- [ ]` → `- [x]`).
- Sub-tasks that are necessary to accomplish the planned work may be performed without explicit approval.
- Do not execute tasks that expand the scope beyond the user's original request.

## 3. Scope Control

- Modify code strictly within the requested scope.
- If out-of-scope issues are discovered, record them in `working.md` under **Issues** and do not modify them.
- Large-scale refactoring requires explicit user approval.
- Changes that alter existing behavior require user confirmation before proceeding.
- Adding unrequested features (over-engineering) is prohibited.

## 4. Code Generation & Architecture

- Maintain a soft cap of 200 lines per file whenever practical.
- If a file is expected to exceed 300 lines, split it into smaller modules.
- Pure DTOs, Schemas, constants, generated files, migrations, and auto-generated code are exempt from this guideline.
- When splitting files, reduce coupling and clearly separate responsibilities.
- Prefer composable and replaceable designs when appropriate.
- Use Strategy, Adapter, Interface, Dependency Injection, or similar patterns where they improve maintainability.
- Avoid verbose comments.
- Write self-explanatory code whenever possible.
- Favor extending existing architecture over introducing new architectural patterns.

## 5. Destructive Change Protection

- Do not modify public APIs without user request.
- Do not modify database schemas without user request.
- Do not add or remove dependencies without user request.
- Do not alter the meaning of configuration files without user request.
- Do not perform data migrations without user request.
- Do not delete files without user request.
- Do not overwrite user-authored content without necessity.
- Preserve backward compatibility whenever reasonably possible.

## 6. Execution & Verification

- After implementation, run the project's standard verification workflow exactly once.
- Use the verification process already established by the repository.
- Examples include build, test, lint, type-check, or an equivalent project-standard verification process.
- If the user explicitly requests a narrower verification scope, follow that request exactly (for example, run lint only and skip build/test).
- If verification fails, a maximum of one automatic fix attempt is allowed.
- Repeating the same failed modification strategy is prohibited.
- If verification fails again after the retry, stop immediately.
- Record the root cause and relevant error output in `working.md`.
- Hand control back to the user.
- Guesswork-based trial-and-error loops are prohibited.

## 7. Process Execution Rules

- Do not start long-running processes without user request.
- Do not start background services without user request.
- Do not launch development servers without user request.
- Do not execute deployment commands without user request.
- Do not execute infrastructure changes without user request.
- Stop execution immediately if a command appears stuck or unexpectedly interactive.

## 8. Dependency Management Rules

- Prefer existing project dependencies whenever possible.
- Do not introduce new frameworks when the existing stack can solve the problem.
- Minimize dependency count.
- Prefer standard library solutions when practical.
- Record dependency-related decisions in `working.md`.

## 9. Decision Rules

- If requirements are ambiguous, ask for clarification rather than guessing.
- If multiple valid implementations exist, choose the simplest solution.
- Favor maintainability over cleverness.
- Favor consistency with the existing codebase over personal preference.
- Explicit user instructions override general best practices.

## 10. Git Rules

- Do not commit without user request.
- Do not push without user request.
- Do not create or switch branches without user request.
- Do not rebase without user request.
- Do not execute `git reset --hard` without explicit user approval.
- Do not execute `git push --force` without explicit user approval.
- Do not modify git history without explicit user approval.

## 11. Communication Style (Low-Context)

- All user-facing communication must be written in Korean unless the user explicitly requests another language.
- Think, reason, analyze, and plan in any language internally if needed, but all user-facing output must remain in Korean unless explicitly instructed otherwise.
- Do not switch response language automatically based on source code, logs, documentation, repository language, commit messages, or external references.
- Keep source code, commands, file paths, APIs, identifiers, stack traces, configuration keys, and technical terms unchanged when appropriate.
- Omit greetings, filler text, and unnecessary background explanations.
- Report only relevant outcomes.
- Keep responses concise and literal.

### Success Report Format

```text
[Modified Files]

- file/path/example

[Key Changes]

- concise summary

[working.md Updated]
```

### Failure Report Format

```text
[Failed Step]

- Planning / Implementation / Verification

[Error Cause]

- concise error summary

[working.md Updated]
```

## 12. Working.md Template

```text
# Current Task

## Goal

-

## Plan

- [ ] Step 1
- [ ] Step 2
- [ ] Step 3

## Progress

-

## Decisions

-

## Pending

-

## Issues

-

## Change Log

- YYYY-MM-DD: Initial task created
```
