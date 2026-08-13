import { Platform } from 'react-native';

/**
 * Brand color palette. Source of truth for all colors used in the app.
 */
export const colors = {
  bg: '#0A0E08',
  bgElevated: '#10150C',
  surface: '#161D10',
  surfaceAlt: '#1C2514',
  border: '#27321C',
  borderBright: '#3A4A28',

  primary: '#9FE870',
  primaryDim: '#7CCB4E',
  primaryDeep: '#4E7A2E',
  greenGlow: 'rgba(159,232,112,0.35)',

  yellow: '#F2C14E',
  yellowDeep: '#B98A22',
  gray: '#9BA8A2',
  grayDeep: '#5C6A62',
  blue: '#6FB8FF',
  blueDeep: '#3D7FD9',
  red: '#FF6B5E',
  redDeep: '#C24A3E',

  textPrimary: '#F2F7EC',
  textSecondary: '#A7B39A',
  textMuted: '#6E7A63',
  white: '#FFFFFF',
  black: '#000000',
};

/**
 * Light brand palette. Clean finance look grounded in the same brand greens.
 */
export const colorsLight = {
  bg: '#F7F9F4',
  bgElevated: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceAlt: '#F0F3EA',
  border: '#E3E8DA',
  borderBright: '#CBD6BD',

  primary: '#4E7A2E',
  primaryDim: '#7CCB4E',
  primaryDeep: '#3A5E22',
  greenGlow: 'rgba(78,122,46,0.18)',

  yellow: '#A87B1E',
  yellowDeep: '#8F6A15',
  gray: '#7C877F',
  grayDeep: '#AEB8B0',
  blue: '#3D7FD9',
  blueDeep: '#2B62B0',
  red: '#D9483C',
  redDeep: '#B23C33',

  textPrimary: '#151B11',
  textSecondary: '#4C5646',
  textMuted: '#8A9584',
  white: '#FFFFFF',
  black: '#000000',
};

/**
 * Semantic colors resolved per color scheme.
 */
export const Colors = {
  light: {
    text: colorsLight.textPrimary,
    background: colorsLight.bg,
    tint: colorsLight.primary,
    icon: colorsLight.textSecondary,
    tabIconDefault: colorsLight.textMuted,
    tabIconSelected: colorsLight.primary,
  },
  dark: {
    text: colors.textPrimary,
    background: colors.bg,
    tint: colors.primary,
    icon: colors.textSecondary,
    tabIconDefault: colors.textMuted,
    tabIconSelected: colors.primary,
  },
};

export const nodeColors = {
  save: colors.primary,
  grow: colors.yellow,
  borrow: colors.blue,
  stillGrowing: colors.greenGlow,
};

export const radii = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  sheet: 28,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const type = {
  h1: { fontSize: 44, fontWeight: '800' as const, letterSpacing: -0.8 },
  h2: { fontSize: 30, fontWeight: '800' as const, letterSpacing: -0.5 },
  h3: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3 },
  h4: { fontSize: 17, fontWeight: '700' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  bodyBold: { fontSize: 15, fontWeight: '700' as const },
  caption: { fontSize: 13, fontWeight: '500' as const },
  micro: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.4 },
  tabular: { fontVariant: ['tabular-nums' as const] },
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  glow: {
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
