import type { ThemeConfig } from "antd";

/**
 * The single source of the panel's visual design: colours, type, shape and layout sizes.
 * Components never hard-code these values. Ant Design reads `theme`, and src/styles/global.css
 * reads the same tokens through the --ant-* CSS variables Ant Design generates from it.
 */

/** Colours sampled from the logo. Too light for text on white, so they are only used for tints. */
const logo = { blue: "#0096e7", green: "#01a44a" } as const;

/**
 * Brand colours for text, links and buttons: the logo's blue and green darkened just enough to
 * reach WCAG AA contrast (4.5:1) on white, and the logo's lettering colour for all text.
 */
export const brand = {
  /** 5.2:1 on white: buttons, links, selected menu items. */
  blue: "#0072af",
  /** 5.2:1 on white: success states and positive figures. */
  green: "#017e39",
  /** The logo's lettering colour; all text shades are derived from it. */
  ink: "#12191c",
} as const;

/** Status colours the logo has no equivalent for: a vivid colour for tints and a text-safe one. */
const statusColors = {
  warning: { vivid: "#d48806", text: "#986204" },
  error: { vivid: "#d11b1e", text: "#d11b1e" },
} as const;

/** Sizes that layout components take as props rather than CSS, in pixels. */
export const layoutSizes = {
  siderWidth: 248,
  siderCollapsedWidth: 72,
  /** Space between cards in a grid, across and down; matches the 16px "middle" gap. */
  gridGutter: 16,
} as const;

/** Look of the dashboard charts. */
export const chartStyle = {
  barColor: brand.blue,
  barMaxWidth: 56,
  barRadius: 4,
  /** Axis labels use the secondary text colour (65% ink, 5.5:1 on white). */
  axisLabelColor: brand.ink,
  axisLabelOpacity: 0.65,
} as const;

export const theme: ThemeConfig = {
  token: {
    ...statusShades("Primary", logo.blue, brand.blue),
    ...statusShades("Info", logo.blue, brand.blue),
    ...statusShades("Success", logo.green, brand.green),
    ...statusShades("Warning", statusColors.warning.vivid, statusColors.warning.text),
    ...statusShades("Error", statusColors.error.vivid, statusColors.error.text),
    colorLink: brand.blue,
    colorLinkHover: shade(brand.blue, 0.12),
    colorLinkActive: shade(brand.blue, 0.24),
    colorTextBase: brand.ink,
    // Hint and description text stays at 4.5:1 or better on white.
    colorTextTertiary: "rgba(18, 25, 28, 0.62)",
    colorTextDescription: "rgba(18, 25, 28, 0.62)",
    colorTextPlaceholder: "rgba(18, 25, 28, 0.5)",
    // Soft grey page background behind white cards; easier on the eyes than all-white.
    colorBgLayout: "#f4f6f8",
    borderRadius: 8,
    controlHeight: 36,
  },
  components: {
    Layout: { headerBg: "#ffffff", headerPadding: "0 24px" },
    Menu: {
      itemBorderRadius: 8,
      itemMarginInline: 8,
      itemHeight: 44,
      iconSize: 16,
      collapsedIconSize: 18,
    },
    Card: { headerFontSize: 16 },
    Statistic: { contentFontSize: 28 },
  },
};

type StatusName = "Primary" | "Info" | "Success" | "Warning" | "Error";
type StatusShade = "" | "Bg" | "BgHover" | "Border" | "BorderHover" | "Hover" | "Active";
type StatusToken<Name extends StatusName> =
  `color${Name}${StatusShade}` | `color${Name}Text${"" | "Hover" | "Active"}`;

/**
 * Every shade Ant Design uses for one status colour. Ant Design would derive these itself, but
 * from darkened colours it makes greyish backgrounds and lighter, lower-contrast hover states.
 * Here backgrounds and borders are light tints of the vivid colour, and hover and pressed states
 * are darker, so text on each shade keeps 4.5:1 or better.
 */
function statusShades<Name extends StatusName>(name: Name, vivid: string, text: string) {
  const hover = shade(text, 0.12);
  const active = shade(text, 0.24);
  return {
    [`color${name}`]: text,
    [`color${name}Bg`]: tint(vivid, 0.08),
    [`color${name}BgHover`]: tint(vivid, 0.16),
    [`color${name}Border`]: tint(vivid, 0.4),
    [`color${name}BorderHover`]: tint(vivid, 0.6),
    [`color${name}Hover`]: hover,
    [`color${name}Active`]: active,
    [`color${name}Text`]: text,
    [`color${name}TextHover`]: hover,
    [`color${name}TextActive`]: active,
  } as Record<StatusToken<Name>, string>;
}

/** `color` mixed into white: amount 0 gives white, 1 gives the colour. */
function tint(color: string, amount: number): string {
  return mix(color, "#ffffff", amount);
}

/** Black mixed into `color`: amount 0 gives the colour, 1 gives black. */
function shade(color: string, amount: number): string {
  return mix("#000000", color, amount);
}

/** `first` and `second` blended per channel, with `weight` of the first. Takes #rrggbb colours. */
function mix(first: string, second: string, weight: number): string {
  const channel = (color: string, index: number) =>
    parseInt(color.slice(1 + index * 2, 3 + index * 2), 16);
  const blended = [0, 1, 2].map((index) =>
    Math.round(channel(first, index) * weight + channel(second, index) * (1 - weight)),
  );
  return `#${blended.map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}
