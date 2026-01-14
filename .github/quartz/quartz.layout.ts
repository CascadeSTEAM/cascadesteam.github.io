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
      href: "/",
      children: jsx("img", {
        src: "/assets/images/Cascade_STEAM_horizontal_logo_primary.svg",
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
  return jsx("footer", {
    class: "custom-footer",
    children: [
      // Top Container for parallel sections
      jsx("div", {
        class: "footer-top",
        children: [
          // Contact Section
          jsx("div", {
            class: "footer-section",
            children: [
              jsx("h4", { children: "Contact Us" }),
              jsx("div", {
                class: "social-icons",
                children: [
                  // Email Link with Icon "mailto:info@cascadesteam.org",
                  jsx("a", { 
                    href: "mailto:info@cascadesteam.org", 
                    ariaLabel: "Email",
                    title: "info@cascadesteam.org",
                    children: jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                      jsx("rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }),
                      jsx("path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" })
                    ]})
                  }),
                  // Phone Link with Icon href: "tel:+1234567890", 
                  jsx("a", { 
                    href: "tel:+1234567890", 
                    title: "+1 (234) 567-890",
                    ariaLabel: "Telephone",
                    children: jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                      jsx("path", { d: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" })
                    ]})
                  }),
                  // PayPal / Donations
                  jsx("a", { 
                    href: "https://www.paypal.com/donate/?hosted_button_id=CLBXLN2E2ZU7C", 
                    title: "Donate via PayPal",
                    ariaLabel: "Donate with PayPal",
                    children: jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                      jsx("path", { d: "M7 17.5h1.9c2.8 0 4.5-1.4 5.1-4.1l1-5.1c.3-1.4-.2-2.3-1.5-2.3H7.5c-.6 0-1.1.4-1.2 1L4 18c-.1.5.3.9.8.9h2.2" }),
                      jsx("path", { d: "M10.5 12.5h1.9c2.8 0 4.5-1.4 5.1-4.1l1-5.1c.3-1.4-.2-2.3-1.5-2.3H11c-.6 0-1.1.4-1.2 1" })
                    ]})
                  }),
                ]
              }),
              jsx("p", { children: "104 W Magnolia St \#2551, Bellingham, WA 98225 USA" }),
            ]
          }),
          
          // Follow Us Section
          jsx("div", {
            class: "footer-section",
            children: [
              jsx("h4", { children: "Follow Us" }),
              jsx("div", {
                class: "social-icons",
                children: [
                  // GitHub
                  jsx("a", { 
                    href: "https://github.com/cascadesteam", 
                    ariaLabel: "GitHub",
                    title: "GitHub",
                    children: jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                      jsx("path", { d: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" })
                    ]})
                  }),
                  // LinkedIn
                  jsx("a", { 
                    href: "https://www.linkedin.com/company/cascadesteam", 
                    ariaLabel: "LinkedIn",
                    title: "LinkedIn",
                    children: jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                      jsx("path", { d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" }),
                      jsx("rect", { x: "2", y: "9", width: "4", height: "12" }),
                      jsx("circle", { cx: "4", cy: "4", r: "2" })
                    ]})
                  }),
                  // Discord
                  jsx("a", { 
                    href: "http://hub.cascadesteam.org/", 
                    ariaLabel: "Discord",
                    title: "Discord",
                    children: jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                        jsx("path", { d: "M18.89 4.34c-1.37-.63-2.83-1.09-4.36-1.34-.19.33-.4.78-.55 1.13-1.62-.23-3.23-.23-4.83 0-.15-.35-.37-.8-.56-1.13-1.53.25-3 .71-4.36 1.34-2.76 4.07-3.5 8.05-3.13 11.98 1.83 1.33 3.6 2.14 5.34 2.67.43-.57.81-1.19 1.14-1.84-.63-.23-1.23-.52-1.8-.86.15-.1.3-.22.44-.33 3.48 1.59 7.25 1.59 10.68 0 .15.1.29.22.44.33-.57.34-1.17.63-1.8.86.33.65.71 1.27 1.14 1.84 1.74-.53 3.52-1.34 5.34-2.67.46-4.54-.72-8.49-3.11-11.98zM8.05 13.9c-1.04 0-1.89-.95-1.89-2.11 0-1.16.83-2.11 1.89-2.11 1.06 0 1.92.95 1.9 2.11 0 1.16-.84 2.11-1.9 2.11zm7 0c-1.04 0-1.89-.95-1.89-2.11 0-1.16.83-2.11 1.9-2.11 1.05 0 1.92.95 1.9 2.11 0 1.16-.82 2.11-1.91 2.11z" })
                      ]})                   
                  }),
                  // Calendar
                  jsx("a", { 
                    href: "https://calendar.google.com/calendar/u/0?cid=Y184M2IzZGQwMDBmNDE0NDhkMTEwOGM2MjNlNWNjZTQ4MThmM2IyZDkyNTZhYzRkM2M1MGQ3YzViMmFlOGJkZWU1QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20", 
                    ariaLabel: "Calendar",
                    title: "Calendar",
                    children: jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                      jsx("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2" }),
                      jsx("path", { d: "M16 2v4M8 2v4M3 10h18" })
                    ]})
                  }),
                ]
              })
            ]
          }),
        ]
      }),




      // Bottom Copyright
      jsx("div", {
        class: "footer-bottom",
        children: jsx("p", { children: "Interested to get involved? Volunteer? Collaborate? We would love to hear from you! Please contact Michael Gan, Cascade STEAM President, for any inquiries at michael.gan@cascadesteam.org, 360-499-2099, or @michael Gan via the Cascade STEAM Community Hub." })
      })
      // Bottom Copyright
      jsx("div", {
        class: "footer-bottom",
        children: jsx("p", { children: "Built with Obsidian and Quartz | © 2026 Cascade STEAM. All rights reserved." })
      })
    ]
  })
}

Footer.displayName = "CustomFooter"

Footer.css = `
.custom-footer {
  margin-top: 3rem;
  padding: 2rem 1rem;
  border-top: 1px solid var(--lightgray);
}

.footer-top {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap; /* Ensures it stacks on mobile */
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.footer-section {
  flex: 1;
  min-width: 200px;
  text-align: center;
}

.footer-section h4 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05rem;
  color: var(--dark);
}

.footer-section p {
  font-size: 0.9rem;
  margin: 0.25rem 0;
  color: var(--gray);
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 1.25rem;
  margin-top: 0.5rem;
}

.social-icons svg {
  width: 24px;
  height: 24px;
  transition: transform 0.2s ease, color 0.2s ease;
  color: var(--gray);
}

.social-icons a:hover svg {
  transform: translateY(-3px);
  color: var(--secondary);
}

.footer-bottom {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.8rem;
  border-top: 1px solid var(--lightgray);
  padding-top: 1rem;
  color: var(--darkgray);
}
`


// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Logo,
  ],
  afterBody: [],
  footer: Footer,
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
        const omit = new Set(["assets", "README.md"])
    
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
