import axios from "axios";
import {GET_ERRORS, GET_FIELDS, GET_FIELDS_OSPT, IP} from "./types";
import {message} from "antd";

export const getFieldsOspt = (data, handleError, handleLoading) => dispatch => {
    handleError()
    axios
        .get(IP + 'api/organizations/' + data.organizationId + '/fields?serviceProviderTypeId=' + data.serviceProviderTypeId)
        .then(res=> {
            handleLoading()
                return dispatch ({
                    type:GET_FIELDS_OSPT,
                    payload: res.data
                })
            }
        )
        .catch(err=> {
            handleLoading()
            message.error('Ошибка при получении данных!')
                // return dispatch({
                //     type: GET_ERRORS,
                //     payload: err.response.data
                // });

            }
        );
};
export const getFields = (data, handleLoading, handleError) => dispatch => {
    handleError()
    axios
        .get(IP + 'api/fields?page='+data.page+'&query='+data.query)
        .then(res=> {
            handleLoading()
                return dispatch ({
                    type:GET_FIELDS,
                    payload: res.data
                })
            }
        )
        .catch(err=> {
            handleLoading()
            message.error("Ошибка при получении данных!")
            }
        );
};
export const addField = (data, closeModal, handleError, handleLoading) => dispatch => {
    handleError()
    axios
        .post(IP + 'api/fields',data)
        .then(res => {
            handleLoading()
            closeModal()
            message.success("Поле успешно добавлено!")
                return dispatch (
                    getFields({query: '', page: 1}, handleLoading, handleError)
                )
            }
        )
        .catch(err=> {
            handleLoading()
            message.error("Ошибка при добавлении!")
            }
        );
};
export const connectOrganization = (data, handleError, handleLoading) => dispatch => {
    handleError();
    axios
        .post(IP + 'api/organizations/' + data.organizationId + '/fields/' + data.fieldId ,{serviceProviderTypeId : data.serviceProviderTypeId})
        .then(res => {
            handleLoading()
            message.success('Успешно связали поле с организацией')
                return dispatch (
                    getFieldsOspt({organizationId: data.organizationId, serviceProviderTypeId: data.serviceProviderTypeId}, handleError, handleLoading)
                )
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
export const deleteConnect = (data, handleError, handleLoading) => dispatch => {
    handleError()
    axios
        .delete(IP + 'api/organizations/' + data.organizationId + '/fields/' + data.fieldId + '?serviceProviderTypeId=' + data.serviceProviderTypeId)
        .then(res => {
            handleLoading()
            message.success('Поле успешно удалено!')
                return dispatch (
                    getFieldsOspt({organizationId: data.organizationId, serviceProviderTypeId: data.serviceProviderTypeId}, handleError, handleLoading)
                )
            }
        )
        .catch(err => {
                // return dispatch({
                //     type: GET_ERRORS,
                //     payload: err.response.data
                // });
            handleLoading()
            message.error('Ошибка при удалении!')
            }
        );
};
export const createFieldOrganization = (id, data, closeModal, handleError, handleLoading) => dispatch => {
    handleError()
    axios
        .post(IP + 'api/organizations/' + id + '/fields/', data)
        .then(res => {
            closeModal()
            handleLoading()
            message.success('Успешно добавили и связали поле с организацией')
                return dispatch (
                    getFieldsOspt({organizationId: id, serviceProviderTypeId: data.serviceProviderTypeId}, handleError, handleLoading)
                )
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
export const deleteField = (id, closeModal, handleError,handleLoading) => dispatch => {
    handleError()
    axios.delete(IP + 'api/fields/' + id)
        .then( res =>  {
            handleLoading()
            closeModal()
            message.success('Поле успешно удалено!')
              return dispatch(getFields({query: '', page: 1}, handleLoading, handleError))
            }
        )
        .catch( err => {
            handleLoading()
            message.error('Ошибка при удалении!')
            }
        );
};
export const updateField = (id, data, closeModal, handleError, handleLoading) => dispatch => {
    handleError()
    axios.put(IP + 'api/fields/' + id, data)
        .then( res =>  {
            handleLoading()
            message.success('Поле успешно изменено!')
                closeModal()
                return dispatch(getFields({query: '', page: 1}, handleLoading, handleError))
            }
        )
        .catch( err => {
               handleLoading()
            message.error('Ошибка при редактировании!')
            }
        );
};
