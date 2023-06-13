import { createTheme } from "@mui/material";
import createBreakpoints from "@mui/system/createTheme/createBreakpoints";

export const FONT_FAMILIES = {
    REG: "Segoe UI, sans-serif",
    SUPER: "Segoe UI, sans-serif",
};



const breakpoints = createBreakpoints({});
const [xs, sm, md, lg] = breakpoints.keys;


export const defaultTheme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
});

defaultTheme.typography.h4 = {
    fontFamily: `${FONT_FAMILIES.SUPER}`,
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "17px",
    lineHeight: "27px",
    color: "#000000",
};
defaultTheme.typography.h5 = {
    fontFamily: `${FONT_FAMILIES.REG}`,
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "11px",
    lineHeight: "20px",
    color: "#000000",
    textTransform: "none",
};
/* 16px */
defaultTheme.typography.body1 = {
    fontFamily: `${FONT_FAMILIES.REG}`,
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "21px",
    color: "#000000",
    opacity: 0.75,
};
/* 14px */
defaultTheme.typography.body2 = {
    fontFamily: `${FONT_FAMILIES.REG}`,
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: "16px",
    color: "#000000",
    opacity: "0.75",
};
