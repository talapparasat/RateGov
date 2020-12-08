import {GET_ALL_SERVICE_TYPE, GET_SERVICE_TYPE, GET_SERVICE_TYPE_BY_ID, ORGANIZATION_LOADING} from "../actions/types";

const initialState={
    serviceTypes : [],
    serviceTypesById:[],
    serviceAllTypes:[],
    loading : false,
};
export default function (state=initialState,action) {
    switch (action.type) {
        case GET_SERVICE_TYPE:
            return {
                ...state,
                serviceTypes : action.payload,
                loading : false
            };
        case GET_SERVICE_TYPE_BY_ID:
            return {
                ...state,
                serviceTypesById : action.payload,
                loading : false
            };
        case GET_ALL_SERVICE_TYPE:
            return {
                ...state,
                serviceAllTypes : action.payload,
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