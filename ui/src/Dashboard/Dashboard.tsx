import { Affix, Layout, Menu } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import SubMenu from "antd/lib/menu/SubMenu";
import axios from "axios";
import React from "react";
import {
  Link, Route,
  Switch, useHistory, useRouteMatch
} from "react-router-dom";
import { useAuthUserStorage } from "../Login/UseUserStorage.hooks";
import { openNotificationWithIcon } from "../notifications";
import CreateMeeting from "./CreateMeeting";
import CreateSpeech from "./CreateSpeech";
import "./Dashboard.scss";
import Meetings from "./Meetings/Meetings";
import ProcessRecording from "./ProcessRecording/ProcessRecording";
import Speeches from "./Speech/Speeches";

export default function Dashboard() {
  const match = useRouteMatch();
  const history = useHistory();
  const [authUser, _, resetAuthUser] = useAuthUserStorage();

  const logout = async () => {
    try {
      await axios.post('/api/logout');
      resetAuthUser();
      history.push('/login');
    }
    catch {
      openNotificationWithIcon(
        "error",
        "Unable To Logout",
        "There was an error logging you out."
      );
    }
  };

  console.log(authUser?.firstName?.charAt(0));

  const { Header } = Layout;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Affix offsetTop={0}>
        <Header className="header" style={{ background:"#ffff" }}>
          <div className="logo" />
          <Menu theme="light" className="menu-bar" mode="horizontal" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">
              <Link to=
                {`${match.path}meetings`}>Meetings
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to=
                  {`${match.path}speeches`}>Speeches
              </Link>
            </Menu.Item>
            <SubMenu key="4" style={{ position: 'absolute', top: 0, right: 0 }} icon={<Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>{authUser?.firstName?.charAt(0)}</Avatar>}>
                <Menu.Item onClick={logout}>Logout</Menu.Item>
            </SubMenu>
          </Menu>
        </Header>
      </Affix>
      <Layout>
        <Switch>
          <Route path={`${match.path}meetings/create/:id`}>
            <CreateMeeting />
          </Route>
          <Route path={`${match.path}meetings/create`}>
            <CreateMeeting />
          </Route>
          <Route path={`${match.path}speeches/create`}>
            <CreateSpeech />
          </Route>
          <Route path={`${match.path}meetings`}>
            <Meetings />
          </Route>
          <Route path={`${match.path}speeches`}>
            <Speeches />
          </Route>
          <Route path={`${match.path}process-recording`}>
            <ProcessRecording />
          </Route>
        </Switch>
      </Layout>
    </Layout>
  );
}
