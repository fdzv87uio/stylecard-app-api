import { Button, CircularProgress, styled } from "@mui/material";
import React from "react";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import KeyboardDoubleArrowUpOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowUpOutlined";
import KeyboardDoubleArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftOutlined";
import KeyboardDoubleArrowRightOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowRightOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

interface CustomCTAButtonProps {
  onClick?: any;
  label?: string;
  variant?: "left" | "right" | "up" | "search" | "share";
  style?: any;
  disabled?: boolean;
  loading?: boolean;
}

function CustomCTAButton({
  onClick,
  label,
  variant,
  style,
  disabled,
  loading,
}: CustomCTAButtonProps) {
  if (!loading) {
    return (
      <CustomButton
        fullWidth
        variant="contained"
        style={style}
        disabled={disabled}
        onClick={() => {
          if (onClick) {
            onClick();
          }
        }}
      >
        {variant === "up" && <KeyboardDoubleArrowUpOutlinedIcon />}
        {variant === "left" && <KeyboardDoubleArrowLeftOutlinedIcon />}
        {variant === "search" && <SearchOutlinedIcon />}
        {variant === "share" && <ShareOutlinedIcon />}

        <span>{label}</span>
        {variant === "right" && <KeyboardDoubleArrowRightOutlinedIcon />}

        {variant === "up" && <KeyboardDoubleArrowUpOutlinedIcon />}
      </CustomButton>
    );
  } else {
    return (
      <CustomButton fullWidth variant="contained" style={style} disabled={true}>
        <CircularProgress size={30} />
      </CustomButton>
    );
  }
}

export default CustomCTAButton;

const CustomButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(0deg, #FFCD00, #FFCD00), #FFCD00",
  mixBlendMode: "normal",
  borderRadius: "10px",
  fontFamily: "Gilroy-Regular",
  fontStyle: "normal",
  fontWeight: 800,
  textTransform: "capitalize",
  fontSize: "20px",
  lineHeight: "27px",
  color: "#FFFFFF",
  display: "flex",
  flexDirection: "row",
  gap: "20px",
  minHeight: "44px",
}));
