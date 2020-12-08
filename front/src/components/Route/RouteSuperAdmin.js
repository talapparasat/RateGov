import React from 'react';
import Main from "../../containers/main";
import Organization from "../../containers/organization";
import Admin from "../../containers/admin";
import Supervisor from "../../containers/supervisor";
import Operator from "../../containers/operator";
import Observer from "../../containers/observer";
import AddOrganization from "../../containers/organization/Add";
import AddServiceType from "../../containers/service-type/Add";
import ServiceType from "../../containers/service-type";
import AddService from "../../containers/service/Add";
import Service from "../../containers/service";
import ChooseAdmin from "../../containers/admin/Choose";
import AddAdmin from "../../containers/admin/Add";
import AddAdminSelf from "../../containers/admin/AddAdminSelf";
import AddCriteria from "../../containers/criteria/Add";
import AddCategory from "../../containers/categoryCriteria/Add";
import Criteria from "../../containers/criteria";
import Category from "../../containers/categoryCriteria";
import Confirm from "../../containers/confirm";
import Settings from "../../containers/settings";
import Help from "../../containers/help";
import AddOrganizationAdmin from "../../containers/organization/AddOrganizationAdmin";
import AdminConfirm from "../../containers/confirm/admin";
import AddSupervisor from "../../containers/supervisor/Add"
import {Route} from "react-router-dom";
import {Layout} from "antd";
import ServiceProvider from "../../containers/service-provider"
import AddServiceProvider from "../../containers/service-provider/Add";
import ServiceProviderConfirm from "../../containers/confirm/ServiceProvider";
import AddOperator from "../../containers/operator/Add";
import ConnectSupervisor from "../../containers/supervisor/ConnectSupervisor";
import SupervisorConfirm from "../../containers/confirm/Supervisor"
import ConnectServiceProvider from "../../containers/service-provider/ConnectServiceProvider"
import ConnectOperator from "../../containers/operator/ConnectOperator"
import OperatorConfirm from "../../containers/confirm/Operator"
import ProviderWithOperator from "../../containers/service-provider/ConnectProviderWithOperator"
import Reviews from "../../containers/review"
import Navigation from "../../containers/navigation"
import ReviewPage from "../../containers/review/ReviewPage";
import AddNavigation from "../../containers/navigation/AddOrganization"
import Field from "../../containers/field"
import AddFieldOrganization from "../../containers/field/AddOrganization"
import Analytics from "../../containers/analytics";
const { Content } = Layout;

function RouteSuperAdmin(){

        return(
            <Content
                style={{
                    margin: '0',
                    padding: 24,
                    background: '#fff',
                    height:'100%',

                }}>
                <Route exact path='/dashboard' component={Main} />
                <Route exact path='/dashboard/organizations' component={Organization} />
                <Route exact path='/dashboard/navigation' component={Navigation} />
                <Route exact path='/dashboard/navigation/add' component={AddNavigation} />
                <Route exact path='/dashboard/admin' component={Admin} />
                <Route exact path='/dashboard/supervisor' component={Supervisor} />
                <Route exact path='/dashboard/supervisor/add' component={AddSupervisor} />
                <Route exact path='/dashboard/supervisor/connect' component={ConnectSupervisor} />
                <Route exact path='/dashboard/operator' component={Operator} />
                <Route exact path='/dashboard/observer' component={Observer} />
                <Route exact path='/dashboard/organizations/add' component={AddOrganization} />
                <Route exact path='/dashboard/service-type/add' component={AddServiceType} />
                <Route exact path='/dashboard/service-type' component={ServiceType} />
                <Route exact path='/dashboard/service/add' component={AddService} />
                <Route exact path='/dashboard/service/' component={Service} />
                <Route exact path='/dashboard/admin/choose' component={ChooseAdmin} />
                <Route exact path='/dashboard/admin/add' component={AddAdmin} />
                <Route exact path='/dashboard/admin/self' component={AddAdminSelf} />
                <Route exact path='/dashboard/criteria/add' component={AddCriteria} />
                <Route exact path='/dashboard/category/add' component={AddCategory} />
                <Route exact path='/dashboard/criteria' component={Criteria} />
                <Route exact path='/dashboard/category' component={Category} />
                <Route exact path='/dashboard/provider' component={ServiceProvider} />
                <Route exact path='/dashboard/provider/operator/connect' component={ProviderWithOperator} />
                <Route exact path='/dashboard/confirm' component={Confirm} />
                <Route exact path='/dashboard/settings' component={Settings} />
                <Route exact path='/dashboard/help' component={Help} />
                <Route exact path='/dashboard/operator/add' component={AddOperator} />
                <Route exact path='/dashboard/operator/confirm' component={OperatorConfirm} />
                <Route exact path ='/dashboard/admin/connect' component={AddOrganizationAdmin}/>
                <Route exact path ='/dashboard/operator/connect' component={ConnectOperator}/>
                <Route exact path ='/dashboard/provider/connect' component={ConnectServiceProvider}/>
                <Route exact path ='/dashboard/admin/confirm' component={AdminConfirm}/>
                <Route exact path ='/dashboard/supervisor/confirm' component={SupervisorConfirm}/>
                <Route exact path='/dashboard/provider/add' component={AddServiceProvider} />
                <Route exact path='/dashboard/provider/confirm' component={ServiceProviderConfirm}/>
                <Route exact path='/dashboard/reviews' component={Reviews}/>
                <Route exact path='/dashboard/reviews/:id' component={ReviewPage}/>
                <Route exact path='/dashboard/fields' component={Field}/>
                <Route exact path='/dashboard/field/add' component={AddFieldOrganization}/>
                <Route exact path='/dashboard/analytics' component={Analytics}/>
            </Content>
        )

}
export default RouteSuperAdmin;