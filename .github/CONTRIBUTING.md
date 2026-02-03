# Contributing to Lokalise Self-Hosted

Thank you for your interest in contributing! We love contributions from everyone. By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## 🌟 Ways to Contribute

There are many ways to contribute to Lokalise Self-Hosted:

- 🐛 **Report bugs** – Help us identify and fix issues
- ✨ **Suggest features** – Share ideas for improvements
- 📝 **Improve documentation** – Help others understand the project
- 💻 **Submit code** – Fix bugs or implement features
- 🎨 **Design** – Improve UI/UX
- 🌍 **Translate** – Help localize the project
- ⭐ **Star the repo** – Show your support

## 🚀 Getting Started

### Prerequisites

- **Bun** >= 1.0 or **pnpm** >= 8.0
- **PostgreSQL** >= 15
- **Git**
- **Node.js** (if not using Bun)

### Development Setup

1. **Fork the repository** on GitHub

2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/lokalise.git
   cd lokalise
   ```

3. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/allanasp/lokalise.git
   ```

4. **Install dependencies:**
   ```bash
   pnpm install
   ```

5. **Set up database:**
   ```bash
   createdb lokalise
   ```

6. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

7. **Run migrations:**
   ```bash
   pnpm run db:migrate
   ```

8. **Start development servers:**
   ```bash
   pnpm run dev
   ```

   Services will be available at:
   - Web UI: http://localhost:3001
   - API: http://localhost:3000

## 📋 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` – New features
- `fix/` – Bug fixes
- `docs/` – Documentation changes
- `refactor/` – Code refactoring
- `test/` – Test additions/changes
- `chore/` – Maintenance tasks

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Update tests as needed
- Update documentation

### 3. Test Your Changes

```bash
# Run linter
pnpm run lint

# Fix linting issues
pnpm run lint:fix

# Format code
pnpm run format

# Type check
pnpm run typecheck

# Run tests (when available)
pnpm run test
```

### 4. Commit Your Changes

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: <type>(<scope>): <description>

git commit -m "feat(api): add endpoint for bulk translation updates"
git commit -m "fix(ui): resolve translation editor layout issue"
git commit -m "docs: update deployment guide"
```

**Commit Types:**
- `feat` – New feature
- `fix` – Bug fix
- `docs` – Documentation changes
- `style` – Code style changes (formatting, etc.)
- `refactor` – Code refactoring
- `perf` – Performance improvements
- `test` – Test changes
- `chore` – Maintenance tasks
- `ci` – CI/CD changes

**Breaking Changes:**
```bash
git commit -m "feat(api)!: change translation endpoint response format

BREAKING CHANGE: The response now includes version metadata"
```

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 🎯 Code Guidelines

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Define proper types (avoid `any`)
- Use interfaces for object shapes
- Export types for public APIs

**Example:**
```typescript
// ✅ Good
interface TranslationKey {
  id: string;
  key: string;
  namespace: string;
  projectId: string;
}

function getKey(id: string): Promise<TranslationKey> {
  // ...
}

// ❌ Bad
function getKey(id: any): any {
  // ...
}
```

### Code Style

We use Biome for linting and formatting:

```bash
# Check code
pnpm run lint

# Auto-fix issues
pnpm run lint:fix

