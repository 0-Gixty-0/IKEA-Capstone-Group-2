## Git Branching Strategy

### Main Branches:
- **`main`**: This branch contains the production-ready code. All releases are made from this branch.
- **`develop`**: This branch contains the latest development code. It is where features are integrated before they are ready for release.

### Supporting Branches:
- **`feature/*`**: These branches are used for developing new features. Each feature branch is created from the `develop` branch.
- **`release/*`**: These branches are used for preparing a new production release. They are created from the `develop` branch and merged into both `main` and `develop` after the release.
- **`hotfix/*`**: These branches are used for fixing critical bugs in the production code. They are created from the `main` branch and merged into both `main` and `develop`.

## Commit Naming Conventions

### Commit Types

Use the following prefixes to categorize your commits:

- **feat**: A new feature for the user.
- **fix**: A bug fix for the user.
- **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation.
- **docs**: Documentation-only changes.
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).
- **refactor**: A code change that neither fixes a bug nor adds a feature.
- **perf**: A code change that improves performance.
- **test**: Adding missing tests or correcting existing tests.
- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm).
- **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs).

### Commit Message Structure

Each commit message should consist of a header, an optional body, and an optional footer.

#### Header

The header is mandatory and must conform to the format:
<type>(<scope>): <subject>


- **type**: The type of change (see commit types above).
- **scope**: The scope of the change (a module or file). This is optional but recommended.
- **subject**: A short description of the change (imperative, lower case, no period at the end).

#### Body

The body is optional but provides a detailed explanation of the change, wrapped at 72 characters per line. Include the motivation for the change and contrast this with previous behavior.

#### Footer

The footer is also optional and may include references to issues or breaking changes.

### Example Commit Messages

#### Feature Addition
feat(authentication): add JWT authentication

- Implement JWT-based authentication for user login
- Update user model to store token information
- Modify tests to cover new authentication logic

This change enhances security by switching to stateless token-based authentication.

#### Bug Fix
fix(login): resolve issue causing crash on login

Ensure user credentials are validated correctly to prevent crashes.
(Closes #123)

#### Chore
chore(deps): update dependency versions

## Git Workflow

### Development Workflow:

1. **Create a Feature Branch**:
   ```sh
   git checkout develop
   git pull origin develop
   git checkout -b feature/feature-name
   ```
2. **Work on the Feature**: Commit changes to the feature branch.
   ```sh
   git add .
   git commit -m "feat(frontend): Implement feature-name"
   ```
3. **Push the Feature Branch**:
   ```sh
   git push origin feature/feature-name
   ```
4. **Create a Pull Request**: Create a PR from `feature/feature-name` to `develop` and request reviews.
5. **Merge the Pull Request**: After approval, merge the PR to `develop` and delete the feature branch.

### Release Workflow:

1. **Create a Release Branch**:
   ```sh
   git checkout develop
   git pull origin develop
   git checkout -b release/v1.0.0
   ```
2. **Prepare the Release**: Update version numbers, documentation, etc.
3. **Push the Release Branch**:
   ```sh
   git push origin release/v1.0.0
   ```
4. **Create a Pull Request**: Create a PR from `release/v1.0.0` to `main` and request reviews.
5. **Merge the Pull Request**: After approval, merge the PR to `main` and `develop`, and tag the release.
   ```sh
   git checkout main
   git merge release/v1.0.0
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin main --tags

   git checkout develop
   git merge release/v1.0.0
   git push origin develop
   ```
6. **Delete the Release Branch**:
   ```sh
   git branch -d release/v1.0.0
   git push origin --delete release/v1.0.0
   ```

### Hotfix Workflow:

1. **Create a Hotfix Branch**:
   ```sh
   git checkout main
   git pull origin main
   git checkout -b hotfix/critical-bug
   ```
2. **Fix the Bug**: Commit changes to the hotfix branch.
   ```sh
   git add .
   git commit -m "fix(frontend): fix of critical bug"
   ```
3. **Push the Hotfix Branch**:
   ```sh
   git push origin hotfix/critical-bug
   ```
4. **Create a Pull Request**: Create a PR from `hotfix/critical-bug` to `main` and request reviews.
5. **Merge the Pull Request**: After approval, merge the PR to `main` and `develop`, and tag the hotfix.
   ```sh
   git checkout main
   git merge hotfix/critical-bug
   git tag -a v1.0.1 -m "Hotfix critical bug"
   git push origin main --tags

   git checkout develop
   git merge hotfix/critical-bug
   git push origin develop
   ```
6. **Delete the Hotfix Branch**:
   ```sh
   git branch -d hotfix/critical-bug
   git push origin --delete hotfix/critical-bug
   ```
