import {GET_ALL_SERVICE, GET_SERVICE, } from "./types";
import {GET_ERRORS, IP} from "./types";
import axios from 'axios'
import {message} from "antd";
export const getServices=(data)=>dispatch=>{
    axios
        .get(IP + 'api/service-names/spts/'+data.service_type_id+'?query='+data.query+'&lang=' + data.lang)
        .then(res=>
            {
                return dispatch ({
                    type: GET_SERVICE,
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
export const getAllServices=(data)=>dispatch=>{
    axios
        .get(IP + 'api/organizations/'+data+'/services/')
        .then(res=>
            {
                return dispatch ({
                        type: GET_ALL_SERVICE,
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
export const addService = (data, handleError, handleLoading) => dispatch => {
    handleError()
    axios
        .post(IP + 'api/organizations/'+data.organizationId+'/services/',data)
        .then(res => {
            handleLoading();
            message.success('Услуга успешно добавлена!')
            return dispatch (
                getAllServices(data.organizationId)
            )}
        )
        .catch(err=> {
                // return dispatch({
                //     type: GET_ERRORS,
                //     payload: err.response.data
                // });
            handleLoading()
            message.error('Ошибка при добавлении!')
            }
        );
};
export const addServiceConnect = (data, handleError, handleLoading) => dispatch => {
    handleError()
    axios
        .post(IP + 'api/organizations/'+data.organizationId+'/services/'+data.serviceId,{serviceProviderTypeId:data.serviceProviderTypeId})
        .then(res => {
            handleLoading();
            message.success('Услуга успешно добавлена!')
            return dispatch (getAllServices(data.organizationId))
            }
        )
        .catch(err=> {
                // return dispatch({
                //     type: GET_ERRORS,
                //     payload: err.response.data
                // });
            handleLoading()
            message.error('Ошибка при добавлении!')
            }
        );
};
export const getAllServiceSearch = (data, handleLoading, handleError) => dispatch => {
    handleError()
    axios
        .get(IP + 'api/service-names?page='+data.page+'&query='+data.query)
        .then(res=> {
            handleLoading()
                return dispatch ({
                    type:GET_ALL_SERVICE,
                    payload: res.data
                })
            }
        )
        .catch(err=> {
            handleLoading()
            message.error('Ошибка при получении данных')
            }
        );
};

export const deleteServiceOrganization = (data, handleError, handleLoading) => dispatch => {
    handleError()
    axios.put(IP + 'api/organizations/'+data.organizationId+'/services/'+data.serviceId+'/suspend',{serviceProviderTypeId:data.serviceProviderTypeId})
        .then(res =>  {
            handleLoading()
            message.success('Услуга успешно удалена!');
            return  dispatch(getAllServices(data.organizationId))

            }
        )
        .catch(err=> {
                // return dispatch({
                //     type: GET_ERRORS,
                //     payload: err.response.data
                // });
            handleLoading();
            message.error('Ошибка при удалении')
            }
        );
};
