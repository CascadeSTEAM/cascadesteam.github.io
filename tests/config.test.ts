/**
 * Tests for the Quartz configuration files.
 *
 * Reads quartz.config.ts and quartz.layout.ts as text and validates that
 * required fields, plugins, and color values are present and well-formed.
 * Because these files depend on the external Quartz framework (downloaded
 * at build time), we inspect them as source text rather than importing them.
 */
import { existsSync, readFileSync } from "fs"
import { join } from "path"
import { describe, expect, it } from "vitest"

const REPO_ROOT = join(import.meta.dirname, "..")
const CONFIG_FILE = join(REPO_ROOT, ".github/quartz/quartz.config.ts")
const LAYOUT_FILE = join(REPO_ROOT, ".github/quartz/quartz.layout.ts")

/** Returns true for valid CSS hex colours (#rgb, #rrggbb, #rrggbbaa). */
function isValidHex(value: string): boolean {
  return /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3}([0-9a-fA-F]{2})?)?$/.test(value)
}

/** Returns true for valid CSS rgb() / rgba() functional notation. */
function isValidRgba(value: string): boolean {
  return /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(\s*,\s*[\d.]+)?\s*\)$/.test(
    value,
  )
}

/** Returns true for any recognised CSS colour format used in this project. */
function isValidColor(value: string): boolean {
  return isValidHex(value) || isValidRgba(value)
}

/** Extracts all colour-like string literals from a block of source text. */
function extractColorValues(source: string): string[] {
  const values: string[] = []
  // Match string literals that start with # or rgba?( — colour-like values.
  const re = /["'](#[^"']+|rgba?\([^"')]+\))["']/g
  let m: RegExpExecArray | null
  while ((m = re.exec(source)) !== null) {
    values.push(m[1])
  }
  return values
}

// ---------------------------------------------------------------------------
// quartz.config.ts
// ---------------------------------------------------------------------------

