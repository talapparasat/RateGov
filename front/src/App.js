import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import './App.css';
import 'antd/dist/antd.css';
import Login from "./containers/login/";
import ForgotPassword from "./containers/forgotPassword"
import setAuthToken from "./utils/setAuthToken";
import { messaging } from "./init-fcm";
import store from './store';
import jwt_decode from "jwt-decode"
import {logoutUser, setCurrentUser} from "./actions/authActions";
import {Provider} from 'react-redux';
import Dashboard from "./containers/dashboard";
import PrivateRoute from "./components/private-route"
import io from "socket.io-client";
import {SocketProvider} from "./components/SocketContext";
import { compose, lifecycle, withHandlers, withState } from "recompose";
import axios from "axios";
import {IP} from "./actions/types";
if (localStorage.jwtToken) {
    setAuthToken(localStorage.jwtToken);
    const decoded = jwt_decode(localStorage.jwtToken);
    store.dispatch(setCurrentUser(decoded));
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
        store.dispatch(logoutUser());
        window.location.href = '/';
    }
}
const renderNotification = (notification, i) => <li key={i}>{notification}</li>;
const registerPushListener = pushNotification =>
    navigator.serviceWorker.addEventListener("notification", ({ data }) =>
        pushNotification(
            data.data
                ? data.data.notification
                : data["firebase-messaging-msg-data"].data.notification
        )
    );
class App extends React.Component {
    state = {
       socket: null
    };

    componentWillMount() {
        // console.log('mount')
        if (localStorage.role === 'operator' || localStorage.role === 'supervisor') {
            this.connectSocket().then(r => console.log('connected', r)).catch(err => console.log('error', err))
        }
    }

    connectAuthentication = () => {
        this.state.socket.emit('authentication', {token: localStorage.jwtToken}, function (err) {
            console.log('emit', err)
        });
        this.state.socket.on('authenticated', function (err) {
            console.log('true authenticated', err)
        });
        this.state.socket.on('unauthorized', function (err) {
            console.log('false', err)
        });
    }
     async connectSocket() {
        try {
            await this.setState({
                socket: io('https://api2.digitalagent.kz')

                
            });
            this.connectAuthentication();
        } catch (err) {
            console.log(err,'asd')
        }
    }

    render() {
        return (
            <Provider store={store}>
                <div className="App">
                    <Router>
                        <Switch>
                            <SocketProvider socket={this.state.socket}>
                                <Route exact path={'/'} component={Login}/>
                                <Route exact path={'/forgot'} component={ForgotPassword}/>
                                <PrivateRoute path={'/dashboard'} component={Dashboard}/>
                            </SocketProvider>
                        </Switch>
                    </Router>
                </div>
            </Provider>

        );
    }
}

export default compose(
    withState("token", "setToken", ""),
    withState("notifications", "setNotifications", []),
    withHandlers({
        pushNotification: ({
                               setNotifications,
                               notifications
                           }) => newNotification =>
            setNotifications(notifications.concat(newNotification))
    }),
    lifecycle({
        async componentDidMount() {
            const { pushNotification, setToken } = this.props;
            if (messaging)
            messaging
                .requestPermission()
                .then(async function() {
                    const token = await messaging.getToken();
                    // sendPush(token);
                    if (localStorage.jwtToken) {
                        axios.post(`${IP}api/notifications/webToken`, {token: token})
                            .then(res => {
                                    console.log(res)
                                }
                            )
                            .catch(err => {
                                    console.log(err)
                                }
                            );
                    }

                    setToken(token);
                })
                .catch(function(err) {
                    console.log("Unable to get permission to notify.", err);
                });

            registerPushListener(pushNotification);
        }
    })
) (App);