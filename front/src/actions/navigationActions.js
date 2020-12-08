import axios from "axios";
import {GET_CRITERIAS_ALL, GET_ERRORS, GET_MAX, GET_NAV_CHILD, GET_NAV_PARENT, GET_NAVS, GET_PREVS, IP} from "./types";
import { message } from 'antd';

export const addNavigation = (data, closeModal, handleError, handleLoading) => dispatch => {
    handleError()
    axios
        .post(IP + 'api/navs',data)
        .then(res => {
            handleLoading()
            closeModal()
            message.success('Навигация успешно добавлена!')
                return dispatch (
                getNavigation(handleError, handleLoading)
                )
            }
        )
        .catch(err => {
               handleLoading()
               message.error('Ошибка при добавлении!')
            }
        );
};
export const connectNavigationOrganization = (data, handleError, handleLoading) => dispatch => {
    handleError()
    axios
        .post(IP + 'api/navs/connectArray',data)
        .then(res => {
            handleLoading()
                return  (
                    message.success('Вы успешно добавили навигацию')
                )
            }
        )
        .catch(err=> {
                console.log(err)
                // return dispatch({
                //     type: GET_ERRORS,
                //     payload: err.response.data
                // });
            }
        );
};
export const updateNavigation = (id, data, closeModal, handleError, handleLoading) => dispatch => {
    handleError()
    axios
        .put(IP + 'api/navs/' + id, data)
        .then(res=> {
            closeModal()
            handleLoading()
            message.success('Вы успешно изменили навигацию')
                return dispatch (
                    getNavigation(handleError, handleLoading)
                )
            }
        )
        .catch(err=> {
            handleLoading()
            message.error('Ошибка при редактировании')
            }
        );
};
export const getNavigation = (handleError, handleLoading) => dispatch => {
    handleError()
    axios
        .get(IP + 'api/navs')
        .then(res=> {
            handleLoading()
                return dispatch ({
                    type:GET_NAVS,
                    payload: res.data
                })
            }
        )
        .catch(err=> {
            handleLoading()
            message.error('Ошибка при получении данных!')
            }
        );
};
export const getPrev = id => dispatch => {
    axios
        .get(IP + 'api/navs?prevId=' + id)
        .then(res=> {
                if(id){
                    return dispatch ({
                        type: GET_NAV_CHILD,
                        payload: res.data
                    })
                }
                else {
                    return dispatch ({
                        type: GET_NAV_PARENT,
                        payload: res.data
                    })
                }
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
export const getMaxOrder = data => dispatch => {
    let id = data ? data : '';
    let prev = data ? '?prevId=' : ''
    axios
        .get(IP + 'api/navs/max' + prev + id)
        .then(res=> {
                return dispatch ({
                    type:GET_MAX,
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
export const deleteNav = (data, isDelete, closeModal, handleError, handleLoading) => dispatch => {
    console.log(1)
    let isDeleteNav = isDelete ? `setNull` : `to=${data.to}`
    console.log(isDeleteNav)
    handleError()
    axios
        .delete(IP + 'api/navs/' + data.navId + '/confirmed?' +  isDeleteNav)
        .then(res=> {
            handleLoading()
            closeModal()
            message.success('Успешно удалили навигацию')
                return  dispatch(
                    getNavigation(handleError, handleLoading)
                )

            }
        )
        .catch(err=> {
            handleLoading()
            message.error('Ошибка при удалении навигации')
            }
        );
};

export const isDelete = (record, sendToDelete, handleError, handleLoading) => dispatch => {
    axios
        .delete(IP + 'api/navs/' + record._id)
        .then(res => {
                if (!res.data.isDeleted){
                    sendToDelete(res.data.navsCount, res.data.serviceProvidersCount, record)
                }
                else {
                    dispatch(getNavigation(handleError, handleLoading))
                }
            }
        )
        .catch(err => {
            console.log(err)
            // return dispatch({
            //     type: GET_ERRORS,
            //     payload: err.response.data
            // });
            }
        );
};

export const getOrganizationNavigation = (data, handleError, handleLoading) => dispatch => {
    handleError();
    axios
        .get(IP + 'api/navs/by-ospt?organizationId=' + data.organizationId + '&serviceProviderTypeId=' + data.serviceProviderTypeId)
        .then(res => {
            handleLoading()
                return dispatch ({
                    type:GET_NAVS,
                    payload: res.data
                })
            }
        )
        .catch(err=> {
                // return dispatch({
                //     type: GET_ERRORS,
                //     payload: err.response.data
                // });
            message.error('Ошибка при получении навигации!')
            }
        );
};
export const getNavigationByOspt = (data) => dispatch => {
    axios
        .get(IP + 'api/navs/by-ospt?organizationId=' + data.organizationId + '&serviceProviderTypeId=' + data.serviceProviderTypeId + '&prevId=' + data.prevId)
        .then(res=> {
            if(data.prevId){
                return dispatch ({
                    type:GET_NAVS,
                    payload: res.data
                })
            }
            else {
                return dispatch ({
                    type:GET_PREVS,
                    payload: res.data
                })
            }

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