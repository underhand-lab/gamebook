export const WIDTH = 1440;
export const HEIGHT = 1024;
export const SIDEBAR = 256;

export const C = {
  bg: "#F6F7F9",
  surface: "#FFFFFF",
  ink: "#15171A",
  muted: "#6B7280",
  line: "#DDE1E7",
  primary: "#1F6FEB",
  primarySoft: "#E8F1FF",
  green: "#17A673",
  greenSoft: "#E9F8F2",
  amber: "#D97706",
  amberSoft: "#FFF4DF",
  red: "#DC2626",
  redSoft: "#FEECEC",
  dark: "#111827"
};

export const F = {
  Regular: { family: "Inter", style: "Regular" },
  Medium: { family: "Inter", style: "Medium" },
  Semi: { family: "Inter", style: "Semi Bold" },
  Bold: { family: "Inter", style: "Bold" }
} as const;

export const nav = [
  "Home Feed",
  "Timeline",
  "Match Detail",
  "Write Review",
  "Profile",
  "Statistics",
  "Stadium Collection",
  "Badges",
  "Lists",
  "Wrapped"
];

export type FontWeight = keyof typeof F;
