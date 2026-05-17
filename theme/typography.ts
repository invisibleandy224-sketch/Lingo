export const typography = {
  fonts: {
    regular: "Poppins-Regular",
    medium: "Poppins-Medium",
    semibold: "Poppins-SemiBold",
    bold: "Poppins-Bold",
  } as const,
  sizes: {
    hero: {
      fontSize: 48,
      lineHeight: 56,
      fontFamily: "Poppins-Bold",
    },
    h1: {
      fontSize: 32,
      lineHeight: 40,
      fontFamily: "Poppins-Bold",
    },
    h2: {
      fontSize: 28,
      lineHeight: 36,
      fontFamily: "Poppins-SemiBold",
    },
    h3: {
      fontSize: 24,
      lineHeight: 32,
      fontFamily: "Poppins-SemiBold",
    },
    h4: {
      fontSize: 20,
      lineHeight: 28,
      fontFamily: "Poppins-SemiBold",
    },
    "body-lg": {
      fontSize: 18,
      lineHeight: 26,
      fontFamily: "Poppins-Regular",
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: "Poppins-Regular",
    },
    "body-sm": {
      fontSize: 14,
      lineHeight: 20,
      fontFamily: "Poppins-Medium",
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontFamily: "Poppins-Regular",
    },
  } as const,
} as const;

export type FontWeight = keyof typeof typography.fonts;
export type FontSize = keyof typeof typography.sizes;
