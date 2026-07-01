import { ScreenSpec } from "./spec";
import { C, HEIGHT, nav, SIDEBAR, WIDTH } from "./tokens";
import { buttonFrame, cardFrame, chip, decorate, frame, rect, row, stack, text } from "./nodes";
export function createScreen(spec: ScreenSpec, index: number) {
  const root = frame(spec.name, WIDTH, HEIGHT, C.bg);
  root.x = (index % 2) * (WIDTH + 120);
  root.y = Math.floor(index / 2) * (HEIGHT + 120);
  root.layoutMode = "HORIZONTAL";
  root.primaryAxisSizingMode = "FIXED";
  root.counterAxisSizingMode = "FIXED";

  root.appendChild(sidebar(spec.name));
  root.appendChild(mainContent(spec));
  return root;
}
function mainContent(spec: ScreenSpec) {
  const main = stack(`${spec.name} / Main`, WIDTH - SIDEBAR, 24, 40, C.bg);
  main.layoutGrow = 1;
  main.resize(WIDTH - SIDEBAR, HEIGHT);
  main.counterAxisSizingMode = "FIXED";

  const header = row(`${spec.name} / Header`, 16);
  const titleBox = stack("Title", 850, 6);
  titleBox.appendChild(text(spec.name, 32, "Bold"));
  titleBox.appendChild(text(spec.subtitle, 14, "Regular", C.muted));
  header.appendChild(titleBox);
  header.appendChild(buttonFrame("Primary CTA", spec.ctaLabel, C.primary, "#FFFFFF"));

  main.appendChild(header);
  main.appendChild(tabBar(spec.tabs));
  if (!spec.hideMetrics) {
    main.appendChild(metricRow(spec.metrics));
  }

  main.appendChild(spec.name === "Profile" ? profileGrid(spec) : defaultGrid(spec));
  return main;
}

function defaultGrid(spec: ScreenSpec) {
  const grid = row(`${spec.name} / Content Grid`, 24);
  spec.panels.forEach((panel, index) => {
    grid.appendChild(panelFrame(panel, index === 0 ? 456 : 286));
  });
  return grid;
}

