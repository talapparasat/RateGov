import axios from "axios";
import {
   GET_CONFIRM,
    GET_ERRORS,
    GET_SERVICE_PROVIDER_ID,
    GET_SERVICE_PROVIDERS,GET_SUPERVISORS, GET_USERS,
    IP, MODAL
} from "./types";
import {message, Modal} from "antd";
import fileDownload from "js-file-download";

export const saveServiceProvider = (data, id, history, handleLoading, handleError) => dispatch => {
    if (!id) {
        dispatch(addServiceProvider(data, history, handleLoading, handleError));
    } else {
        dispatch(updateServiceProvider(data, id, history, handleLoading, handleError));
    }
}

export const addServiceProvider = (data, history, handleLoading, handleError) => dispatch => {
    let fm = new FormData();

    fm.append('nameRu', data.nameRu);
    fm.append('nameKz', data.nameKz);
    fm.append('image',data.image);
    fm.append('info', data.info);
    fm.append('address',data.address);
    fm.append('coordinates',JSON.stringify(data.coordinates));
    fm.append('workHours',JSON.stringify(data.workHours));
    handleError();
    axios.post(IP+'api/service-providers/', fm, {
        headers: {
            'Content-Type' : false,
            'Process-Data' : false
        }
    }).then(res=> {
        handleLoading();
        message.success('Услугодатель успешно добавлен!');
        localStorage.setItem('serviceProvider', res.data._id);
        history.push('/dashboard/provider/connect');
        return dispatch (
            {
                type: GET_SERVICE_PROVIDER_ID,
                payload: res.data
            }
        )})
        .catch(err=> {
            handleLoading();
            message.error('Ошибка при добавлении!');
                // return dispatch({
                //     type: GET_ERRORS,
                //     payload: err.response.data
                // });
            }
        );
};
export const updateServiceProvider = (data, id, history, handleLoading, handleError) => dispatch => {
    data.suspended =false;
    let fm = new FormData();

    fm.append('nameRu', data.nameRu);
    fm.append('nameKz', data.nameKz);
    fm.append('image',data.image);
    fm.append('suspended',data.suspended);
    fm.append('info', data.info);
    fm.append('address',data.address);
    fm.append('coordinates',JSON.stringify(data.coordinates));
    fm.append('workHours',JSON.stringify(data.workHours));
    handleError()
    axios.put(IP+'api/service-providers/'+id, fm, {
        headers: {
            'Content-Type' : false,
            'Process-Data' : false
        }
    }).then(res=> {
        handleLoading()
        message.success('Услугодатель успешно изменен!')
            history.push('/dashboard/provider/connect');
            return dispatch (
                {
                    type: GET_SERVICE_PROVIDER_ID,
                    payload: res.data._id
                }
            )
        }

    )
        .catch(err=> {
            handleLoading()
            message.error('Ошибка при изменении!')
                // return dispatch({
                //     type: GET_ERRORS,
                //     payload: err.response.data
                // });
            }
        );
};
export const getSupervisorsByOrganization=(data, handleError, handleLoading)=>dispatch=>{
    handleError()
    axios
        .get(IP + 'api/organizations/'+data.id+'/users/supervisors?autocomplete=true&'+'query='+data.query)
        .then(res=> {
            handleLoading()
                return dispatch ({
                    type: GET_SUPERVISORS,
                    payload: res.data
                })
            }
        )
        .catch(err=> {
                console.log(err)
            handleLoading()
              message.error('Ошибка при получении данных!')
            }
        );
};
export const getServiceProviderById=(id)=>dispatch=>{
    axios
        .get(IP + 'api/service-providers/'+id)
        .then(res=>

            {

                return dispatch ({
                    type: GET_SERVICE_PROVIDER_ID,
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
export const uploadServiceProvider = ( handleError, handleLoading, data ) => dispatch => {
    handleError()
    let fm = new FormData();
    fm.append('file', data);
    axios.post(`${IP}api/import/service-providers`, fm)
        .then(res => {
                handleLoading()
                message.success('Услугодатели загружены')
            }
        )
        .catch(err => {
                handleLoading()
                //message.error(err.response.data.message)
                fileDownload(err, 'error.txt')
            }
        );
};

export const getTemplateServiceProvider = ( handleError, handleLoading ) => dispatch => {
    handleError()
    axios.get(`${IP}api/import/service-providers/template`)
        .then(async res => {
                handleLoading()
            fileDownload(res.data, 'template-service-provider.xlsx')
            }
        )
        .catch(err => {
                handleLoading()
                message.error(err.response.data.message)
            }
        );
};
export const getServiceProviderByOrganization = (id, query, handleError, handleLoading) => dispatch => {
    handleError()
    axios
        .get(IP + 'api/organizations/'+id+'/service-providers/autocomplete?query='+query)
        .then( res =>
            {
                handleLoading()
                return dispatch ({
                    type: GET_SERVICE_PROVIDERS,
                    payload: res.data
                })
            }
        )
        .catch( err => {
            handleLoading()
            message.error('Ошибка при получении услугодателей!')
                // return dispatch({
                //     type: GET_ERRORS,
                //     payload: err.response.data
                // });
            }
        );
};
export const getServiceProviders = (data, handleLoading, handleError) => dispatch => {
    handleError()
    axios
        .get(IP + 'api/service-providers?page='+data.page+'&query='+data.query)
        .then(res => {
            handleLoading()
                return dispatch ({
                    type: GET_SERVICE_PROVIDERS,
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
export const getFreeOperators=(handleError, handleLoading)=>dispatch=>{
    handleError()
    axios.get(IP+'api/service-providers/'+localStorage.getItem('serviceProvider')+'/users/operators/withFree')
        .then(res=> {
            handleLoading()
                return dispatch({
                    type: GET_USERS,
                    payload: res.data
                });
            }

        )
        .catch(err=> {
            handleLoading()
            message.error('Ошибка при получении данных!')
            }
        );
};
export const connectServiceProvider = (handleError, handleLoading, data, history) => dispatch => {
    handleError()
    axios.post(IP+'api/organizations/'+data.organizationId+'/service-providers/'+data.serviceProviderId,{supervisorId:data.supervisorId,serviceProviderTypeId:data.serviceProviderTypeId, navId: data.navId})
        .then(res => {
            handleLoading()
            message.success('Элементы успешно привязаны!')
            history.push('/dashboard/provider/operator/connect');
                return dispatch({
                    type: GET_ERRORS,
                    payload: {}
                })
            }
        )
        .catch(err => {
               handleLoading()
            message.error('Ошибка при привязке!')
            }
        );
};
export const connectOperator=(data)=>dispatch=>{

    axios.post(IP+'api/service-providers/'+data.organizationId+'/users/operator/'+data.userId)
        .then(res=> {

                Modal.success({
                    content: 'Вы успешно выбрали услугодателя',
                });
                return dispatch({
                    type: GET_ERRORS,
                    payload: {}
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
export const connectProviderWithOperator = (handleError, handleLoading, data, history, id) => dispatch => {
    handleError()
    axios.post(IP+'api/service-providers/'+id+'/users/operator/array',{users:JSON.stringify(data)})
        .then(res=> {
            handleLoading()
            if (data.length > 0) {
                message.success("Операторы успешно привязаны!")
            }
            history.push('/dashboard/provider/confirm');
                return dispatch({
                    type: GET_ERRORS,
                    payload: {}
                })
            }
        )
        .catch(err=> {
            handleLoading()
               message.error("Ошибка при привязке операторов!")
            }
        );
};
export const getProviderConfirm = (id, handleError, handleLoading) => dispatch => {
    handleError()
    axios.get(IP+'api/service-providers/'+id+'/confirm')
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
export const deleteServiceProvider = (id, data, modalClose, handleError, handleLoading) => dispatch => {
    handleError()
    axios
        .put(IP + 'api/service-providers/'+id+'/suspend')
        .then(res => {
            handleLoading()
            modalClose()
            message.success('Услугодатель успешно удален!')
               return dispatch (
                    getServiceProviders(data)
                )

            }
        )
        .catch(err => {
            handleLoading()
            message.error('Ошибка при удалении!')
            }
        );
};
export const getExcelServiceProvider = (handleError, handleLoading) => dispatch => {
    handleError()
    axios.get(IP+'api/export/service-providers', { responseType: 'arraybuffer' })
        .then(res=> {
                handleLoading()
                fileDownload(res.data, 'service-providers.xlsx')
            }
        )
        .catch(err=> {
                handleLoading()
                message.error('Ошибка при получении данных!');
            }
        );
};