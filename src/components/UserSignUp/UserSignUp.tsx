import { Box, IconButton, styled, Tooltip, Typography } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import React, { useEffect, useState } from "react";
import CustomCTAButton from "../../components/CustomCTAButton/CustomCTAButton";
import CustomTextInput from "../../components/CustomTextInput/CustomTextInput";
import { SignUp } from "../../utils/UserAuth";

interface UserSignInProps {
  setCurrentView: any;
  setSignUpOk: any;
}

function UserSignUp({ setCurrentView, setSignUpOk }: UserSignInProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (errorMsg !== "") {
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
    }
  }, [errorMsg]);

  async function handleSubmit() {
    setLoading(true);
    setErrorMsg("");
    if (password !== repeatPassword) {
      setLoading(false);
      setErrorMsg("❌ Passwords Don't Match");
    } else {
      try {
        const res = await SignUp(email, password);
        const data = res.data;
        console.log(res);
        if (data.status === "success") {
          setSignUpOk(true);
          setCurrentView(2);
        } else {
          setLoading(false);
          setErrorMsg(res.data.error);
        }
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        if (error.message === "Request failed with status code 409") {
          setErrorMsg("❌ Network Error");
        } else if (error.message === "Request failed with status code 403") {
          setErrorMsg(" ❌ Email Already Registered");
        } else {
          setErrorMsg(error.message);
        }
      }
    }
  }
  return (
    <AppContainer>
      {/* <HeaderContainer>
        <ButtonWrapper>
          <Tooltip title="Close">
            <IconButton onClick={() => window.close()}>
              <HighlightOffIcon sx={{ color: "#000000" }} />
            </IconButton>
          </Tooltip>
        </ButtonWrapper>
      </HeaderContainer> */}
      <HeaderLogoWrapper>
        <img
          src="/image/stylecard-logo-horizontal.png"
          style={{ width: "224px", height: "50px" }}
        />
      </HeaderLogoWrapper>
      <H4Text variant="h4">Sign Up</H4Text>
      <H4Text variant="h4">Welcome to Stylecard</H4Text>
      <CustomTextInput
        value={email}
        label={"Email"}
        onChange={setEmail}
        type="email"
      />
      <CustomTextInput
        value={password}
        label={"Password"}
        onChange={setPassword}
        type="password"
      />
      <CustomTextInput
        value={repeatPassword}
        label={"Repeat Password"}
        onChange={setRepeatPassword}
        type="password"
      />
      <BodyTwoText variant="body2">{errorMsg}</BodyTwoText>
      {!loading && (
        <CustomCTAButton
          onClick={() => {
            handleSubmit();
          }}
          label={"Create Account"}
          variant={"right"}
          disabled={email && password ? false : true}
        />
      )}
      {loading && <CustomCTAButton loading={true} />}
      <H4Text variant="h4">Already have an account?</H4Text>
      <CustomCTAButton
        onClick={() => {
          setCurrentView(2);
        }}
        label={"Sign In"}
        variant={"right"}
      />
    </AppContainer>
  );
}

export default UserSignUp;

const AppContainer = styled(Box)(({ theme }) => ({
  maxWidth: "300px",
  width: "300px",
  height: "520px",
  border: "1px solid #ececec",
  background: "#ffffff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "28px 28px",
  borderRadius: "8px",
  boxShadow: "0px 10px 40px -3px rgba(0,0,0,0.3)",
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "30px",
  display: "flex",
  flexDirection: "row",
  position: "relative",
}));

const HeaderLogoWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "24px",
}));

const H4Text = styled(Typography)(({ theme }) => ({
  margin: "5px 0px",
  textAlign: "center",
  fontWeight: "bolder",
  width: "100%",
}));

const H5Text = styled(Typography)(({ theme }) => ({
  marginTop: "15px",
  textAlign: "center",
}));

const ButtonWrapper = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "0px",
  right: "0px",
}));

const BodyTwoText = styled(Typography)(({ theme }) => ({
  textAlign: "left",
  marginTop: "22px",
  minHeight: "25px",
  color: "red",
}));
