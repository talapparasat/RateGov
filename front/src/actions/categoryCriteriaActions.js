import axios from "axios";
import {GET_CATEGORIES, GET_ERRORS, GET_CATEGORIES_ALL, IP,} from "./types";
import {message} from "antd";

export const getCategories=(data)=>dispatch=>{
    axios
        .get(IP + 'api/service-categories/spts/'+data.service_type_id+'?query='+data.query+'&lang=' + data.lang)
        .then(res=> {
                return dispatch ({
                    type: GET_CATEGORIES,
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
export const getCategoriesByOrganization = (data) => dispatch => {
    axios
        .get(IP + 'api/organizations/'+data+'/categories/')
        .then(res => {
                return dispatch ({
                        type: GET_CATEGORIES_ALL,
                        payload: res.data
                        }
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
export const addCategory = (data, handleError, handleLoading) => dispatch => {
    let fm = new FormData();
    fm.append('nameRu', data.nameRu);
    fm.append('nameKz', data.nameKz);
    fm.append('image',data.image);
    fm.append('serviceProviderTypeId',data.serviceProviderTypeId);
    handleError();
    axios.post(IP + 'api/organizations/'+data.organizationId+'/categories/',fm,{
            headers: {
                'Content-Type' : false,
                'Process-Data' : false
            }
    })
        .then( res => {
            handleLoading()
            message.success('Категория успешно добавлена!')
                return dispatch (
                    getCategoriesByOrganization(data.organizationId)
                )
            }
        )
        .catch( err => {
                // return dispatch({
                //     type: GET_ERRORS,
                //     payload: err.response.data
                // });
            handleLoading()
            message.error('Ошибка при добавлении!')
            }
        );
};
export const addCategoryConnect = (data, handleError, handleLoading) => dispatch => {
    handleError()
    axios.post(IP + 'api/organizations/'+data.organizationId+'/categories/'+data.categoryId,{serviceProviderTypeId:data.serviceProviderTypeId})
        .then(res=> {
            handleLoading()
            message.success('Категория успешно добавлена!')
            return dispatch ( getCategoriesByOrganization(data.organizationId)
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
export const getAllCategories = (data, handleLoading, handleError) => dispatch => {
    handleError()
    axios.get(IP + 'api/service-categories?page='+data.page+'&query='+data.query)
        .then(res => {
            handleLoading()
                return dispatch ({
                    type:GET_CATEGORIES_ALL,
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


export const deleteCategoryOrganization = (data, handleError, handleLoading) => dispatch => {
    handleError()
    axios
        .put(IP + 'api/organizations/'+data.organizationId+'/categories/'+data.categoryId+'/suspend',{serviceProviderTypeId:data.serviceProviderTypeId})
        .then( res =>  {
            handleLoading()
            message.success('Категория успешно удалена!');
                dispatch(getCategoriesByOrganization(data.organizationId))
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
