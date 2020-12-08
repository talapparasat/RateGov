import axios from "axios";
import {
    GET_ERRORS,
    IP,
    GET_CRITERIAS,
    GET_CRITERIAS_ALL, GET_CATEGORIES_CRITERIA
} from "./types";
import {message} from "antd";

export const getCriterias=(data)=>dispatch=>{
    axios
        .get(IP + 'api/service-criterias/spts/'+data.service_type_id+'?query='+data.query+'&lang=' + data.lang+'=&categoryId='+data.category_id)
        .then(res=>
            {
                return dispatch ({
                        type: GET_CRITERIAS,
                        payload: res.data
                    }
                )}
        )
        .catch(err=> {
                return dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                });
            }
        );
};
export const getCriteriasByOrganization=(data)=>dispatch=>{
    axios
        .get(IP + 'api/organizations/'+data+'/criterias/')
        .then(res=>
            {
                return dispatch ({
                        type: GET_CRITERIAS_ALL,
                        payload: res.data
                    }
                )}
        )
        .catch(err=> {
                return dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                });
            }
        );
};
export const getCategoriesOfCriteriaByOrganization=(data)=>dispatch=>{
    axios
        .get(IP + 'api/organizations/'+data.organizationId+'/categories?serviceProviderTypeId='+data.service_type_id)
        .then(res=>
            {
                return dispatch ({
                        type: GET_CATEGORIES_CRITERIA,
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
export const addCriteria = (data, handleError, handleLoading) => dispatch => {
    handleError()
    axios
        .post(IP + 'api/organizations/'+data.organizationId+'/criterias/',data)
        .then( res => {
            handleLoading()
            message.success('Критерий успешно добавлен!')
                return dispatch (
                    getCriteriasByOrganization(data.organizationId)
                )
            }
        )
        .catch( err => {
            handleLoading()
            message.error('Ошибка при добавлении!')
                // return dispatch({
                //     type: GET_ERRORS,
                //     payload: err.response.data
                // });
            }
        );
};
export const addCriteriaConnect = (data, handleError, handleLoading) => dispatch => {
    handleError()
    axios
        .post(IP + 'api/organizations/'+data.organizationId+'/criterias/'+data.criteriaId,{serviceProviderTypeId:data.serviceProviderTypeId,serviceCategoryId:data.serviceCategoryId})
        .then( res => {
            handleLoading()
            message.success('Критерий успешно добавлен!')
                return dispatch (getCriteriasByOrganization(data.organizationId))
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
export const getAllCriteriaSearch = (data, handleLoading, handleError)=>dispatch=>{
    handleError()
    axios
        .get(IP + 'api/service-criterias?page='+data.page+'&query='+data.query)
        .then(res=> {
            handleLoading()
                return dispatch ({
                    type:GET_CRITERIAS_ALL,
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
export const deleteCriteriaOrganization = (data, handleError, handleLoading) => dispatch => {
    handleError()
    axios
        .put(IP + 'api/organizations/'+data.organizationId+'/criterias/'+data.criteriaId+'/suspend',{serviceCategoryId:data.categoryId,serviceProviderTypeId:data.serviceTypeId})
        .then(res=>  {
            handleLoading()
            message.success('Критерий успешно удален!');
               return dispatch(getCriteriasByOrganization(data.organizationId))
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
