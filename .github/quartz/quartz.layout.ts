import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { jsx } from "preact/jsx-runtime"

// instead of "import Logo from "./Logo.tsx" -
// Define the component right here in the layout file
// using jsx() instead of JSX syntax
const Logo: Component.QuartzComponent = () => {
  return jsx("div", {
    class: "logo",
    children: jsx("a", {
      href: "/cascadesteam/",
      children: jsx("img", {
        src: "/cascadesteam/assets/images/Cascade_STEAM_horizontal_logo_primary.svg",
        alt: "Site Logo",
        width: "600px", 
        height: "178px"
      })
    })
  })
}
Logo.displayName = "Logo"
Logo.css = `
.logo {
  padding: 1rem;
  text-align: center;
}
`

const Footer: Component.QuartzComponent = () => {
  return jsx("div", {
    class: "custom-footer",
    children: jsx("p", {
      children: "© 2023 Cascade STEAM. All rights reserved."
    })
  })
}
Footer.displayName = "CustomFooter"
Footer.css = `
.custom-footer {
  text-align: center;
  font-size: 0.9rem;
  color: var(--qt-color-darkgray);
}
`


// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Logo,
  ],
  afterBody: [
    Footer,
  ],
  footer: Component.Footer({
    links: {
      "GitHub": "https://github.com/growlf/cascadesteam",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.Breadcrumbs(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.Explorer({
      filterFn: (node) => {
        // set containing names of everything you want to filter out
        const omit = new Set(["assets", "README"])
    
        // can also use node.slug or by anything on node.data
        // note that node.data is only present for files that exist on disk
        // (e.g. implicit folder nodes that have no associated index.md)
        return !omit.has(node.displayName.toLowerCase())
      },
    }),
  ],
  right: [
    Component.DesktopOnly(Component.Graph()),
    Component.DesktopOnly(Component.TableOfContents()),
    //Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.Breadcrumbs(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer({
      filterFn: (node) => {
        // set containing names of everything you want to filter out
        const omit = new Set(["assets", "README"])
    
        // can also use node.slug or by anything on node.data
        // note that node.data is only present for files that exist on disk
        // (e.g. implicit folder nodes that have no associated index.md)
        return !omit.has(node.displayName.toLowerCase())
      },
    })),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    //Component.Backlinks(),
  ],
}
