export const breakpoints = {
  mobile: 768,
  tablet: 1100,
  desktop: 1260,
} as const;

export const media = {
  mobile: `@media (max-width: ${breakpoints.mobile}px)`,
  tablet: `@media (max-width: ${breakpoints.tablet}px)`,
} as const;
