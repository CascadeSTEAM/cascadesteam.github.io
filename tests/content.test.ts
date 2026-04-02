/**
 * Tests for markdown content files.
 *
 * Validates that all content pages have required frontmatter fields
 * (title, description), that tags are properly formatted, and that
 * aliases are unique across the site.
 */
import { readFileSync, readdirSync, statSync } from "fs"
import { join, relative, extname, basename } from "path"
import { describe, expect, it } from "vitest"
import matter from "gray-matter"

const REPO_ROOT = join(import.meta.dirname, "..")

/** Directories to skip entirely when scanning for markdown files. */
const SKIP_DIRS = new Set([
  ".git",
  ".obsidian",
  "node_modules",
  "assets/_templates",
  "assets/fragments",
])

/** Individual files to exclude from content-quality checks. */
const EXCLUDED_FILES = new Set(["README.md"])

function getAllMarkdownFiles(dir: string): string[] {
  const results: string[] = []
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    const relPath = relative(REPO_ROOT, fullPath)
    if (entry.startsWith(".") || SKIP_DIRS.has(relPath)) continue
    const stat = statSync(fullPath)
    if (stat.isDirectory()) {
      results.push(...getAllMarkdownFiles(fullPath))
    } else if (extname(entry) === ".md") {
      results.push(fullPath)
    }
  }
  return results
}

/** Returns content markdown files that should have full frontmatter. */
function getContentFiles(): string[] {
  return getAllMarkdownFiles(REPO_ROOT).filter((f) => {
    if (EXCLUDED_FILES.has(basename(f))) return false
    // Skip draft pages (e.g. redirect stubs) — they are not published content.
    const { data } = matter(readFileSync(f, "utf-8"))
    if (data.draft === true) return false
    return true
  })
}

const contentFiles = getContentFiles()

describe("Markdown content files", () => {
  it("at least one content file is found", () => {
    expect(contentFiles.length).toBeGreaterThan(0)
  })

  describe("title frontmatter", () => {
    it("every content file has a non-empty title", () => {
      const missing: string[] = []
      for (const file of contentFiles) {
        const { data } = matter(readFileSync(file, "utf-8"))
        if (!data.title || String(data.title).trim() === "") {
          missing.push(relative(REPO_ROOT, file))
        }
      }
      expect(
        missing,
        `Files missing a title:\n  ${missing.join("\n  ")}`,
      ).toHaveLength(0)
    })
  })

  describe("description frontmatter", () => {
    it("every content file has a non-empty description", () => {
      const missing: string[] = []
      for (const file of contentFiles) {
        const { data } = matter(readFileSync(file, "utf-8"))
        if (!data.description || String(data.description).trim() === "") {
          missing.push(relative(REPO_ROOT, file))
        }
      }
      expect(
        missing,
        `Files missing a description:\n  ${missing.join("\n  ")}`,
      ).toHaveLength(0)
    })

    it("every description is at least 20 characters long", () => {
      const tooShort: string[] = []
      for (const file of contentFiles) {
        const { data } = matter(readFileSync(file, "utf-8"))
        if (
          data.description &&
          String(data.description).trim().length < 20
        ) {
          tooShort.push(
            `${relative(REPO_ROOT, file)}: "${data.description}"`,
          )
        }
      }
      expect(
        tooShort,
        `Files with a description shorter than 20 chars:\n  ${tooShort.join("\n  ")}`,
      ).toHaveLength(0)
    })
  })

  describe("tags frontmatter", () => {
    it("tags field, when present, is an array", () => {
      const invalid: string[] = []
      for (const file of contentFiles) {
        const { data } = matter(readFileSync(file, "utf-8"))
        if (data.tags !== undefined && !Array.isArray(data.tags)) {
          invalid.push(
            `${relative(REPO_ROOT, file)}: tags is ${typeof data.tags} ("${data.tags}")`,
          )
        }
      }
      expect(
        invalid,
        `Files where tags is not an array:\n  ${invalid.join("\n  ")}`,
      ).toHaveLength(0)
    })

    it("all individual tags are non-empty strings", () => {
      const invalid: string[] = []
      for (const file of contentFiles) {
        const { data } = matter(readFileSync(file, "utf-8"))
        if (Array.isArray(data.tags)) {
          for (const tag of data.tags) {
            if (typeof tag !== "string" || tag.trim() === "") {
              invalid.push(
                `${relative(REPO_ROOT, file)}: tag "${tag}"`,
              )
            }
          }
        }
      }
      expect(
        invalid,
        `Files with empty or non-string tags:\n  ${invalid.join("\n  ")}`,
      ).toHaveLength(0)
    })
  })

  describe("aliases uniqueness", () => {
    it("no two content files share the same alias", () => {
      const seen = new Map<string, string>() // normalised alias → first file
      const duplicates: string[] = []
      for (const file of contentFiles) {
        const { data } = matter(readFileSync(file, "utf-8"))
        const relPath = relative(REPO_ROOT, file)
        if (!data.aliases) continue
        const aliases = Array.isArray(data.aliases)
          ? data.aliases
          : [data.aliases]
        for (const alias of aliases) {
          const key = String(alias).toLowerCase()
          if (seen.has(key)) {
            duplicates.push(
              `"${alias}" in ${relPath} (first seen in ${seen.get(key)})`,
            )
          } else {
            seen.set(key, relPath)
          }
        }
      }
      expect(
        duplicates,
        `Duplicate aliases found:\n  ${duplicates.join("\n  ")}`,
      ).toHaveLength(0)
    })
  })
})
