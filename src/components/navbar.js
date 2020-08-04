import React from "react";
import { PageHeader, Button } from "antd";
import { useHistory } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function Navbar({ title}) {
  let history = useHistory();
  const { isAuthenticated, user } = useAuth0();
  const subtitle = isAuthenticated ? user?.name : "Not signed in";
  return (
    <PageHeader
      onBack={() => history.goBack()}
      title={title}
      subTitle={subtitle}
      // extra={[
      //   <Button onClick={()=>history.push("/")} key="3">Home</Button>,
      //   <Button onClick={()=>history.push("/login")} key="2">Login</Button>,
      //   <Button onClick={()=>history.push("/private")} key="1" > Primary </Button>,
      // ]}
    />
  );
}