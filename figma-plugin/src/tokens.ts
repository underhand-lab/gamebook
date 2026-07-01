export const WIDTH = 1440;
export const HEIGHT = 1024;
export const SIDEBAR = 256;

export const C = {
  bg: "#F6F1EA",
  surface: "#FFFFFF",
  ink: "#171A1F",
  muted: "#6B7280",
  line: "#DED6CB",
  primary: "#1F6FEB",
  primarySoft: "#E8F1FF",
  green: "#16A34A",
  greenSoft: "#EAF7EF",
  amber: "#D97706",
  amberSoft: "#FFF4DF",
  red: "#DC2626",
  redSoft: "#FDECEC",
  dark: "#111827"
};

export const F = {
  Regular: { family: "Avenir Next", style: "Regular" },
  Medium: { family: "Avenir Next", style: "Medium" },
  Semi: { family: "Avenir Next", style: "Demi Bold" },
  Bold: { family: "Avenir Next", style: "Bold" }
} as const;

export const nav = [
  "Home",
  "Timeline",
  "Match Detail",
  "Write Review",
  "Profile",
  "Stadium Collection",
  "Badges",
  "Lists",
  "Wrapped"
];

export type FontWeight = keyof typeof F;
