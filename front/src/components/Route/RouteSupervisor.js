import React from "react";
import Main from "../../containers/main";
import Operator from "../../containers/operator";
import Service from "../../containers/service";
import Settings from "../../containers/settings";
import Help from "../../containers/help";
import { Route } from "react-router-dom";
import { Layout } from "antd";
import ServiceProvider from "../../containers/service-provider";
import Reviews from "../../containers/review";
import ReviewPage from "../../containers/review/ReviewPage";
import Analytics from "../../containers/analytics";
import BIAnalytics from "../../containers/bi-analytics";

//Импорт новой вкладки=======================================//
import CallCenter from "../../containers/callCenter";
//Импорт новой вкладки=======================================//

const { Content } = Layout;

function RouteSupervisor() {
  return (
    <Content
      style={{
        margin: "0",
        padding: 24,
        background: "#fff",
        height: "100%",
      }}
    >
      <Route exact path="/dashboard" component={Main} />
      <Route exact path="/dashboard/provider" component={ServiceProvider} />
      <Route exact path="/dashboard/operator" component={Operator} />
      <Route exact path="/dashboard/service" component={Service} />
      <Route exact path="/dashboard/settings" component={Settings} />
      <Route exact path="/dashboard/help" component={Help} />
      <Route exact path="/dashboard/reviews" component={Reviews} />
      <Route exact path="/dashboard/reviews/:id" component={ReviewPage} />
      <Route exact path="/dashboard/analytics" component={Analytics} />

      <Route exact path="/dashboard/bi-analytics" component={BIAnalytics} />

      {/*Новая вкладка/страница супервайзера*/}
      <Route exact path="/dashboard/callcenter" component={CallCenter} />
      {/*Новая вкладка/страница супервайзера*/}
    </Content>
  );
}
export default RouteSupervisor;
