import {GET_ALL_SERVICE_TYPE, GET_ERRORS, GET_SERVICE_TYPE, GET_SERVICE_TYPE_BY_ID, IP, } from "./types";
import axios from 'axios'
import {message} from 'antd'
export const getServiceType = ( )=> dispatch => {
    axios
        .get(IP + 'api/service-provider-types/autocomplete')
        .then(res=> {
                return dispatch ({
                    type: GET_SERVICE_TYPE,
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
export const getServiceTypesByOrganization = (id, handleError, handleLoading) => dispatch => {
    handleError();
    axios
        .get(IP + 'api/organizations/'+id+'/spt')
        .then(res =>
            {
                handleLoading();
                return dispatch ({
                    type: GET_SERVICE_TYPE_BY_ID,
                    payload: res.data
                })
            }
        )
        .catch(err=> {
                // return dispatch({
                //     type: GET_ERRORS,
                //     payload: err.response.data
                // });
            message.error(' Ошибка при получении типов услугодателей!')
            handleLoading();
            }
        );
};
export const addServiceType = (data, handleError, handleLoading) => dispatch => {
    let dataItem = {
        nameKz: data.nameKz,
        nameRu: data.nameRu,
        image: data.image,
        isGovernment: data.isGovernment
    }
    let fm = new FormData();

    fm.append('nameRu', dataItem.nameRu);
    fm.append('nameKz', dataItem.nameKz);
    fm.append('image',dataItem.image);
    fm.append('isGovernment',dataItem.isGovernment);

    axios
        .post(IP + 'api/organizations/'+data.organization_id+'/spt/',fm, {
            headers: {
                'Content-Type' : false,
                'Process-Data' : false
            }
        })
        .then(res => {
                return dispatch (
                    getServiceTypesByOrganization(data.organization_id, handleError, handleLoading)
                )
            }
        )
        .catch(err=> {
                // return dispatch({
                //     type: GET_ERRORS,
                //     payload: err.response.data
                // });
            message.error('Такой тип услугодателя уже существует!')
            }
        );
};

export const addServiceTypeConnect = (data, handleError, handleLoading) => dispatch => {
    axios
        .post(IP + 'api/organizations/'+data.organizationId+'/spt/'+data.serviceProviderTypeId,data)
        .then(res => {
            return dispatch (
                    getServiceTypesByOrganization(data.organizationId, handleError, handleLoading)
                )
            }
        )
        .catch(err=> {
                // return dispatch({
                //     type: GET_ERRORS,
                //     payload: err.response.data
                // });
            message.error('Вы уже связали данный тип услугодателя с организацией!')
            }
        );
};
export const deleteServiceType = (data, handleError, handleLoading) => dispatch => {
    axios
        .put(IP + 'api/organizations/'+data.organizationId+'/spt/'+data.serviceType+'/suspend')
        .then(res => {
                dispatch (getServiceTypesByOrganization(data.organizationId, handleError, handleLoading))
                message.success('Тип услугодателя успешно удален!');
            }
        )
        .catch(err => {
            message.error('Ошибка при удалении!');
                // return dispatch({
                //     type: GET_ERRORS,
                //     payload: err.response.data
                // });
            }
        );
};
export const addSurvey = (data, handleError, handleLoading) => dispatch => {
    axios
        .post(IP + 'api/survey?organizationId=' + data.organizationId + '&serviceProviderTypeId=' + data.serviceProviderTypeId)
        .then(res=> {
                return dispatch (
                    getServiceTypesByOrganization(data.organizationId, handleError,  handleLoading)
                )
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
export const deleteSurvey = (data, handleError, handleLoading) => dispatch => {
    axios
        .delete(IP + 'api/survey?organizationId=' + data.organizationId + '&serviceProviderTypeId=' + data.serviceProviderTypeId)
        .then(res=> {
                return dispatch (
                    getServiceTypesByOrganization(data.organizationId, handleError, handleLoading)
                )
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
export const getAllServiceTypes = (data, handleLoading, handleError) => dispatch => {
    handleError()
    axios.get(IP + 'api/service-provider-types?page='+data.page+'&query='+data.query)
        .then(res => {
            handleLoading()
                return dispatch ({
                    type:GET_ALL_SERVICE_TYPE,
                    payload: res.data
                })
            }
        )
        .catch(err => {
            handleLoading()
            message.error('Ошибка при получении данных!')
            }
        );
};

