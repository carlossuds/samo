import { CSSInterpolation, styled } from "@mui/material";

type ClassNames = ["Header", "Main"];

const Styles: Record<ClassNames[number], CSSInterpolation> = {
  Header: {
    textAlign: "center",
    color: "#FFFFFF",
    backgroundColor: "#0288D1",
    padding: 8,
    fontWeight: 700,
    fontSize: 22,
  },
  Main: {
    display: "flex",
    flexDirection: "column",
    width: 300,
    margin: "auto",
    gap: 16,
    marginTop: 24,
  },
};

export const StyledHeader = styled("header")(() => Styles.Header);
export const StyledMain = styled("main")(() => Styles.Main);