# Format code
pnpm run format
```

**General Rules:**
- Use tabs for indentation
- Max line length: 100 characters
- Use semicolons
- Use double quotes for strings
- Use trailing commas in multiline

### Naming Conventions

- **Files:** `kebab-case.ts` or `PascalCase.tsx` for components
- **Variables:** `camelCase`
- **Constants:** `UPPER_SNAKE_CASE`
- **Types/Interfaces:** `PascalCase`
- **Functions:** `camelCase`
- **Components:** `PascalCase`

### Database Migrations

When changing the database schema:

1. **Update schema:**
   ```typescript
   // packages/db/src/schema/...
   ```

2. **Generate migration:**
   ```bash
   pnpm run db:generate
   ```

3. **Review migration file:**
   ```bash
   # Check generated SQL in packages/db/migrations/
   ```

4. **Test migration:**
   ```bash
   pnpm run db:migrate
   ```

5. **Test rollback (if supported):**
   ```bash
   pnpm run db:rollback
   ```

### API Changes

When modifying API endpoints:

1. Update route handlers
2. Update request/response types
3. Update API documentation
4. Update tests
5. Consider backward compatibility

### UI Changes

When modifying the UI:

1. Follow existing component patterns
2. Use Nuxt UI components when possible
3. Test in light and dark mode
4. Test responsive layouts
5. Add loading states
6. Handle errors gracefully

## 🧪 Testing

### Writing Tests

```typescript
// ✅ Good test structure
describe('TranslationService', () => {
  describe('getTranslations', () => {
    it('should return translations for valid locale', async () => {
      // Arrange
      const locale = 'en';
      const namespace = 'default';

      // Act
      const result = await service.getTranslations(locale, namespace);

      // Assert
      expect(result).toHaveLength(10);
      expect(result[0]).toHaveProperty('key');
    });
  });
});
```

### Test Coverage

Aim for:
- **Critical paths:** 100%
- **Business logic:** 90%+
- **Utilities:** 80%+
- **UI components:** 70%+

## 📝 Documentation

### Code Comments

```typescript
/**
 * Fetches translations for a specific locale and namespace.
 *
 * @param locale - The locale code (e.g., 'en', 'da')
 * @param namespace - The translation namespace
 * @returns Promise resolving to translation records
 * @throws {NotFoundError} When project doesn't exist
 */
export async function getTranslations(
  locale: string,
  namespace: string
): Promise<Translation[]> {
  // Implementation
}
```

### README Updates

Update README.md when:
- Adding new features
- Changing setup process
- Modifying configuration
- Adding dependencies

### API Documentation

Update docs when:
- Adding endpoints
- Changing request/response format
- Modifying authentication
- Changing error codes

## 🐛 Bug Reports

When reporting bugs, include:

1. **Clear description** of the issue
2. **Steps to reproduce**
3. **Expected vs actual behavior**
4. **Environment details** (OS, versions, etc.)
5. **Logs and screenshots**
6. **Minimal reproduction** if possible

Use our [bug report template](.github/ISSUE_TEMPLATE/bug_report.md).

## ✨ Feature Requests

When requesting features, include:

1. **Clear description** of the feature
2. **Use cases** where it would be valuable
3. **Proposed solution** (if you have one)
4. **Alternatives considered**
5. **Additional context**

Use our [feature request template](.github/ISSUE_TEMPLATE/feature_request.md).

## 🔍 Code Review Process

### Submitting PRs

- Fill out the PR template completely
- Link related issues
- Provide clear description
- Add screenshots for UI changes
- Keep PRs focused and reasonably sized
- Respond to review feedback promptly

### Review Guidelines

Reviewers will check:
- Code quality and style
- Test coverage
- Documentation updates
- Breaking changes
- Performance implications
- Security considerations

### Merging

- PRs require at least 1 approval
- All CI checks must pass
- No merge conflicts
- Conventional commit format
- Up-to-date with main branch

## 🎓 Learning Resources

### Project Technologies

- [Bun](https://bun.sh/docs) – JavaScript runtime
- [Hono](https://hono.dev/docs) – Web framework
- [Nuxt](https://nuxt.com/docs) – Vue framework
- [Drizzle ORM](https://orm.drizzle.team/docs) – Database ORM
- [Better Auth](https://www.better-auth.com/docs) – Authentication
- [PostgreSQL](https://www.postgresql.org/docs/) – Database

### Project Structure

```
lokalise/
├── apps/
│   ├── api/          # Hono API server
│   └── web/          # Nuxt admin UI
├── packages/
│   ├── db/           # Database schema & migrations
│   └── sdk-react/    # React Native SDK
└── docs/             # Documentation
```

## 💬 Community

- **GitHub Discussions:** Ask questions, share ideas
- **Issues:** Report bugs, request features
- **Pull Requests:** Contribute code

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## ❤️ Thank You!

Your contributions make Lokalise Self-Hosted better for everyone. We appreciate your time and effort!

**Happy Coding! 🚀**
