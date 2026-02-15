# Project Instructions

## Git Workflow Reminders

**Proactively remind the user about git best practices during coding sessions:**

### When to commit
- After completing a single logical unit of work (one feature, one fix, one refactor)
- Before starting a different type of change
- After getting something working (don't wait until everything is done)

### How to commit
1. **Always work on a feature branch**, never directly on `main`
   - Branch naming: `feat/description`, `fix/description`, `refactor/description`
2. **Keep commits small and focused** — one commit = one logical change
3. **Use conventional commit messages:**
   - `feat: add company name search with autocomplete`
   - `fix: use split-adjusted EPS for 7-year CAGR`
   - `refactor: switch API client from FMP to Finnhub`
   - `style: update tabs layout spacing`
   - `chore: install radix tabs dependency`
4. **Create a PR to merge into `main`** — don't push directly

### When to remind
- After a feature or fix is complete and type-checks
- If the user has made 2+ distinct changes without committing
- Before switching to a different area of work
