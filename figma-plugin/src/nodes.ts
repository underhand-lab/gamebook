import { C, F, FontWeight } from "./tokens";

export function frame(name: string, w: number, h: number, fill?: string | null) {
  const node = figma.createFrame();
  node.name = name;
  node.resize(w, h);
  node.fills = fill ? [paint(fill)] : [];
  node.clipsContent = false;
  return node;
}

export function rect(name: string, w: number, h: number, fill: string) {
  const node = figma.createRectangle();
  node.name = name;
  node.resize(w, h);
  node.fills = [paint(fill)];
  node.cornerRadius = 10;
  return node;
}

export function text(value: string, size = 14, weight: FontWeight = "Regular", color = C.ink) {
  const node = figma.createText();
  node.name = `Text / ${value}`;
  node.fontName = F[weight];
  node.characters = value;
  node.fontSize = size;
  node.fills = [paint(color)];
  node.textAutoResize = "WIDTH_AND_HEIGHT";
  return node;
}

export function row(name: string, gap = 12, fill?: string | null) {
  const node = frame(name, 10, 10, fill || null);
  auto(node, "HORIZONTAL", gap, 0);
  return node;
}

export function stack(name: string, width: number, gap = 12, pad = 0, fill?: string | null) {
  const node = frame(name, width, 10, fill);
  auto(node, "VERTICAL", gap, pad);
  node.counterAxisSizingMode = "FIXED";
  return node;
}

export function cardFrame(name: string, width: number) {
  const node = stack(name, width, 14, 18, C.surface);
  decorate(node);
  return node;
}

export function buttonFrame(name: string, label: string, fill: string, color: string) {
  const node = row(name, 8, fill);
  node.paddingLeft = 18;
  node.paddingRight = 18;
  node.paddingTop = 12;
  node.paddingBottom = 12;
  node.cornerRadius = 999;
  node.appendChild(text(label, 14, "Semi", color));
  return node;
}

export function chip(label: string, active = false) {
  const node = row(`Chip / ${label}`, 8, active ? C.primary : C.surface);
  node.paddingLeft = 14;
  node.paddingRight = 14;
  node.paddingTop = 8;
  node.paddingBottom = 8;
  node.cornerRadius = 999;
  node.strokes = [paint(active ? C.primary : C.line)];
  node.appendChild(text(label, 12, "Medium", active ? "#FFFFFF" : C.ink));
  return node;
}

export function auto(node: FrameNode | ComponentNode, mode: "HORIZONTAL" | "VERTICAL", gap: number, pad: number) {
  node.layoutMode = mode;
  node.primaryAxisSizingMode = "AUTO";
  node.counterAxisSizingMode = "AUTO";
  node.itemSpacing = gap;
  node.paddingLeft = pad;
  node.paddingRight = pad;
  node.paddingTop = pad;
  node.paddingBottom = pad;
}

export function decorate(node: FrameNode | ComponentNode) {
  node.cornerRadius = 20;
  node.strokes = [paint(C.line)];
  node.strokeWeight = 1;
}

export function paint(hex: string): SolidPaint {
  if (hex === "transparent") {
    return { type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 0 };
  }

  const value = hex.replace("#", "");
  const num = parseInt(value, 16);
  return {
    type: "SOLID",
    color: {
      r: ((num >> 16) & 255) / 255,
      g: ((num >> 8) & 255) / 255,
      b: (num & 255) / 255
    }
  };
}
