---
draft: true
---

# Cascade STEAM Website

This project is the source for the [Cascade STEAM website](https://cascadesteam.org), built using [Quartz 4](https://quartz.jzhao.xyz/) and organized as an [Obsidian](https://obsidian.md/) vault.

## Project Structure

- `About/`: Organization information, Code of Conduct, Leadership profiles.
- `assets/`: Media (images, icons, documents) and reusable fragments (header/footer).
  - `assets/fragments/`: Contains `global-header.md` and `global-footer.md` used by Quartz.
  - `assets/images/`: Site logos and project-specific images.
- `Events/`: Event-related information and archives.
- `About/Donate.md`: Donation page.
- `About/Outreach.md`: Outreach materials page.
- `About/get-involved.md`: Get Involved page.
- `Groups/`: Information about community groups (AI, Cyber, Engineering, etc.).
- `internal/`: Internal documents (not intended for public site, excluded via Quartz config).
- `Projects/`: Active and past community projects.
- `.github/quartz/`: Quartz configuration (`quartz.config.ts`) and layout (`quartz.layout.ts`).
- `index.md`: The homepage of the site.

## Technical Stack

- **Framework**: Quartz 4 (Custom fork: `CascadeSTEAM/quartz`, branch: `csmods`).
- **Content**: Markdown (GitHub Flavored + Obsidian Flavored).
- **Styling**: SCSS (see `.github/quartz/custom.scss`).
- **Configuration**: TypeScript.

## Key Conventions

### Markdown & Frontmatter
- All pages should have appropriate frontmatter.
- **Landing Pages**: Use `layout: landing-page` to remove sidebar components and enable custom styling.
- **Drafts**: Use `draft: true` to prevent a page from being published.
- **Links**: Prefer Obsidian-style wikilinks `[[Path/To/File]]` or shortest-path resolution as configured in `quartz.config.ts`.
- **Assets**: Reference images via `![[assets/images/filename.png]]`.

### Quartz Configuration
- **Ignore Patterns**: Files in `internal/`, `private/`, `templates/`, and `.obsidian/` are ignored by Quartz.
- **Recent Notes**: The "Recent Notes" section on the homepage excludes items from `assets/` and `templates/`.
- **Explorer**: The sidebar "Directory" excludes the `assets` folder.

## Workflow

1. **Content Creation**: Add or edit Markdown files in the appropriate directories.
2. **Metadata**: Ensure `title`, `description`, and relevant `tags` are in the frontmatter.
3. **Internal Docs**: Keep non-public information in the `internal/` directory.
4. **Fragments**: Update `assets/fragments/global-header.md` or `global-footer.md` to change the site-wide header or footer.
5. **CI/CD**: The site is automatically synced from `main` to `publish` and deployed to GitHub Pages via GitHub Actions.

## Style Guidelines

- **Typography**: Header (Rubik), Body (Source Sans Pro), Code (IBM Plex Mono).
- **Colors**:
  - Primary (Light Mode): `#d46329ff` (Orange/Tertiary), `#34b0bf` (Cyan/Dark).
  - Primary (Dark Mode): `#34b0bf` (Cyan/Secondary).
- **Visuals**: Aim for clean, professional aesthetics with high readability.
## Contact Us

Interested to [get involved](get-involved.md)? Volunteer? Collaborate? We would love to hear from you! Please contact [Michael Gan](https://www.linkedin.com/in/michaelbgan), Cascade STEAM President, for any inquiries at [info@cascadesteam.org](mailto:info@cascadesteam.org), [360-499-2099](tel:3604992099), or **@Michael Gan** via the [Cascade STEAM Community Hub](http://hub.cascadesteam.org).
