- [Introduction](#introduction)
- [Commit Message Format](#commit-message-format)
- [Your First Contribution](#your-first-contribution)
- [License](#license)

# Introduction

Thank you for your interest in contributing to Aide!

This very short guide contains minimal ground rules regarding
what is expected from contributors.

# Commit Message Format

Changelog is based on [conventional commit messages](https://www.conventionalcommits.org/en/v1.0.0/), so it is important for all contributors to follow these guideline.

Additionally if a commit is scoped to one or multiple crates in the repository, the crate names must appear in the commit message scope.

The commit that adds some new feature to `aide` should look like this:

```
feat(aide): added new feature
```

# Your First Contribution

Before you even start working on any code, make sure that your contribution fits the project
and no one is already working on the same thing.

If you are unsure, feel free to open an [issue](https://github.com/tamasfe/aide/issues) or start a [discussion](https://github.com/tamasfe/aide/discussions)!

# Updating a version (for collaborators)

1. Create a version bump commit
2. Create a tag `git tag release-<crate>-<version>`
3. Generate the changelog with `cargo install git-cliff`:  
Make sure you delete the old `# Changelog` title in the changelog file.
```sh
git cliff --config "crates/<crate>/cliff.toml" --include-path "crates/<crate>/**/*" --current --prepend crates/<crate>/CHANGELOG.md
```
4. push the commits and the tag: `git push` and `git push origin release-<crate>-<version>`

# License

All contributions are licensed under MIT or Apache-2.0 at your option.
