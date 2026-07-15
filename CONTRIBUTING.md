# Contributing to @ngx-firebase

Thanks for your interest in contributing to `@ngx-firebase`! Here are the guidelines and steps to help you get started with the project.

---

## 🛠️ Local Development Setup

To set up the project locally on your machine:

1. **Fork and Clone** the repository:
   ```bash
   git clone https://github.com/quedicesebas/ngx-firebase.git
   cd ngx-firebase
   ```
2. **Install Dependencies** using npm:
   ```bash
   npm install
   ```

---

## 🧪 Running Tests

We use **Vitest** in JSDOM mode as our native test runner. Tests are run inside Node's virtual browser context for high-performance and lightweight CI execution.

To run the unit tests:
```bash
npm run test
```

---

## 📦 Building the Library

To compile the library and output the production FESM/DTS bundles:
```bash
npm run build
```
The output will be generated inside the `dist/ngx-firebase/` directory.

---

## 📝 Commit Guidelines

We enforce **Conventional Commits** to auto-generate release logs and manage semantic versions. Every commit message must match the following format:

```
<type>(<scope>): <description>
```

### Examples:
- `feat(providers): add custom emulator connect support`
- `fix(rxjs): resolve unsubscribe handler memory leak`
- `docs(readme): update initialization example configuration`
- `ci(github): configure publish action workflow`

---

## 🚀 Creating Pull Requests

1. Create a new branch with a prefix (e.g., `feature/custom-emulators` or `bugfix/auth-listener`).
2. Implement your changes, keeping them focused and clean.
3. Make sure all unit tests compile and pass (`npm run test`).
4. Ensure the build succeeds (`npm run build`).
5. Open a Pull Request referencing the issue you are addressing.
