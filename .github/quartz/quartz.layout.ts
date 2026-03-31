import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { jsx } from "preact/jsx-runtime" // Add this import at the top


// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.DocumentContent({ 
      targetSlug: "assets/fragments/global-header", 
    }),
  ],
  afterBody: [
    Component.ConditionalRender({
      // component: Component.RecentNotes({limit: 5, showTags: true,}),
      component: Component.RecentNotes({
        title: "Recent Notes",
        limit: 5,
        // Custom filter function
        filter: (f) => {
          // Exclude paths starting with assets/ or templates/
          return !(f.slug?.startsWith("assets/") || f.slug?.startsWith("templates/"))
        },
        // Optionally, ignore specific file extensions
        // filter: (f) => !f.slug?.endsWith(".excalidraw"), 
      }),
      condition: (page) => page.fileData.slug == "index",
    }),
    Component.DocumentContent({targetSlug: "assets/fragments/global-footer", }),
  ],
  footer: Component.CSFooter(),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs({showCurrentPage: false,}),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: (page) => page.fileData.frontmatter?.layout !== "landing-page",
    }),
    Component.ConditionalRender({
      component: Component.ContentMeta(),
      condition: (page) => page.fileData.frontmatter?.layout !== "landing-page",
    }),
    Component.ConditionalRender({
      component: Component.TagList(),
      condition: (page) => page.fileData.frontmatter?.layout !== "landing-page",
    }),    
  ],
  left: [
    Component.ConditionalRender({
      component: Component.Logo(),
      condition: (page) => page.fileData.frontmatter?.layout !== "landing-page",
    }),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      title: "Directory",
      // folderClickBehavior: "collapse",
      // Add the filter function here
      filterFn: (node) => {
        // List folders or files you want to hide
        const omit = new Set(["assets"])
        
        // Check against the node's display name or slug
        return !omit.has(node.displayName.toLowerCase())
      },
    })
  ],
  right: [
    Component.DesktopOnly((props) => {
      const isLandingPage = props.fileData.frontmatter?.layout === "landing-page"
      if (isLandingPage) return null
      return jsx(props.displayClass ?? "div", {
        children: [
          Component.TableOfContents()(props),
        ],
      })
    }),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs({showCurrentPage: false,}),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
  ],
  left: [
    Component.Logo(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      title: "Directory",
      filterFn: (node) => {
        const omit = new Set(["assets"])
        return !omit.has(node.displayName.toLowerCase())
      },
    })
  ],
  right: [],
}
