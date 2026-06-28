// Runtime bundle for Figma. Edit the TypeScript source in code.ts and src/.
const WIDTH = 1440;
const HEIGHT = 1024;
const SIDEBAR = 256;

const C = {
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

const F = {
  Regular: { family: "Inter", style: "Regular" },
  Medium: { family: "Inter", style: "Medium" },
  Semi: { family: "Inter", style: "Semi Bold" },
  Bold: { family: "Inter", style: "Bold" }
};

const nav = [
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

const screens = [
  {
    name: "Home Feed",
    subtitle: "Remember Every Game.",
    tabs: ["For You", "Following", "KBO", "Football", "eSports"],
    metrics: ["12 games this week", "4.6 avg rating", "128 new reviews"],
    panels: [
      { title: "Featured Matches", kind: "match", items: ["FC Seoul vs Jeonbuk", "KBO Playoff Game 5", "Lakers vs Warriors"] },
      { title: "Latest Reviews", kind: "review", items: ["올해 최고의 직관이었다", "원정 팬 입장에서는 너무 아쉬운 경기", "마지막 10분이 모든 것을 바꿨다"] },
      { title: "Trending Tags", kind: "chips", items: ["플레이오프", "올해최고", "다시보고싶다", "최고의직관"] }
    ]
  },
  {
    name: "Timeline",
    subtitle: "MatchLogAggregate 기반 개인 기록 피드",
    tabs: ["All Logs", "In Person", "Live", "High Rating"],
    metrics: ["148 timeline items", "38 in person", "Top emotion: moved"],
    panels: [
      { title: "MatchLogAggregate Feed", kind: "match", items: ["FC Seoul vs Jeonbuk / 4.5", "KBO Playoff Game 5 / moved", "Worlds Finals / 최고의직관"] },
      { title: "Record Snapshot", kind: "review", items: ["fanPerspective: HOME_FAN", "emotion: MOVED", "mvpVote: player-10"] },
      { title: "Typed Tags", kind: "chips", items: ["OFFICIAL: 결승전", "USER: 올해최고", "USER: 다시보고싶다"] }
    ]
  },
  {
    name: "Match Detail",
    subtitle: "경기 정보, 팬 관점별 리뷰, 평점, MVP, 감정, 태그 집계",
    tabs: ["전체", "홈팬", "원정팬", "타팀 팬", "중립 팬"],
    metrics: ["4.7 community rating", "832 reviews", "MVP 42%"],
    panels: [
      { title: "Scoreboard", kind: "score", items: ["FC Seoul 3", "Jeonbuk 2", "2026.06.28 / Seoul World Cup Stadium"] },
      { title: "Fan Perspective Rating", kind: "bars", items: ["전체 94", "홈팬 98", "원정팬 71", "중립 88"] },
      { title: "Reviews", kind: "review", items: ["첫 직관으로 평생 기억될 경기", "패배했지만 MVP는 원정팀 골키퍼", "스포일러 포함 리뷰 예시"] }
    ]
  },
  {
    name: "Write Review",
    subtitle: "관람 방식, 팬 관점, 별점, 리뷰, 감정, 태그, MVP 입력",
    tabs: ["경기 선택", "리뷰 작성", "확인"],
    metrics: ["Required: match", "Required: rating", "Required: fan view"],
    panels: [
      { title: "Selected Match", kind: "match", items: ["FC Seoul vs Jeonbuk", "Final / 3-2", "직관 인증 대기"] },
      { title: "Review Form", kind: "form", items: ["관람 방식", "팬 관점", "별점", "한줄평", "장문 리뷰", "대표 감정", "MVP", "태그"] },
      { title: "Preview", kind: "review", items: ["홈팀 팬 / 4.5", "스포일러 표시", "좋아요는 공감의 의미"] }
    ]
  },
  {
    name: "Profile",
    subtitle: "사용자의 모든 경기 기록과 리뷰를 저장하는 공간",
    tabs: ["Overview", "Reviews", "Matches", "Lists"],
    metrics: ["148 total games", "38 in person", "4.2 avg rating"],
    panels: [
      { title: "Profile Header", kind: "profile", items: ["easyh", "응원팀 FC Seoul", "첫 직관 2019"] },
      { title: "Recent Logs", kind: "match", items: ["FC Seoul vs Jeonbuk", "KBO Playoff Game 5", "Worlds Finals"] },
      { title: "Recent Reviews", kind: "review", items: ["첫 직관은 평생 기억된다", "올해 최고의 경기", "다시 보고 싶은 경기"] }
    ]
  },
  {
    name: "Statistics",
    subtitle: "가장 많이 본 팀, 선수, 경기장, 직관 승률, 응원팀 승률",
    tabs: ["Summary", "Teams", "Players", "Stadiums"],
    metrics: ["Most watched: FC Seoul", "In-person win rate 61%", "Support team win rate 54%"],
    panels: [
      { title: "Top Teams", kind: "bars", items: ["FC Seoul 88", "Doosan Bears 56", "Lakers 34", "T1 29"] },
      { title: "Top Stadiums", kind: "bars", items: ["Seoul WC 72", "Jamsil 31", "Gocheok 14"] },
      { title: "Rating Distribution", kind: "bars", items: ["5 stars 64", "4 stars 48", "3 stars 21", "2 stars 8"] }
    ]
  },
  {
    name: "Stadium Collection",
    subtitle: "방문한 경기장을 수집하고 지도 형태로 확인",
    tabs: ["Map", "Visited", "Wishlist"],
    metrics: ["14 stadiums visited", "38 verified visits", "3 countries"],
    panels: [
      { title: "Visited Map", kind: "map", items: ["Seoul", "Busan", "Incheon", "Daegu"] },
      { title: "Stadium Cards", kind: "stadium", items: ["Seoul World Cup Stadium", "Jamsil Baseball Stadium", "Gocheok Sky Dome"] },
      { title: "Verification", kind: "chips", items: ["Verified Attendance", "Ticket linked", "Manual log"] }
    ]
  },
  {
    name: "Badges",
    subtitle: "경험, 활동, 특별 순간을 배지로 보관",
    tabs: ["All", "Experience", "Activity", "Special"],
    metrics: ["18 earned", "7 experience", "4 special"],
    panels: [
      { title: "Experience", kind: "badges", items: ["첫 경기", "첫 직관", "첫 승리", "첫 포스트시즌", "첫 해외 직관"] },
      { title: "Activity", kind: "badges", items: ["첫 리뷰", "리뷰왕", "출석왕"] },
      { title: "Special", kind: "badges", items: ["우승 직관", "노히트노런 직관", "해트트릭 직관"] }
    ]
  },
  {
    name: "Lists",
    subtitle: "사용자가 자신만의 경기 리스트를 만드는 공간",
    tabs: ["My Lists", "Liked", "Discover"],
    metrics: ["8 lists", "312 likes", "42 saved matches"],
    panels: [
      { title: "My Lists", kind: "list", items: ["최고의 경기", "최고의 직관", "울었던 경기"] },
      { title: "List Detail", kind: "match", items: ["2019 첫 직관", "2026 최고의 경기", "2031 우승 직관"] },
      { title: "Community Likes", kind: "review", items: ["리스트 좋아요는 Post-MVP", "공감 기반 인터랙션", "큐레이션 공유"] }
    ]
  },
  {
    name: "Wrapped",
    subtitle: "매년 스포츠 활동을 자동 요약",
    tabs: ["2026", "Highlights", "Share"],
    metrics: ["72 games watched", "18 in person", "4.5 avg rating"],
    panels: [
      { title: "Year Summary", kind: "wrapped", items: ["올해 본 경기 72", "직관 횟수 18", "최고의 경기 FC Seoul Final"] },
      { title: "Top Memories", kind: "match", items: ["첫 원정 직관", "우승 직관", "올해 최고의 리뷰"] },
      { title: "Share Preview", kind: "chips", items: ["팬의 스포츠 인생", "기억 중심", "연간 회고"] }
    ]
  }
];

async function run() {
  await Promise.all(Object.values(F).map(font => figma.loadFontAsync(font)));
  const dsPage = figma.createPage();
  dsPage.name = uniquePageName("gamelog Design System");
  const components = createDesignSystem(dsPage);
  const wirePage = figma.createPage();
  wirePage.name = uniquePageName("gamelog Wireframes");
  screens.forEach((spec, index) => wirePage.appendChild(createScreen(spec, index, components)));
  figma.currentPage = wirePage;
  figma.viewport.scrollAndZoomIntoView(wirePage.children);
  figma.closePlugin("gamelog wireframes generated.");
}

function uniquePageName(base) {
  const names = figma.root.children.map(page => page.name);
  if (!names.includes(base)) return base;
  let index = 2;
  while (names.includes(`${base} ${index}`)) index += 1;
  return `${base} ${index}`;
}

function createDesignSystem(page) {
  const root = stack("Design System / Tokens & Components", 1440, 32, 48, C.bg);
  root.x = 0;
  root.y = 0;
  page.appendChild(root);
  root.appendChild(text("gamelog Design System", 40, "Bold"));
  root.appendChild(text("Editable Figma tokens and reusable components generated from the Product Spec.", 16, "Regular", C.muted));
  root.appendChild(tokenSection());
  const componentGrid = stack("Components", 1344, 24, 0, null);
  componentGrid.appendChild(text("Components", 24, "Bold"));
  const rowA = row("Buttons / Cards / Tabs", 24);
  const button = buttonComponent("Button / Primary", "Write Review", C.primary, "#FFFFFF");
  const secondary = buttonComponent("Button / Secondary", "View Match", C.primarySoft, C.primary);
  const card = cardComponent();
  const tabs = tabsComponent();
  rowA.appendChild(button);
  rowA.appendChild(secondary);
  rowA.appendChild(card);
  rowA.appendChild(tabs);
  const rowB = row("Review / Match / Sidebar", 24);
  const review = reviewComponent();
  const match = matchComponent();
  const sidebar = sidebarComponent("Home Feed");
  rowB.appendChild(review);
  rowB.appendChild(match);
  rowB.appendChild(sidebar);
  componentGrid.appendChild(rowA);
  componentGrid.appendChild(rowB);
  root.appendChild(componentGrid);
  return { button, secondary, card, tabs, review, match, sidebar };
}

function tokenSection() {
  const section = stack("Tokens", 1344, 24, 0, null);
  section.appendChild(text("Tokens", 24, "Bold"));
  const colors = row("Color tokens", 16);
  Object.entries(C).forEach(([name, hex]) => {
    const item = stack(`Color / ${name}`, 112, 8, 0, null);
    item.appendChild(rect(`Swatch / ${name}`, 112, 64, hex));
    item.appendChild(text(name, 12, "Semi"));
    item.appendChild(text(hex, 11, "Regular", C.muted));
    colors.appendChild(item);
  });
  const type = row("Typography tokens", 20);
  [["Display", 40, "Bold"], ["Title", 24, "Bold"], ["Body", 16, "Regular"], ["Caption", 12, "Medium"]].forEach(t => {
    const item = stack(`Typography / ${t[0]}`, 220, 8, 0, null);
    item.appendChild(text(t[0], t[1], t[2]));
    item.appendChild(text(`${t[1]}px / ${t[2]}`, 12, "Regular", C.muted));
    type.appendChild(item);
  });
  const spacing = row("Spacing tokens", 16);
  [4, 8, 12, 16, 24, 32, 48, 64].forEach(value => {
    const item = stack(`Spacing / ${value}`, 92, 8, 0, null);
    item.appendChild(rect(`${value}px`, value + 24, 24, C.primarySoft));
    item.appendChild(text(`${value}px`, 12, "Semi"));
    spacing.appendChild(item);
  });
  section.appendChild(colors);
  section.appendChild(type);
  section.appendChild(spacing);
  return section;
}

function createScreen(spec, index, components) {
  const root = frame(spec.name, WIDTH, HEIGHT, C.bg);
  root.x = (index % 2) * (WIDTH + 120);
  root.y = Math.floor(index / 2) * (HEIGHT + 120);
  auto(root, "HORIZONTAL", 0, 0);
  root.primaryAxisSizingMode = "FIXED";
  root.counterAxisSizingMode = "FIXED";
  root.appendChild(sidebar(spec.name));
  const main = stack(`${spec.name} / Main`, WIDTH - SIDEBAR, 24, 40, C.bg);
  main.layoutGrow = 1;
  main.resize(WIDTH - SIDEBAR, HEIGHT);
  main.counterAxisSizingMode = "FIXED";
  const header = row(`${spec.name} / Header`, 16);
  const titleBox = stack("Title", 850, 6, 0, null);
  titleBox.appendChild(text(spec.name, 32, "Bold"));
  titleBox.appendChild(text(spec.subtitle, 14, "Regular", C.muted));
  header.appendChild(titleBox);
  header.appendChild(buttonFrame("Primary CTA", "Record Match", C.primary, "#FFFFFF"));
  main.appendChild(header);
  main.appendChild(tabBar(spec.tabs));
  main.appendChild(metricRow(spec.metrics));
  const grid = row(`${spec.name} / Content Grid`, 24);
  spec.panels.forEach((panel, i) => grid.appendChild(panelFrame(panel, i === 0 ? 456 : 286, components)));
  main.appendChild(grid);
  root.appendChild(main);
  return root;
}

function panelFrame(spec, width, components) {
  const p = cardFrame(spec.title, width);
  p.appendChild(text(spec.title, 18, "Bold"));
  if (spec.kind === "match") spec.items.forEach(item => p.appendChild(matchRow(item)));
  if (spec.kind === "review") spec.items.forEach(item => p.appendChild(reviewRow(item)));
  if (spec.kind === "chips") p.appendChild(chipCloud(spec.items));
  if (spec.kind === "score") p.appendChild(scoreboard(spec.items));
  if (spec.kind === "bars") spec.items.forEach(item => p.appendChild(barRow(item)));
  if (spec.kind === "form") spec.items.forEach(item => p.appendChild(inputRow(item)));
  if (spec.kind === "profile") p.appendChild(profileBlock(spec.items));
  if (spec.kind === "map") p.appendChild(mapBlock(spec.items));
  if (spec.kind === "stadium") spec.items.forEach(item => p.appendChild(stadiumRow(item)));
  if (spec.kind === "badges") p.appendChild(badgeGrid(spec.items));
  if (spec.kind === "list") spec.items.forEach(item => p.appendChild(listRow(item)));
  if (spec.kind === "wrapped") spec.items.forEach(item => p.appendChild(wrappedCard(item)));
  return p;
}

function sidebar(active) {
  const s = stack("Sidebar Navigation", SIDEBAR, 12, 24, C.dark);
  s.resize(SIDEBAR, HEIGHT);
  s.counterAxisSizingMode = "FIXED";
  s.appendChild(text("gamelog", 24, "Bold", "#FFFFFF"));
  s.appendChild(text("Remember Every Game.", 12, "Regular", "#B7C0CE"));
  nav.forEach(item => s.appendChild(navItem(item, item === active)));
  return s;
}

function navItem(label, active) {
  const item = row(`Nav Item / ${label}`, 10, active ? C.primary : "transparent");
  item.resize(208, 40);
  item.paddingLeft = 12;
  item.paddingRight = 12;
  item.cornerRadius = 8;
  item.appendChild(rect("Icon", 16, 16, active ? "#FFFFFF" : "#6B7280"));
  item.appendChild(text(label, 13, "Medium", active ? "#FFFFFF" : "#D1D5DB"));
  return item;
}

function metricRow(items) {
  const r = row("Metric Cards", 16);
  items.forEach(item => {
    const m = cardFrame(`Metric / ${item}`, 250);
    m.appendChild(text(item, 16, "Bold"));
    m.appendChild(text("Auto-generated summary", 12, "Regular", C.muted));
    r.appendChild(m);
  });
  return r;
}

function matchRow(label) {
  const c = row(`Match Card / ${label}`, 12, C.surface);
  c.resize(244, 72);
  decorate(c);
  c.appendChild(rect("Team thumbnail", 48, 48, C.primarySoft));
  const copy = stack("Match copy", 160, 4, 0, null);
  copy.appendChild(text(label, 14, "Semi"));
  copy.appendChild(text("Rating, tags, fan perspective", 11, "Regular", C.muted));
  c.appendChild(copy);
  return c;
}

function reviewRow(label) {
  const c = stack(`Review Card / ${label}`, 244, 8, 14, C.surface);
  decorate(c);
  c.appendChild(text("4.5 / Home fan", 12, "Semi", C.primary));
  c.appendChild(text(label, 14, "Medium"));
  c.appendChild(text("Likes, spoiler, emotion, tags", 11, "Regular", C.muted));
  return c;
}

function chipCloud(items) {
  const wrap = row("Chip Cloud", 8);
  wrap.layoutWrap = "WRAP";
  wrap.resize(244, 120);
  items.forEach(item => wrap.appendChild(chip(item)));
  return wrap;
}

function scoreboard(items) {
  const box = stack("Scoreboard", 440, 16, 20, C.primarySoft);
  box.cornerRadius = 12;
  box.appendChild(text(items[0], 28, "Bold", C.primary));
  box.appendChild(text(items[1], 28, "Bold", C.ink));
  box.appendChild(text(items[2], 13, "Regular", C.muted));
  return box;
}

function barRow(label) {
  const parts = label.split(" ");
  const value = Number(parts[parts.length - 1]) || 60;
  const r = stack(`Bar / ${label}`, 244, 8, 0, null);
  r.appendChild(text(label, 13, "Medium"));
  const track = frame("Track", 220, 10, C.primarySoft);
  track.cornerRadius = 10;
  track.appendChild(rect("Value", Math.max(24, value * 2), 10, C.primary));
  r.appendChild(track);
  return r;
}

function inputRow(label) {
  const f = stack(`Field / ${label}`, 244, 8, 0, null);
  f.appendChild(text(label, 12, "Semi", C.muted));
  const input = frame("Input", 244, label === "장문 리뷰" ? 100 : 42, C.surface);
  decorate(input);
  input.appendChild(text(`Enter ${label}`, 12, "Regular", C.muted));
  input.paddingLeft = 12;
  input.paddingTop = 12;
  return f;
}

function profileBlock(items) {
  const b = stack("Profile Block", 244, 12, 0, null);
  b.appendChild(rect("Avatar", 72, 72, C.primarySoft));
  items.forEach(item => b.appendChild(text(item, 14, "Medium")));
  return b;
}

function mapBlock(items) {
  const map = frame("Editable Map Wireframe", 420, 320, "#EEF2F7");
  decorate(map);
  [40, 140, 260, 360].forEach((x, i) => {
    const pin = rect(`Map Pin / ${items[i]}`, 18, 18, C.primary);
    pin.x = x;
    pin.y = 70 + i * 42;
    map.appendChild(pin);
  });
  map.appendChild(text("Map layout uses rectangles, not image assets.", 12, "Medium", C.muted));
  return map;
}

function stadiumRow(label) {
  const r = row(`Stadium / ${label}`, 12, C.surface);
  decorate(r);
  r.resize(244, 64);
  r.appendChild(rect("Stadium marker", 36, 36, C.greenSoft));
  r.appendChild(text(label, 13, "Semi"));
  return r;
}

function badgeGrid(items) {
  const g = row("Badge Grid", 10);
  g.layoutWrap = "WRAP";
  g.resize(244, 180);
  items.forEach(label => {
    const b = stack(`Badge / ${label}`, 78, 8, 8, C.surface);
    decorate(b);
    b.appendChild(rect("Badge Icon", 34, 34, C.amberSoft));
    b.appendChild(text(label, 11, "Medium"));
    g.appendChild(b);
  });
  return g;
}

function listRow(label) {
  const r = stack(`List Card / ${label}`, 244, 6, 14, C.surface);
  decorate(r);
  r.appendChild(text(label, 15, "Bold"));
  r.appendChild(text("Saved matches, likes, notes", 11, "Regular", C.muted));
  return r;
}

function wrappedCard(label) {
  const c = stack(`Wrapped Card / ${label}`, 244, 10, 16, C.primary);
  c.cornerRadius = 14;
  c.appendChild(text(label, 18, "Bold", "#FFFFFF"));
  c.appendChild(text("Annual memory module", 12, "Regular", "#DCEBFF"));
  return c;
}

function tabBar(items) {
  const tabs = row("Tabs", 8);
  items.forEach((item, index) => tabs.appendChild(chip(item, index === 0)));
  return tabs;
}

function chip(label, active) {
  const c = row(`Chip / ${label}`, 8, active ? C.primary : C.surface);
  c.paddingLeft = 14;
  c.paddingRight = 14;
  c.paddingTop = 8;
  c.paddingBottom = 8;
  c.cornerRadius = 18;
  c.strokes = [paint(active ? C.primary : C.line)];
  c.appendChild(text(label, 12, "Medium", active ? "#FFFFFF" : C.ink));
  return c;
}

function buttonComponent(name, label, fill, color) {
  const c = figma.createComponent();
  c.name = name;
  auto(c, "HORIZONTAL", 8, 14);
  c.cornerRadius = 8;
  c.fills = [paint(fill)];
  c.appendChild(text(label, 14, "Semi", color));
  return c;
}

function cardComponent() {
  const c = figma.createComponent();
  c.name = "Card";
  auto(c, "VERTICAL", 8, 16);
  c.resize(220, 120);
  decorate(c);
  c.appendChild(text("Card Title", 16, "Bold"));
  c.appendChild(text("Reusable card container", 12, "Regular", C.muted));
  return c;
}

function tabsComponent() {
  const c = figma.createComponent();
  c.name = "Tabs";
  auto(c, "HORIZONTAL", 8, 0);
  ["All", "Home Fan", "Away Fan"].forEach((label, i) => c.appendChild(chip(label, i === 0)));
  return c;
}

function reviewComponent() {
  const c = figma.createComponent();
  c.name = "Review Card";
  auto(c, "VERTICAL", 8, 16);
  c.resize(320, 150);
  decorate(c);
  c.appendChild(text("Review Card", 16, "Bold"));
  c.appendChild(text("Rating, fan perspective, spoiler, emotion, likes", 12, "Regular", C.muted));
  c.appendChild(text("스포츠는 결과보다 기억이다.", 14, "Medium"));
  return c;
}

function matchComponent() {
  const c = figma.createComponent();
  c.name = "Match Card";
  auto(c, "HORIZONTAL", 12, 16);
  c.resize(320, 96);
  decorate(c);
  c.appendChild(rect("Match visual", 56, 56, C.primarySoft));
  const copy = stack("Copy", 220, 6, 0, null);
  copy.appendChild(text("Match Card", 16, "Bold"));
  copy.appendChild(text("Teams, date, rating, official tags", 12, "Regular", C.muted));
  c.appendChild(copy);
  return c;
}

function sidebarComponent(active) {
  const c = figma.createComponent();
  c.name = "Sidebar Navigation";
  auto(c, "VERTICAL", 12, 20);
  c.resize(256, 420);
  c.fills = [paint(C.dark)];
  c.appendChild(text("gamelog", 22, "Bold", "#FFFFFF"));
  nav.slice(0, 6).forEach(item => c.appendChild(navItem(item, item === active)));
  return c;
}

function buttonFrame(name, label, fill, color) {
  const b = row(name, 8, fill);
  b.paddingLeft = 18;
  b.paddingRight = 18;
  b.paddingTop = 12;
  b.paddingBottom = 12;
  b.cornerRadius = 8;
  b.appendChild(text(label, 14, "Semi", color));
  return b;
}

function cardFrame(name, width) {
  const c = stack(name, width, 14, 18, C.surface);
  decorate(c);
  return c;
}

function row(name, gap, fill) {
  const f = frame(name, 10, 10, fill || null);
  auto(f, "HORIZONTAL", gap, 0);
  return f;
}

function stack(name, width, gap, pad, fill) {
  const f = frame(name, width, 10, fill);
  auto(f, "VERTICAL", gap, pad);
  f.counterAxisSizingMode = "FIXED";
  return f;
}

function frame(name, w, h, fill) {
  const f = figma.createFrame();
  f.name = name;
  f.resize(w, h);
  f.fills = fill ? [paint(fill)] : [];
  f.clipsContent = false;
  return f;
}

function rect(name, w, h, fill) {
  const r = figma.createRectangle();
  r.name = name;
  r.resize(w, h);
  r.fills = [paint(fill)];
  r.cornerRadius = 6;
  return r;
}

function text(value, size, weight, color) {
  const t = figma.createText();
  t.name = `Text / ${value}`;
  t.fontName = F[weight || "Regular"];
  t.characters = value;
  t.fontSize = size;
  t.fills = [paint(color || C.ink)];
  t.textAutoResize = "WIDTH_AND_HEIGHT";
  return t;
}

function auto(node, mode, gap, pad) {
  node.layoutMode = mode;
  node.primaryAxisSizingMode = "AUTO";
  node.counterAxisSizingMode = "AUTO";
  node.itemSpacing = gap;
  node.paddingLeft = pad;
  node.paddingRight = pad;
  node.paddingTop = pad;
  node.paddingBottom = pad;
}

function decorate(node) {
  node.cornerRadius = 12;
  node.strokes = [paint(C.line)];
  node.strokeWeight = 1;
}

function paint(hex) {
  if (hex === "transparent") return { type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 0 };
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

run();
