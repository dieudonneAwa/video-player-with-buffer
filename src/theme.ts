import { extendTheme, theme as chakraTheme } from "@chakra-ui/react";

const colors = {
  white: "#fff",
  black: "#000",
  "primary-bg": "#16181D",
  "primary-blue": "#246BFD",
  "primary-red": "#E95319"
};

const theme = extendTheme({
  ...chakraTheme,
  colors
});

export type Theme = typeof theme;

export default theme;