describe("quartz.config.ts", () => {
  it("file exists", () => {
    expect(existsSync(CONFIG_FILE)).toBe(true)
  })

  it('pageTitle is set to "Cascade STEAM"', () => {
    const src = readFileSync(CONFIG_FILE, "utf-8")
    expect(src).toMatch(/pageTitle:\s*["']Cascade STEAM["']/)
  })

  it("baseUrl is configured", () => {
    const src = readFileSync(CONFIG_FILE, "utf-8")
    expect(src).toMatch(/baseUrl:\s*["'][^"']+["']/)
  })

  it("baseUrl ends with a forward slash", () => {
    const src = readFileSync(CONFIG_FILE, "utf-8")
    const match = src.match(/baseUrl:\s*["']([^"']+)["']/)
    expect(match, "baseUrl must be set").not.toBeNull()
    expect(match![1], "baseUrl must end with /").toMatch(/\/$/)
  })

  it("locale is set to a valid BCP-47 tag", () => {
    const src = readFileSync(CONFIG_FILE, "utf-8")
    expect(src).toMatch(/locale:\s*["'][a-z]{2}-[A-Z]{2}["']/)
  })

  it("analytics provider is specified", () => {
    const src = readFileSync(CONFIG_FILE, "utf-8")
    expect(src).toMatch(/provider:\s*["'][^"']+["']/)
  })

  it("enableSPA is explicitly set", () => {
    const src = readFileSync(CONFIG_FILE, "utf-8")
    expect(src).toMatch(/enableSPA:\s*(true|false)/)
  })

  // -------------------------------------------------------------------------
  // Theme colours
  // -------------------------------------------------------------------------

  describe("theme colours", () => {
    it("a lightMode and a darkMode colour section are defined", () => {
      const src = readFileSync(CONFIG_FILE, "utf-8")
      expect(src).toMatch(/lightMode:\s*\{/)
      expect(src).toMatch(/darkMode:\s*\{/)
    })

    it("all colour values are valid CSS colours (hex or rgba)", () => {
      const src = readFileSync(CONFIG_FILE, "utf-8")

      // Isolate just the colors block so we don't pick up unrelated strings.
      const colorsBlockMatch = src.match(/colors:\s*\{([\s\S]+?)\},\s*\}/)
      expect(
        colorsBlockMatch,
        "colors block must exist in the configuration",
      ).not.toBeNull()

      const colorsBlock = colorsBlockMatch![1]
      const colorValues = extractColorValues(colorsBlock)
      expect(colorValues.length, "at least one colour value expected").toBeGreaterThan(0)

      const invalid = colorValues.filter((v) => !isValidColor(v))
      expect(
        invalid,
        `Invalid CSS colour values found:\n  ${invalid.join("\n  ")}`,
      ).toHaveLength(0)
    })

    it("lightMode defines all required colour roles", () => {
      const src = readFileSync(CONFIG_FILE, "utf-8")
      const lightBlock = src.match(/lightMode:\s*\{([^}]+)\}/)
      expect(lightBlock, "lightMode block must exist").not.toBeNull()
      const roles = ["light", "lightgray", "gray", "darkgray", "dark", "secondary", "tertiary", "highlight", "textHighlight"]
      for (const role of roles) {
        expect(
          lightBlock![1],
          `lightMode must define "${role}"`,
        ).toMatch(new RegExp(`\\b${role}:`))
      }
    })

    it("darkMode defines all required colour roles", () => {
      const src = readFileSync(CONFIG_FILE, "utf-8")
      const darkBlock = src.match(/darkMode:\s*\{([^}]+)\}/)
      expect(darkBlock, "darkMode block must exist").not.toBeNull()
      const roles = ["light", "lightgray", "gray", "darkgray", "dark", "secondary", "tertiary", "highlight", "textHighlight"]
      for (const role of roles) {
        expect(
          darkBlock![1],
          `darkMode must define "${role}"`,
        ).toMatch(new RegExp(`\\b${role}:`))
      }
    })
  })

  // -------------------------------------------------------------------------
  // Typography
  // -------------------------------------------------------------------------

  describe("typography", () => {
    it("header font is specified", () => {
      const src = readFileSync(CONFIG_FILE, "utf-8")
      expect(src).toMatch(/header:\s*["'][^"']+["']/)
    })

    it("body font is specified", () => {
      const src = readFileSync(CONFIG_FILE, "utf-8")
      expect(src).toMatch(/body:\s*["'][^"']+["']/)
    })

    it("code font is specified", () => {
      const src = readFileSync(CONFIG_FILE, "utf-8")
      expect(src).toMatch(/code:\s*["'][^"']+["']/)
    })
  })

  // -------------------------------------------------------------------------
  // Transformer plugins
  // -------------------------------------------------------------------------

  describe("transformer plugins", () => {
    const REQUIRED_TRANSFORMERS = [
      "FrontMatter",
      "CreatedModifiedDate",
      "ObsidianFlavoredMarkdown",
      "GitHubFlavoredMarkdown",
      "CrawlLinks",
      "Description",
      "SyntaxHighlighting",
    ]

    for (const plugin of REQUIRED_TRANSFORMERS) {
      it(`includes the ${plugin} transformer`, () => {
        const src = readFileSync(CONFIG_FILE, "utf-8")
        expect(src).toMatch(new RegExp(`Plugin\\.${plugin}\\(`))
      })
    }
  })

  // -------------------------------------------------------------------------
  // Filter plugins
  // -------------------------------------------------------------------------

  describe("filter plugins", () => {
    it("includes the RemoveDrafts filter", () => {
      const src = readFileSync(CONFIG_FILE, "utf-8")
      expect(src).toMatch(/Plugin\.RemoveDrafts\(/)
    })
  })

  // -------------------------------------------------------------------------
  // Emitter plugins
  // -------------------------------------------------------------------------

  describe("emitter plugins", () => {
    const REQUIRED_EMITTERS = [
      "ContentPage",
      "ContentIndex",
      "Assets",
      "Static",
      "NotFoundPage",
      "AliasRedirects",
      "Favicon",
    ]

    for (const emitter of REQUIRED_EMITTERS) {
      it(`includes the ${emitter} emitter`, () => {
        const src = readFileSync(CONFIG_FILE, "utf-8")
        expect(src).toMatch(new RegExp(`Plugin\\.${emitter}\\(`))
      })
    }

    it("ContentIndex has siteMap enabled", () => {
      const src = readFileSync(CONFIG_FILE, "utf-8")
      expect(src).toMatch(/enableSiteMap:\s*true/)
    })

    it("ContentIndex has RSS enabled", () => {
      const src = readFileSync(CONFIG_FILE, "utf-8")
      expect(src).toMatch(/enableRSS:\s*true/)
    })
  })
})

// ---------------------------------------------------------------------------
// quartz.layout.ts
// ---------------------------------------------------------------------------

describe("quartz.layout.ts", () => {
  it("file exists", () => {
    expect(existsSync(LAYOUT_FILE)).toBe(true)
  })

  it("exports sharedPageComponents", () => {
    const src = readFileSync(LAYOUT_FILE, "utf-8")
    expect(src).toMatch(/export\s+const\s+sharedPageComponents/)
  })

  it("exports defaultContentPageLayout", () => {
    const src = readFileSync(LAYOUT_FILE, "utf-8")
    expect(src).toMatch(/export\s+const\s+defaultContentPageLayout/)
  })

  it("exports defaultListPageLayout", () => {
    const src = readFileSync(LAYOUT_FILE, "utf-8")
    expect(src).toMatch(/export\s+const\s+defaultListPageLayout/)
  })

  it("Head component is included in the shared layout", () => {
    const src = readFileSync(LAYOUT_FILE, "utf-8")
    expect(src).toMatch(/Component\.Head\(\)/)
  })

  it("footer component is present in the shared layout", () => {
    const src = readFileSync(LAYOUT_FILE, "utf-8")
    expect(src).toMatch(/Component\.CSFooter\(\)/)
  })

  it("Explorer component filters out the assets directory", () => {
    const src = readFileSync(LAYOUT_FILE, "utf-8")
    // The filter should reference "assets" so it is hidden from the sidebar.
    expect(src).toMatch(/["']assets["']/)
  })

  it("Search component is present in the content page layout", () => {
    const src = readFileSync(LAYOUT_FILE, "utf-8")
    expect(src).toMatch(/Component\.Search\(\)/)
  })

  it("Darkmode component is present in the content page layout", () => {
    const src = readFileSync(LAYOUT_FILE, "utf-8")
    expect(src).toMatch(/Component\.Darkmode\(\)/)
  })
})
