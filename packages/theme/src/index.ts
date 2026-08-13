import { Platform } from 'react-native';
import tokens from '../tokens.json';

/**
 * Brand color palette. Source of truth for all colors used in the app.
 * Raw values live in tokens.json (shared with tailwind.config.js).
 */
export const colors = { ...tokens.dark };

/**
 * Light brand palette. Clean finance look grounded in the same brand greens.
 */
export const colorsLight = { ...tokens.light };

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
