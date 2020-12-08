import {GET_ALL_SERVICE, GET_SERVICE, MODAL, ORGANIZATION_LOADING} from "../actions/types";

const initialState={
    services : [],
    allServices:[],
    loading : false,
    modal:true
};
export default function (state=initialState,action) {

    switch (action.type) {
        case GET_SERVICE:
            return {
                ...state,
                services : action.payload,
                loading : false
            };
        case GET_ALL_SERVICE:
            return {
                ...state,
                allServices : action.payload,
                loading : false
            };
        case MODAL:
            return {
                ...state,
                modal : action.payload,
                loading : false
            };

        case ORGANIZATION_LOADING:
            return {
                ...state,
                loading:true
            };
        default:
            return state;
    }
}