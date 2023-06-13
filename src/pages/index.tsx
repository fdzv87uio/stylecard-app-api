import UserSignIn from '@/components/UserSignIn/UserSignIn';
import UserSignUp from '@/components/UserSignUp/UserSignUp';
import { styled } from '@mui/system';
import { useState } from 'react';

export default function Home() {
  const [currentView, setCurrentView] = useState(1);
  const [signUpOk, setSignUpOk] = useState(false);
  const [userAuth, setUserAuth] = useState(false);
  return (
    <PageContainer>
      <ViewContainer>
        {currentView === 1 && <UserSignUp setCurrentView={setCurrentView} setSignUpOk={setSignUpOk} />}
        {currentView === 2 && <UserSignIn setCurrentView={setCurrentView} setUserAuth={setUserAuth} signUpOk={signUpOk}></UserSignIn>}
      </ViewContainer>
    </PageContainer>
  );
}

const PageContainer = styled("div")({
  width: "100%",
  height: "100vh",
  position: "relative",
  backgroundImage: "url(/image/login_bg.jpg)",
  backgroundSize: "cover",
  backgroundPosition: "80% 50%",
  backgroundColor: '#FFCD00',
  margin: "0px 0px",
  padding: "0px 0px",


  // [defaultTheme.breakpoints.down('md')]: {
  //   backgroundColor: 'red',
  // },

});

const ViewContainer = styled("div")({
  position: "absolute",
  top: "5%",
  right: "65%",

  // [defaultTheme.breakpoints.down('md')]: {
  //   backgroundColor: 'red',
  // },

});