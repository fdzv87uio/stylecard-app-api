import { Box, IconButton, styled, Tooltip, Typography } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import React, { useEffect, useState } from "react";
import CustomCTAButton from "../../components/CustomCTAButton/CustomCTAButton";
import CustomTextInput from "../../components/CustomTextInput/CustomTextInput";
import { SignIn } from "../../utils/UserAuth";

interface UserSignInProps {
  setCurrentView: any;
  setUserAuth: any;
  signUpOk: boolean;
}

function UserSignIn({
  setCurrentView,
  setUserAuth,
  signUpOk,
}: UserSignInProps) {
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSignUpMsg, setShowSignUpMsg] = useState(false);

  useEffect(() => {
    if (signUpOk) {
      setShowSignUpMsg(true);
      setTimeout(() => {
        setShowSignUpMsg(false);
      }, 6000);
    }
  }, [signUpOk]);

  useEffect(() => {
    if (errorMsg !== "") {
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
    }
  }, [errorMsg]);

  async function handleSubmit() {
    setErrorMsg("❌ Network Error");
    // setErrorMsg("");
    // setLoading(true);
    // try {
    //   console.log("validating user...");
    //   const res: any = await SignIn(email, password);
    //   console.log("user validated...");
    //   const tokenString = res.data.token;
    //   window.localStorage.setItem("stylecard-token", tokenString);
    //   setLoading(false);
    //   setCurrentView(666);
    // } catch (error: any) {
    //   setLoading(false);
    //   console.log(error);
    //   if (error.message === "Request failed with status code 409") {
    //     setErrorMsg("❌ Network Error");
    //   } else if (error.message === "Request failed with status code 403") {
    //     setErrorMsg("❌ Invalid Credentials");
    //   } else {
    //     setErrorMsg(error.message);
    //   }
    // }
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
      <H4Text variant="h4">Log in</H4Text>
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
      <BodyTwoText variant="body2">{errorMsg}</BodyTwoText>
      {showSignUpMsg && (
        <BodyTwoText style={{ color: "green" }} variant="body2">
          Great job! Use your credentials to sign in.
        </BodyTwoText>
      )}
      {!loading && (
        <CustomCTAButton
          onClick={() => {
            handleSubmit();
          }}
          label={"Sign In"}
          variant={"right"}
          disabled={email && password ? false : true}
        />
      )}
      {loading && <CustomCTAButton loading={true} />}
      <H4Text variant="h4">Need to create an account instead?</H4Text>
      <CustomCTAButton
        onClick={() => {
          setCurrentView(1);
        }}
        label={"Sign Up"}
        variant={"right"}
      />
    </AppContainer>
  );
}

export default UserSignIn;

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
  textAlign: "center",
  margin: "11px 0px",
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
  margin: "5px 0px",
  minHeight: "30px",
  color: "red",
}));
