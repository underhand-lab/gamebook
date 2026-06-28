import { createDesignSystem } from "./src/design-system";
import { createScreen } from "./src/screens";
import { screens } from "./src/spec";
import { F } from "./src/tokens";

async function run() {
  await Promise.all(Object.values(F).map(font => figma.loadFontAsync(font)));

  const designSystemPage = figma.createPage();
  designSystemPage.name = uniquePageName("gamelog Design System");
  createDesignSystem(designSystemPage);

  const wireframePage = figma.createPage();
  wireframePage.name = uniquePageName("gamelog Wireframes");
  screens.forEach((screen, index) => wireframePage.appendChild(createScreen(screen, index)));

  figma.currentPage = wireframePage;
  figma.viewport.scrollAndZoomIntoView(wireframePage.children);
  figma.closePlugin("gamelog wireframes generated.");
}

function uniquePageName(base: string) {
  const names = figma.root.children.map(page => page.name);
  if (!names.includes(base)) return base;

  let index = 2;
  while (names.includes(`${base} ${index}`)) index += 1;
  return `${base} ${index}`;
}

run();
