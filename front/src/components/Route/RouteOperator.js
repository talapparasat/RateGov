import React,{Component} from 'react';
import Main from "../../containers/main";
import Service from "../../containers/service";
import Settings from "../../containers/settings";
import {Route} from "react-router-dom";
import {Layout} from "antd";
import Reviews from "../../containers/review"
import ReviewPage from "../../containers/review/ReviewPage";
import Help from "../../containers/help";
const {Content } = Layout;

class RouteOperator extends Component{

    render() {
        return (
            <Content
                style={{
                    margin: '0',
                    padding: 24,
                    background: '#fff',
                    height: '100%',

                }}>

                <Route exact path='/dashboard' component={Main}/>
                <Route exact path='/dashboard/service' component={Service}/>
                <Route exact path='/dashboard/settings' component={Settings}/>
                <Route exact path='/dashboard/help' component={Help} />
                <Route exact path='/dashboard/reviews' component={Reviews}/>
                <Route exact path='/dashboard/reviews/:id' component={ReviewPage}/>

            </Content>


        )
    }
}
export default RouteOperator;