function profileGrid(spec: ScreenSpec) {
  const grid = row(`${spec.name} / Split Grid`, 24);
  const left = stack("Profile Left", 456, 16);
  const right = stack("Profile Right", 520, 16);

  left.appendChild(panelFrame(spec.panels[0], 456));
  right.appendChild(panelFrame(spec.panels[1], 520));
  right.appendChild(panelFrame(spec.panels[2], 520));
  right.appendChild(panelFrame(spec.panels[3], 520));

  grid.appendChild(left);
  grid.appendChild(right);
  return grid;
}
function sidebar(active: string) {
  const node = stack("Sidebar Navigation", SIDEBAR, 12, 24, C.dark);
  node.resize(SIDEBAR, HEIGHT);
  node.counterAxisSizingMode = "FIXED";
  node.appendChild(text("gamelog", 24, "Bold", "#FFFFFF"));
  node.appendChild(text("micro posts for games", 12, "Regular", "#B7C0CE"));
  nav.forEach(item => node.appendChild(navItem(item, item === active)));
  return node;
}
function navItem(label: string, active: boolean) {
  const item = row(`Nav Item / ${label}`, 10, active ? C.primary : "transparent");
  item.resize(208, 40);
  item.paddingLeft = 12;
  item.paddingRight = 12;
  item.cornerRadius = 999;
  item.appendChild(rect("Icon", 16, 16, active ? "#FFFFFF" : "#6B7280"));
  item.appendChild(text(label, 13, "Medium", active ? "#FFFFFF" : "#D1D5DB"));
  return item;
}
function metricRow(items: string[]) {
  const node = row("Metric Cards", 16);
  items.forEach(item => {
    const metric = cardFrame(`Metric / ${item}`, 250);
    metric.appendChild(text(item, 16, "Bold"));
    metric.appendChild(text("현재 앱 구조 기준 요약", 12, "Regular", C.muted));
    node.appendChild(metric);
  });
  return node;
}
function panelFrame(spec: ScreenSpec["panels"][number], width: number) {
  const panel = cardFrame(spec.title, width);
  panel.appendChild(text(spec.title, 18, "Bold"));

  if (spec.kind === "match") spec.items.forEach(item => panel.appendChild(matchRow(item)));
  if (spec.kind === "review") spec.items.forEach(item => panel.appendChild(reviewRow(item)));
  if (spec.kind === "chips") panel.appendChild(chipCloud(spec.items));
  if (spec.kind === "score") panel.appendChild(scoreboard(spec.items));
  if (spec.kind === "bars") spec.items.forEach(item => panel.appendChild(barRow(item)));
  if (spec.kind === "form") spec.items.forEach(item => panel.appendChild(inputRow(item)));
  if (spec.kind === "profile") panel.appendChild(profileBlock(spec.items));
  if (spec.kind === "map") panel.appendChild(mapBlock(spec.items));
  if (spec.kind === "stadium") spec.items.forEach(item => panel.appendChild(stadiumRow(item)));
  if (spec.kind === "badges") panel.appendChild(badgeGrid(spec.items));
  if (spec.kind === "list") spec.items.forEach(item => panel.appendChild(listRow(item)));
  if (spec.kind === "wrapped") spec.items.forEach(item => panel.appendChild(wrappedCard(item)));
  return panel;
}
function matchRow(label: string) {
  const node = row(`Match Card / ${label}`, 12, C.surface);
  node.resize(244, 72);
  decorate(node);
  node.appendChild(rect("Team thumbnail", 48, 48, C.primarySoft));
  const copy = stack("Match copy", 160, 4);
  copy.appendChild(text(label, 14, "Semi"));
  copy.appendChild(text("평점, 감정, 태그, 팬 관점", 11, "Regular", C.muted));
  node.appendChild(copy);
  return node;
}
function reviewRow(label: string) {
  const node = stack(`Review Card / ${label}`, 244, 8, 14, C.surface);
  decorate(node);
  node.appendChild(text("4.5 / 홈팀 팬", 12, "Semi", C.primary));
  node.appendChild(text(label, 14, "Medium"));
  node.appendChild(text("좋아요, 스포일러, 감정, 태그", 11, "Regular", C.muted));
  return node;
}
function chipCloud(items: string[]) {
  const node = row("Chip Cloud", 8);
  node.layoutWrap = "WRAP";
  node.resize(244, 120);
  items.forEach(item => node.appendChild(chip(item)));
  return node;
}
function scoreboard(items: string[]) {
  const node = stack("Scoreboard", 440, 16, 20, C.primarySoft);
  node.cornerRadius = 20;
  node.appendChild(text(items[0], 28, "Bold", C.primary));
  node.appendChild(text(items[1], 28, "Bold", C.ink));
  node.appendChild(text(items[2], 13, "Regular", C.muted));
  return node;
}
function barRow(label: string) {
  const value = Number(label.split(" ").pop()) || 60;
  const node = stack(`Bar / ${label}`, 244, 8);
  node.appendChild(text(label, 13, "Medium"));
  const track = frame("Track", 220, 10, C.primarySoft);
  track.cornerRadius = 10;
  track.appendChild(rect("Value", Math.max(24, value * 2), 10, C.primary));
  node.appendChild(track);
  return node;
}
function inputRow(label: string) {
  const field = stack(`Field / ${label}`, 244, 8);
  field.appendChild(text(label, 12, "Semi", C.muted));
  const input = frame("Input", 244, label === "장문 리뷰" ? 100 : 42, C.surface);
  decorate(input);
  input.appendChild(text(`Enter ${label}`, 12, "Regular", C.muted));
  input.paddingLeft = 12;
  input.paddingTop = 12;
  field.appendChild(input);
  return field;
}
function profileBlock(items: string[]) {
  const node = stack("Profile Block", 420, 12);
  node.appendChild(rect("Avatar", 72, 72, C.primarySoft));
  node.appendChild(text("넓은 화면에서는 좌측 프로필 정보 영역", 12, "Regular", C.muted));
  items.forEach(item => node.appendChild(text(item, 14, "Medium")));
  return node;
}
function mapBlock(items: string[]) {
  const map = frame("Editable Map Wireframe", 420, 320, C.surface);
  decorate(map);
  [40, 140, 260, 360].forEach((x, index) => {
    const pin = rect(`Map Pin / ${items[index]}`, 18, 18, C.primary);
    pin.x = x;
    pin.y = 70 + index * 42;
    map.appendChild(pin);
  });
  map.appendChild(text("Map layout uses rectangles, not image assets.", 12, "Medium", C.muted));
  return map;
}
function stadiumRow(label: string) {
  const node = row(`Stadium / ${label}`, 12, C.surface);
  decorate(node);
  node.resize(244, 64);
  node.appendChild(rect("Stadium marker", 36, 36, C.greenSoft));
  node.appendChild(text(label, 13, "Semi"));
  return node;
}
function badgeGrid(items: string[]) {
  const grid = row("Badge Grid", 10);
  grid.layoutWrap = "WRAP";
  grid.resize(244, 180);
  items.forEach(label => {
    const badge = stack(`Badge / ${label}`, 78, 8, 8, C.surface);
    decorate(badge);
    badge.appendChild(rect("Badge Icon", 34, 34, C.amberSoft));
    badge.appendChild(text(label, 11, "Medium"));
    grid.appendChild(badge);
  });
  return grid;
}
function listRow(label: string) {
  const node = stack(`List Card / ${label}`, 244, 6, 14, C.surface);
  decorate(node);
  node.appendChild(text(label, 15, "Bold"));
  node.appendChild(text("Saved matches, likes, notes", 11, "Regular", C.muted));
  return node;
}
function wrappedCard(label: string) {
  const node = stack(`Wrapped Card / ${label}`, 244, 10, 16, C.primary);
  node.cornerRadius = 20;
  node.appendChild(text(label, 18, "Bold", "#FFFFFF"));
  node.appendChild(text("Annual memory module", 12, "Regular", "#DCEBFF"));
  return node;
}
function tabBar(items: string[]) {
  const tabs = row("Tabs", 8);
  items.forEach((item, index) => tabs.appendChild(chip(item, index === 0)));
  return tabs;
}
