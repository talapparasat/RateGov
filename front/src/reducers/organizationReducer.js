import {GET_ORGANIZATION, GET_ORGANIZATION_BY_ID, GET_ORGANIZATION_ID, ORGANIZATION_LOADING} from "../actions/types";

const initialState={
    organizations : [],
    organizationItem:{},
    organization_id:null,
    loading : false,
};
export default function (state=initialState,action) {
    switch (action.type) {
        case GET_ORGANIZATION:
            return {
                ...state,
                organizations : action.payload,
                loading : false
            };
        case GET_ORGANIZATION_BY_ID:
            return {
                ...state,
                organizationItem : action.payload,
                loading : false
            };
        case GET_ORGANIZATION_ID:
            return {
                ...state,
                organization_id : action.payload,
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