import {GET_NOTIFICATIONS, GET_REVIEWS, GET_REVIEW} from "../actions/types";
const initialState={
    reviews: [],
    notifications: [],
    review: {},
};
export default function (state=initialState,action) {
    switch (action.type) {
        case GET_REVIEWS:
            return {
                ...state,
                reviews : action.payload,
                loading : false
            };
        case GET_REVIEW:
            return {
                ...state,
                review : action.payload,
                loading : false
            };
        case GET_NOTIFICATIONS:
            return {
                ...state,
                notifications : action.payload,
                loading : false
            };
        default:
            return state;
    }
}