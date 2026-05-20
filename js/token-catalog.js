// Bing Design System token catalog — distilled from BingDesignSkill V1.2
// (BingDesignSkill/bing-design-skill-1.2/design-tokens/*.css).
// Used by the L1 rules engine to decide whether a Figma node's literal
// values map to a legal design token.

export const TOKEN_CATALOG = {
  // ----- allowed corner radius values (px) -----
  // From corner.css — sm=4 / md=8 / lg=16 / circular=9999. 0 included
  // for non-rounded surfaces.
  cornerRadius: new Set([0, 4, 8, 16, 9999]),

  // ----- allowed spacing values (px) -----
  // Union of gap + padding ramps from spacing.css.
  // 3px appears only as ctrl-sm text top/bottom; 20px is the MAI card padding.
  spacing: new Set([0, 2, 3, 4, 8, 12, 16, 20, 24, 32]),

  // ----- allowed typography sizes (fontSize + lineHeight pairs) -----
  // From typography.css. lineHeight is informational; we mostly match fontSize+weight.
  typography: [
    { name: "display1",         fontSize: 54, lineHeight: 64, weight: 700 },
    { name: "display2",         fontSize: 40, lineHeight: 48, weight: 700 },
    { name: "title1",           fontSize: 36, lineHeight: 48, weight: 700 },
    { name: "title2",           fontSize: 24, lineHeight: 32, weight: 400 },
    { name: "title2-strong",    fontSize: 24, lineHeight: 32, weight: 700 },
    { name: "subtitle1",        fontSize: 20, lineHeight: 26, weight: 400 },
    { name: "subtitle1-strong", fontSize: 20, lineHeight: 26, weight: 700 },
    { name: "subtitle2",        fontSize: 18, lineHeight: 22, weight: 400 },
    { name: "subtitle2-strong", fontSize: 18, lineHeight: 22, weight: 700 },
    { name: "body1",            fontSize: 18, lineHeight: 28, weight: 400 },
    { name: "body1-strong",     fontSize: 18, lineHeight: 28, weight: 700 },
    { name: "body2",            fontSize: 16, lineHeight: 26, weight: 400 },
    { name: "body2-strong",     fontSize: 16, lineHeight: 26, weight: 700 },
    { name: "body3",            fontSize: 14, lineHeight: 22, weight: 400 },
    { name: "body3-strong",     fontSize: 14, lineHeight: 22, weight: 700 },
    { name: "caption1",         fontSize: 13, lineHeight: 20, weight: 400 },
    { name: "caption1-strong",  fontSize: 13, lineHeight: 20, weight: 700 },
    { name: "caption2",         fontSize: 11, lineHeight: 13, weight: 400 },
    { name: "caption2-strong",  fontSize: 11, lineHeight: 13, weight: 700 },
  ],

  fontFamilies: new Set([
    "Roboto",
    "Segoe UI Variable",
    "Segoe UI",
    "Cascadia Code",
    "Courier New",
    "Consolas",
    "Monaco",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
  ]),

  fontWeights: new Set([400, 700]),

  // ----- allowed colors (hex, lowercase, no alpha) -----
  // Extracted from color-neutral.css, color-accent.css, color-semantic.css,
  // theme-stone.css, theme-stone-blue.css.
  colors: new Set([
    // pure neutrals
    "#000000", "#ffffff",
    // neutrals — light ramp
    "#fafafa", "#f5f5f5", "#f4f4f4", "#f0f0f0", "#ededed", "#ebebeb",
    "#e8e8e8", "#e3e3e3", "#e0e0e0",
    // neutrals — dark ramp
    "#474747", "#3d3d3d", "#383838", "#333333", "#2d2d2d", "#2a2a2a",
    "#262626", "#1b1a19",
    // stone theme
    "#f8f4f1", "#efeae7", "#322d29", "#272320", "#4c4642", "#3f3935",
    // stone-blue accent
    "#0022a0",
    // accent — bing classic blues
    "#0078d4", "#106ebe", "#005a9e", "#004578", "#002d4d",
    // accent — extended blues
    "#0068b8", "#0da0dd", "#2899f5", "#4cc2ff", "#4db3ff", "#82c7ff", "#e6f2ff",
    // accent — purples + warm
    "#6b3fa0", "#800080", "#b8a3d9",
    // card alt baseline
    "#ebf6ff",
    // semantic — success
    "#107c10", "#dff6dd", "#1e3a1e", "#6ccb5f",
    // semantic — warning
    "#797400", "#fff4ce", "#3d3518", "#f9e076",
    // semantic — danger
    "#a4262c", "#c4281c", "#fde7e9", "#3d1c1c", "#3d1e1e", "#ff6b68", "#fff5f5",
    // misc surfaces
    "#1d2b36",
  ]),

  // Known icon names from Bing Design Skill /icons. Truncated; checker only
  // signals risk when icon name not in this list.
  iconNames: new Set([
    "Add","Airplane","AirplaneFill","AppFolder","AppStore","ArrowClockwise",
    "ArrowExport","ArrowHookUpLeft","ArrowHookUpRight","ArrowLeft","ArrowMaximize",
    "ArrowMinimize","ArrowRight","ArrowSort","ArrowSwap","ArrowSync","ArrowUpLeft",
    "Attach","Backspace","Bed","Bench","BookQuestionMark","Briefcase","Building",
    "Calendar","Camera","CaretDown","CaretRight","Cart","CartFilled","Checkmark",
    "ChevronDown","ChevronLeft","ChevronRight","ChevronUp","CircleHalfFill","Clock",
    "Close","Cloud","Code","Copy","Delete","Dismiss","Document","Download","Edit",
    "Email","Filter","Flag","Folder","Globe","Heart","Home","Info","Link","List",
    "Location","Map","MoreHorizontal","MoreVertical","Open","Person","Phone","Photo",
    "Play","Plus","Power","Print","Question","Search","Send","Settings","Share",
    "Shield","ShoppingBag","SlideTextPerson","Star","StarFilled","Stop","Sun","Tag",
    "ThumbDown","ThumbUp","Translate","Trash","User","Video","Wallet","Warning",
  ]),

  // Card / component names recognized by the design system.
  knownCardTypes: new Set([
    "answer-card","text-card","attachment-card","image-card","video-card",
    "map-card","product-card","result-card","list-card","carousel-card",
    "subdivided-card","overview-card",
  ]),
};
