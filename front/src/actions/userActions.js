import axios from "axios";
import {
    GET_ANALYTICS,
    GET_CONFIRM,
    GET_ERRORS, GET_PROFILE, GET_REVIEWS, GET_STATISTICS,
    GET_USER_ID,
    GET_USERS,
    GET_USERS_ORGANIZATION,
    IP,
    MODAL
} from "./types";
import {Modal} from "antd";
import {message} from "antd";
import fileDownload from "js-file-download";
export const getUserById = (data) => dispatch => {
    axios
        .get(IP + 'api/users/' + data)
        .then(res => {
                return dispatch ({
                    type:GET_USER_ID,
                    payload: res.data
                })
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
export const addUser = (data, history, handleError, handleLoading) => dispatch => {
    let fm = new FormData();

    fm.append('name', data.name);
    fm.append('image',data.image);
    fm.append('role', data.role);
    fm.append('phone', JSON.stringify(data.phone) );
    fm.append('email',data.email);
    fm.append('position',data.position);
    handleError()
    axios.post(IP + 'api/users', fm, {
        headers: {
            'Content-Type' : false,
            'Process-Data' : false
        }
    }).then( res => {
            localStorage.setItem('user',res.data._id)
            handleLoading()
            message.success('Успешно добавили пользователя!')
            history.push(data.path);
    })
        .catch( err => {
            handleLoading()
            message.error('Ошибка при добавлении')
                // return dispatch({
                //     type: GET_ERRORS,
                //     payload: err.response.data
                // });
            }
        );
};

export const saveUser = (data, history, id, handleError, handleLoading) => dispatch => {
    if (!id) {
        dispatch(addUser(data, history, handleError, handleLoading));
    } else {
        dispatch(updateUser(data, history, id, handleError, handleLoading));
    }
}
export const updateUser = (data, history, id, handleError, handleLoading) => dispatch => {
    let fm = new FormData();
    fm.append('name', data.name);
    fm.append('image',data.image);
    fm.append('role', data.role);
    fm.append('phone', JSON.stringify(data.phone) );
    fm.append('email',data.email);
    fm.append('position',data.position);
    handleError()
    axios.put(IP+'api/users/'+id, fm, {
        headers: {
            'Content-Type' : false,
            'Process-Data' : false
        }
    }).then( res => {
            handleLoading()
            message.success('Успешно изменили данные!')
            history.push(data.path);
        })
        .catch( err => {
            handleLoading()
            message.error('Ошибка при обновлении')
                // return dispatch({
                //     type: GET_ERRORS,
                //     payload: err.response.data
                // });
            }
        );
};

export const getUsers = (data, handleLoading, handleError) => dispatch => {
    handleError();
    axios
        .get(IP + 'api/users/'+data.user+'?page='+data.page+'&query='+data.query)
        .then(res => {
            handleLoading();
                return dispatch ({
                    type:GET_USERS,
                    payload: res.data
                })
            }
        )
        .catch(err => {
            handleLoading();
            message.error('Ошибка при получении данных')
                // return dispatch({
                //     type: GET_ERRORS,
                //     payload: err.response.data
                // });
            }
        );
};
export const addOrganizationToUser = (data, history, handleError, handleLoading) => dispatch => {
    handleError()
    axios.post(IP+'api'+data.text+data.id+'/users/'+data.user+data.userId,{organizationId:data.organizationId})
        .then(res=> {
            handleLoading()
            message.success("Успешно привязали")
            history.push(data.history)
                return dispatch({
                    type: GET_ERRORS,
                    payload: {}
                    })
            }

        )
        .catch(err=> {
            console.log(err)
              handleLoading()
            message.error("Ошибка при привязке")
            }
        );
};
export const getConfirm = (data, handleError, handleLoading) => dispatch => {
    handleError()
    axios.get(IP+'api/users/'+data.id+'/confirm'+data.text+'/')
        .then(res=> {
            handleLoading()
                return dispatch({
                    type: GET_CONFIRM,
                    payload: res.data
                });
            }

        )
        .catch(err=> {
            handleLoading()
            message.error("Ошибка при получении данных!")
            }
        );
};
export const getStatistics = ( handleError, handleLoading) => dispatch => {
    handleError()
    axios.get(IP+'api/statistics/')
        .then(res=> {
                handleLoading()
                return dispatch({
                    type: GET_STATISTICS,
                    payload: res.data
                });
            }

        )
        .catch(err=> {
            console.log(err)
                handleLoading()
                message.error("Ошибка при получении данных!")
            }
        );
};
export const getAnalytics = ( handleError, handleLoading, data ) => dispatch => {
    handleError()
    axios.get(`${IP}api/analytics?period=${data.period}&regionId=${data.regionId}&raionId=${data.raionId}&dateFrom=${data.dateFrom}&dateTo=${data.dateTo}`)
        .then(res=> {
                handleLoading()
                return dispatch({
                    type: GET_ANALYTICS,
                    payload: res.data
                });
            }
        )
        .catch(err=> {
                console.log(err)
                handleLoading()
                message.error("Ошибка при получении данных!")
            }
        );
};
export const sendPush = token => dispatch => {
    console.log(token)

};

export const uploadSupervisor = ( handleError, handleLoading, data ) => dispatch => {
    handleError()
    let fm = new FormData();
    fm.append('file', data);
    axios.post(`${IP}api/import/supervisors`, fm)
        .then(res => {
            handleLoading()
            message.success('Супервайзеры загружены')
            }
        )
        .catch(err => {
                handleLoading()
                message.error(err.response.data.message)
            }
        );
};

export const getTemplateSupervisor = ( handleError, handleLoading ) => dispatch => {
    handleError()
    axios.get(`${IP}api/import/supervisors/template`)
        .then(res => {
                handleLoading()
            fileDownload(res.data, 'template-supervisor.xlsx')
            }
        )
        .catch(err => {
                handleLoading()
                message.error(err.response.data.message)
            }
        );
};

export const getAnalyticsExport = (handleError, handleLoading, data) => dispatch => {
    handleError()
    axios.get(`${IP}api/export/analytics?period=${data.period}&regionId=${data.regionId}&raionId=${data.raionId}&dateFrom=${data.dateFrom}&dateTo=${data.dateTo}`, { responseType: 'arraybuffer' })
        .then(res=> {
                handleLoading()
                fileDownload(res.data, 'analytics.xlsx')
            }
        )
        .catch(err=> {
                handleLoading()
                message.error('Ошибка при получении данных!');
            }
        );
};
export const getSupervisorStatistics = ( handleError, handleLoading) => dispatch => {
    handleError()
    axios.get(IP+'api/statistics/supervisor')
        .then(res=> {
                handleLoading()
                return dispatch({
                    type: GET_STATISTICS,
                    payload: res.data
                });
            }

        )
        .catch(err=> {
                console.log(err)
                handleLoading()
                message.error("Ошибка при получении данных!")
            }
        );
};
export const getOperatorStatistics = ( handleError, handleLoading) => dispatch => {
    handleError()
    axios.get(IP+'api/statistics/contact-person')
        .then(res=> {
                handleLoading()
                return dispatch({
                    type: GET_STATISTICS,
                    payload: res.data
                });
            }

        )
        .catch(err=> {
                console.log(err)
                handleLoading()
                message.error("Ошибка при получении данных!")
            }
        );
};
export const getUsersByOrganization=(data)=>dispatch=>{
    axios.get(IP+'api/organizations/'+data.id+'/users/'+data.role)
        .then(res=> {
                return dispatch({
                    type: GET_USERS_ORGANIZATION,
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

export const getProfile=()=>dispatch=>{
    axios.get(IP+'api/profile/')
        .then(res=> {
                return dispatch ({
                    type:GET_PROFILE,
                    payload:res.data,
                } )
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

export const resetPassword = (data, history) => dispatch => {
    axios.post(IP+'api/auth/reset',data)
        .then(res=> {
            Modal.success({
                content: 'Проверьте почту',
            });
            history.push('/')
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
