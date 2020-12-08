import setAuthToken from '../utils/setAuthToken'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import {GET_ERRORS, IP, SET_CURRENT_USER} from "./types";
import {message} from "antd";

export const loginUser = (userData, history, socket, handleLoading, handleError) => dispatch => {
    handleError()
    axios.post(IP+'api/auth/signin',userData)
        .then(res=>{
            handleLoading()
            const {token, role} = res.data;
            localStorage.setItem('role', role.name);
            localStorage.setItem('jwtToken', token);
            setAuthToken(token);
            const decoded = jwt_decode(token);
            dispatch(setCurrentUser(decoded));
            message.success('Успешно авторизовались!');
            history.push('/dashboard');
            if(role.name === 'operator' || role.name === 'supervisor') {
                window.location.reload();
                socket.emit('authentication', {token: token}, function (err) {
                    console.log('emit', err)
                });
                socket.on('authenticated', function (err) {
                    console.log('true auth', err)
                });
                socket.on('unauthorized', function (err) {
                    console.log('false', err)
                });
            }
        })
        .catch( err => {
            handleLoading()
            // message.error('Ошибка при авторизации');
        })
};

export const setCurrentUser = (decoded) => {
    return{
        type: SET_CURRENT_USER,
        payload: decoded
    }
};

export const clearErrors = () => dispatch => {
    return dispatch({
        type: GET_ERRORS,
        payload: {}
    });
};

export const logoutUser = () => dispatch => {
    window.location.reload();
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('organizationId');
    localStorage.removeItem('role');
    setAuthToken(false);
    dispatch(setCurrentUser({}));
    window.location.href = '/';
}