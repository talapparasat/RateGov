import {GET_ERRORS, GET_ORGANIZATION, GET_ORGANIZATION_BY_ID, IP, MODAL} from "./types";
import axios from 'axios'
import {message} from 'antd'
export const getOrganizations = (data, handleError, handleLoading) => dispatch => {
    handleError()
    axios
        .get(IP + 'api/organizations?query='+data.query+'&page='+data.page)
        .then(res => {
            handleLoading()
                return dispatch ({
                    type: GET_ORGANIZATION,
                    payload: res.data
                })
            }
        )
        .catch(err => {
            handleLoading()
                // return dispatch({
                //     type: GET_ERRORS,
                //     payload: err.response.data
                // });
            }
        );
};
export const getOrganizationsAuto=(data)=>dispatch=>{
    axios
        .get(IP + 'api/organizations/autocomplete?query='+data.query)
        .then(res => {
                return dispatch ({
                    type: GET_ORGANIZATION,
                    payload: res.data
                })
            }
        )
        .catch(err => {
                console.log(err)
                return dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                });
            }
        );
};
export const getOrganizationById=(id)=>dispatch=>{
    axios
        .get(IP + 'api/organizations/'+id)
        .then(res=> {
                return dispatch ({
                    type: GET_ORGANIZATION_BY_ID,
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
export const deleteOrganization = (id, data, deleteVisible, handleError, handleLoading) => dispatch => {
    handleError()
    axios
        .put(IP + 'api/organizations/'+id+'/suspend')
        .then(res => {
                handleLoading()
                deleteVisible()
                message.success('Организация успешно удалена')
                dispatch(getOrganizations(data, handleError, handleLoading))
            }
        )
        .catch(err => {
                handleLoading()
                message.error('Ошибка при удалении')
                // return dispatch({
                //     type: GET_ERRORS,
                //     payload: err.response.data
                // });
            }
        );
};
export const saveOrganization = (data, id, history, handleError) => dispatch => {
    if (!id) {
        dispatch(addOrganization(data, history, handleError));

    } else {
        dispatch(updateOrganization(data, id, history, handleError));
    }
};

export const addOrganization = (data, history, handleError) => dispatch => {
    let fm = new FormData();

    fm.append('nameRu', data.nameRu);
    fm.append('nameKz', data.nameKz);
    fm.append('image',data.image);

    axios.post(IP+'api/organizations/', fm, {
            headers: {
                'Content-Type' : false,
                'Process-Data' : false
            }
        }).then(res => {
            handleError();
            localStorage.setItem('organization_id', res.data._id)
            history.push('/dashboard/service-type/add');
            return dispatch ({
                type: GET_ORGANIZATION_BY_ID,
                payload: res.data
            })
        })
        .catch(err => {
                // return dispatch({
                //     type: GET_ERRORS,
                //     payload: err.response.data
                // });
            message.error('Такая организация уже существует!')
            }
        );
};
export const updateOrganization=(data, id, history, handleError)=>dispatch=>{
    data.suspended = false;
    let fm = new FormData();

    fm.append('nameRu', data.nameRu);
    fm.append('nameKz', data.nameKz);
    fm.append('image',data.image);
    fm.append('suspended',data.suspended);

    axios.put(IP+'api/organizations/' + id, fm, {
        headers: {
            'Content-Type' : false,
            'Process-Data' : false
        }
    }).then(res => {
            handleError();
            history.push('/dashboard/service-type/add');
                return dispatch ({
                        type: GET_ORGANIZATION_BY_ID,
                        payload: res.data._id
                    })
            }
        )
        .catch(err=> {
                // return dispatch({
                //     type: GET_ERRORS,
                //     payload: err.response.data
                // });
            message.error('Такая организация уже существует!')
            }
        );
};

