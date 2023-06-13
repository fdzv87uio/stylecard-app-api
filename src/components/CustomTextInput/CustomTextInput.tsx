import { styled, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import React, { useState } from "react";

interface CustomTextInputProps {
  value: string;
  label: string;
  onChange?: any;
  type: string;
}

function CustomTextInput({
  value,
  label,
  onChange,
  type,
}: CustomTextInputProps) {
  const [currentValue, setCurrentValue] = useState(value);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function validateInput(input: string) {
    if (type === "email") {
      const isEmail = /^[a-z0-9.]{1,64}@[a-z0-9.]{1,64}$/i.test(input);
      if (isEmail) {
        onChange(input);
        setError(false);
        setErrorMessage("");
      } else {
        onChange("");
        setError(true);
        setErrorMessage("❌ Invalid email format");
      }
    }
    if (type === "password") {
      const isPassword = input.length > 6;
      if (isPassword) {
        onChange(input);
        setError(false);
        setErrorMessage("");
      } else {
        onChange("");
        setError(true);
        setErrorMessage("❌ 6 characters min.");
      }
    }
  }

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <CustomInput
        onChange={(e: any) => {
          setCurrentValue(e.target.value);
          validateInput(e.target.value);
        }}
        fullWidth
        required
        value={currentValue}
        label={label}
        type={type}
        error={error}
      />
      {error && errorMessage && (
        <ErrorMessage variant="body2">{errorMessage}</ErrorMessage>
      )}
    </Box>
  );
}

export default CustomTextInput;

const CustomInput = styled(TextField)(({ theme }) => ({
  background: "#FFFFFF",
  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  borderRadius: "10px",
  marginTop: "12px",
  ".MuiInputBase-input": {
    color: "#000000",
  },
}));

const ErrorMessage = styled(Typography)(({ theme }) => ({
  color: "red",
  position: "absolute",
  width: "145px",
  textAlign: "left",
  top: "30px",
  right: "0px",
}));
