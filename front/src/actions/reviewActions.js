import axios from "axios";
import {GET_ERRORS, GET_NOTIFICATIONS, GET_REVIEW, GET_REVIEWS, IP} from "./types";
import {message} from "antd";
import fileDownload from "js-file-download";
export const getReviews = (data, handleLoading, handleError) => dispatch => {
    handleError()
    if (!data.regionId) {
        data.regionId = '';
    }
    if (!data.raionId) {
        data.raionId = '';
    }
    if (!data.serviceTypeId) {
        data.serviceTypeId = '';
    }
    if (!data.phone) {
        data.phone = '';
    }
    if (!data.iin) {
        data.iin = '';
    }
    axios.get(IP+`api/reviews?page=${data.page}&status=${data.status}&whose=${data.whose}&regionId=${data.regionId}&raionId=${data.raionId}&serviceProviderTypeId=${data.serviceTypeId}&phone=${data.phone}&iin=${data.iin}`)
        .then(res=> {
            handleLoading()
                return dispatch ({
                    type:GET_REVIEWS,
                    payload:res.data,
                } )
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
export const getNotifications = () => dispatch => {
    axios.get(IP+'api/notifications')
        .then(res=> {
                return dispatch ({
                    type:GET_NOTIFICATIONS,
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
export const deleteNotification = id => dispatch => {
    axios.put(IP+'api/notifications/' + id + '/read')
        .then(res=> {
                return dispatch (getNotifications())
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
export const getReviewById = (data, handleError, handleLoading) => dispatch => {
    handleError()
    axios.get(IP+'api/reviews/'+data)
        .then(res=> {
            handleLoading()
                return dispatch ({
                    type:GET_REVIEW,
                    payload:res.data,
                } )
            }

        )
        .catch(err=> {
            handleLoading()
               message.error('Ошибка при получении данных!');
            }
        );
};
export const deleteReview = (data, closeModal, handleError, handleLoading) => dispatch => {
    handleError()
    axios.delete(IP + 'api/reviews/' + data.id)
        .then(res => {
                handleLoading()
                 closeModal()
            message.success('Отзыв успешно удален!');
              return dispatch(getReviews(data, handleLoading, handleError))
            }
        )
        .catch(err => {
            console.log(err)
                handleLoading()
                message.error('Ошибка при удалении!');
            }
        );
};
export const getExcelReview = (handleError, handleLoading) => dispatch => {
    handleError()

    axios.get(IP+'api/export/reviews', { responseType: 'arraybuffer' })
        .then(res=> {
                handleLoading()
               fileDownload(res.data, 'review.xlsx')
            }
        )
        .catch(err=> {
                handleLoading()
                message.error('Ошибка при получении данных!');
            }
        );
};
