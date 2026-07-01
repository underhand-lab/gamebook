import { C, nav } from "./tokens";
import { auto, buttonFrame, chip, decorate, paint, rect, row, stack, text } from "./nodes";

export function createDesignSystem(page: PageNode) {
  const root = stack("Design System / Tokens & Components", 1440, 32, 48, C.bg);
  page.appendChild(root);

  root.appendChild(text("gamelog Design System", 40, "Bold"));
  root.appendChild(text("Editable Figma tokens and reusable components matched to the current frontend theme.", 16, "Regular", C.muted));
  root.appendChild(tokenSection());
  root.appendChild(componentSection());
}

function tokenSection() {
  const section = stack("Tokens", 1344, 24);
  section.appendChild(text("Tokens", 24, "Bold"));

  const colors = row("Color tokens", 16);
  Object.entries(C).forEach(([name, hex]) => {
    const item = stack(`Color / ${name}`, 112, 8);
    item.appendChild(rect(`Swatch / ${name}`, 112, 64, hex));
    item.appendChild(text(name, 12, "Semi"));
    item.appendChild(text(hex, 11, "Regular", C.muted));
    colors.appendChild(item);
  });

  const type = row("Typography tokens", 20);
  [["Display", 40, "Bold"], ["Title", 24, "Bold"], ["Body", 16, "Regular"], ["Caption", 12, "Medium"]].forEach(token => {
    const item = stack(`Typography / ${token[0]}`, 220, 8);
    item.appendChild(text(String(token[0]), Number(token[1]), token[2] as any));
    item.appendChild(text(`${token[1]}px / ${token[2]}`, 12, "Regular", C.muted));
    type.appendChild(item);
  });

  const spacing = row("Spacing tokens", 16);
  [4, 8, 12, 16, 24, 32, 48, 64].forEach(value => {
    const item = stack(`Spacing / ${value}`, 92, 8);
    item.appendChild(rect(`${value}px`, value + 24, 24, C.primarySoft));
    item.appendChild(text(`${value}px`, 12, "Semi"));
    spacing.appendChild(item);
  });

  section.appendChild(colors);
  section.appendChild(type);
  section.appendChild(spacing);
  return section;
}

function componentSection() {
  const section = stack("Components", 1344, 24);
  section.appendChild(text("Components", 24, "Bold"));

  const rowA = row("Buttons / Cards / Tabs", 24);
  rowA.appendChild(buttonComponent("Button / Primary", "프로필 수정", C.primary, "#FFFFFF"));
  rowA.appendChild(buttonComponent("Button / Secondary", "경기 보기", C.surface, C.ink));
  rowA.appendChild(cardComponent());
  rowA.appendChild(tabsComponent());

  const rowB = row("Review / Match / Sidebar", 24);
  rowB.appendChild(reviewComponent());
  rowB.appendChild(matchComponent());
  rowB.appendChild(sidebarComponent("Profile"));

  section.appendChild(rowA);
  section.appendChild(rowB);
  return section;
}

function buttonComponent(name: string, label: string, fill: string, color: string) {
  const component = figma.createComponent();
  component.name = name;
  auto(component, "HORIZONTAL", 8, 14);
  component.cornerRadius = 999;
  component.fills = [paint(fill)];
  component.appendChild(text(label, 14, "Semi", color));
  return component;
}

function cardComponent() {
  const component = figma.createComponent();
  component.name = "Card";
  auto(component, "VERTICAL", 8, 16);
  component.resize(220, 120);
  decorate(component);
  component.appendChild(text("Card Title", 16, "Bold"));
  component.appendChild(text("Rounded, bright surface with subtle border and shadow.", 12, "Regular", C.muted));
  return component;
}

function tabsComponent() {
  const component = figma.createComponent();
  component.name = "Tabs";
  auto(component, "HORIZONTAL", 8, 0);
  ["프로필", "내 포스트", "오늘 경기"].forEach((label, index) => component.appendChild(chip(label, index === 0)));
  return component;
}

function reviewComponent() {
  const component = figma.createComponent();
  component.name = "Review Card";
  auto(component, "VERTICAL", 8, 16);
  component.resize(320, 150);
  decorate(component);
  component.appendChild(text("Review Card", 16, "Bold"));
  component.appendChild(text("평점, 팬 관점, 스포일러, 감정, 좋아요", 12, "Regular", C.muted));
  component.appendChild(text("전체 최신 탭의 인기 포스트 예시", 14, "Medium"));
  return component;
}

function matchComponent() {
  const component = figma.createComponent();
  component.name = "Match Card";
  auto(component, "HORIZONTAL", 12, 16);
  component.resize(320, 96);
  decorate(component);
  component.appendChild(rect("Match visual", 56, 56, C.primarySoft));
  component.appendChild(text("Match Card / 팀, 날짜, 평점, 감정, 태그", 14, "Medium", C.muted));
  return component;
}

function sidebarComponent(active: string) {
  const component = figma.createComponent();
  component.name = "Sidebar Navigation";
  auto(component, "VERTICAL", 12, 20);
  component.resize(256, 420);
  component.fills = [paint(C.dark)];
  component.appendChild(text("gamelog", 22, "Bold", "#FFFFFF"));
  component.appendChild(text("micro posts for games", 12, "Regular", "#B7C0CE"));
  nav.slice(0, 5).forEach(item => component.appendChild(buttonFrame(`Nav / ${item}`, item, item === active ? C.primary : "transparent", item === active ? "#FFFFFF" : "#D1D5DB")));
  return component;
}
