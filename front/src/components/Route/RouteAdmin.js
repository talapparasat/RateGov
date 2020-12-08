import React from 'react';
import Main from "../../containers/main";
import Supervisor from "../../containers/supervisor";
import Operator from "../../containers/operator";
import AddService from "../../containers/service/Add";
import Service from "../../containers/service";
import Settings from "../../containers/settings";
import Help from "../../containers/help";
import AddServiceProvider from "../../containers/service-provider/Add"
import {Route} from "react-router-dom";
import {Layout} from "antd";
import ConnectOrganization from "../../containers/service-provider/ConnectServiceProvider";
import ServiceProviderConfirm from "../../containers/confirm/ServiceProvider";
import AddSupervisor from "../../containers/supervisor/Add"
import AddOperator from "../../containers/operator/Add"
import ServiceProvider from "../../containers/service-provider"
import SupervisorConfirm from "../../containers/confirm/Supervisor";

import OperatorConfirm from "../../containers/confirm/Operator";
import ConnectOperator from "../../containers/operator/ConnectOperator";
import ProviderWithOperator from "../../containers/service-provider/ConnectProviderWithOperator";
const {Content } = Layout;

function RouteAdmin(){

    return(
        <Content
            style={{
                margin: '0',
                padding: 24,
                background: '#fff',
                height:'100%',

            }}>
            <Route exact path='/dashboard/' component={Main} />
            <Route exact path='/dashboard/provider/add' component={AddServiceProvider} />
            <Route exact path='/dashboard/provider' component={ServiceProvider} />
            <Route exact path='/dashboard/provider/connect' component={ConnectOrganization}/>
            <Route exact path='/dashboard/supervisor' component={Supervisor} />
            <Route exact path='/dashboard/operator' component={Operator} />
            <Route exact path='/dashboard/service/add' component={AddService} />
            <Route exact path='/dashboard/supervisor/add' component={AddSupervisor} />
            <Route exact path ='/dashboard/supervisor/confirm' component={SupervisorConfirm}/>
            <Route exact path='/dashboard/operator/confirm' component={OperatorConfirm} />
            <Route exact path='/dashboard/operator/add' component={AddOperator} />
            <Route exact path='/dashboard/operator/connect' component={ConnectOperator} />
            <Route exact path='/dashboard/service' component={Service} />
            <Route exact path='/dashboard/settings' component={Settings} />
            <Route exact path='/dashboard/help' component={Help} />
            <Route exact path='/dashboard/provider/confirm' component={ServiceProviderConfirm}/>
            <Route exact path='/dashboard/provider/operator/connect' component={ProviderWithOperator} />
        </Content>


    )

}
export default RouteAdmin;