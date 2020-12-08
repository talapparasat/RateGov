import {
    GET_ADMINS,
    GET_ERRORS,
    IP,
} from "./types";
import axios from 'axios'
import {message} from "antd";
export const addAdmin = (data, history, handleError, handleLoading) => dispatch => {
    let fm = new FormData();

    fm.append('name', data.name);
    fm.append('position', data.position);
    fm.append('image',data.image);
    fm.append('role', data.role);
    fm.append('phone', JSON.stringify(data.phone) );
    fm.append('email',data.email);
    handleError();
    axios.post(IP+'api/users', fm, {
        headers: {
            'Content-Type' : false,
            'Process-Data' : false
        }
    }).then(res => {
        handleLoading();
        message.success('Админстратор успешно добавлен!')
        history.push('/dashboard/admin/choose');
        }
    )
        .catch(err => {
                // return dispatch({
                //     type: GET_ERRORS,
                //     payload: err.response.data
                // });
            handleLoading();
            message.success('Ошибка при добавлении!')
            }
        );
};






export const getFreeAdmins=()=>dispatch=>{

    axios.get(IP+'api/organizations/'+localStorage.getItem('organization_id')+'/users/admins/withFree')
        .then(res=> {
            return dispatch({
                type: GET_ADMINS,
                payload: res.data
            });
            }

        )
        .catch(err=> {
                return dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                });
            }
        );
};

export const connectAdmins = (data, history, id, handleError, handleLoading) => dispatch => {
    handleError()
    axios.post(IP+'api/organizations/'+id+'/users/array',{users:JSON.stringify(data)})
        .then(res=> {
            handleLoading()
            if (data.length > 0) {
                message.success('Администраторы успешно прикреплены к организации!')
            }
            history.push('/dashboard/confirm');
            }
        )
        .catch(err=> {
                // return dispatch({
                //     type: GET_ERRORS,
                //     payload: err.response.data
                // });
            message.error('Ошибка при добавлении')
            }
        );
};




