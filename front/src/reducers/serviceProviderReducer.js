import {GET_SERVICE_PROVIDER_ID, GET_SERVICE_PROVIDERS, GET_SUPERVISORS, ORGANIZATION_LOADING} from "../actions/types";

const initialState={
    serviceProviders : [],
    serviceProvider:{},
    supervisors:[],
    loading : false,
};
export default function (state=initialState,action) {
    switch (action.type) {
        case GET_SERVICE_PROVIDERS:
            return {
                ...state,
                serviceProviders : action.payload,
                loading : false
            };
        case GET_SERVICE_PROVIDER_ID:
            return {
                ...state,
                serviceProvider : action.payload,
                loading : false
            };
        case GET_SUPERVISORS:
            return {
                ...state,
                supervisors : action.payload,
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