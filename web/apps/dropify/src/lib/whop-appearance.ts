/**
 * Shared Whop Elements appearance for all Kattassie creator-kit checkouts.
 * Keep this limited to documented, typed appearance fields so it works across
 * every mounted Whop element without relying on undocumented part selectors.
 */
export const whopAppearance = {
  theme: {
    appearance: "dark",
    accentColor: "teal",
    grayColor: "slate",
    successColor: "teal",
    dangerColor: "ruby",
    warningColor: "amber",
    infoColor: "sky",
  },
  variables: {
    "--radius": "12px",
  },
} as const;
