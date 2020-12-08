import {
    GET_ADMINS,
    ORGANIZATION_LOADING,
    GET_ADMIN_ALL, GET_ADMIN, GET_ADMINS_ORGANIZATION
} from "../actions/types";

const initialState={
    admins : [],
    adminAll:{},
    loading : false,
    admin:{},
    adminsOrganization:[],
};
export default function (state=initialState,action) {
    switch (action.type) {
        case GET_ADMINS:
            return {
                ...state,
                admins : action.payload,
                loading : false
            };
        case GET_ADMINS_ORGANIZATION:
            return{
                ...state,
                adminsOrganization : action.payload,
                loading : false
            }
        case GET_ADMIN:
            return {
                ...state,
                admin : action.payload,
                loading : false
            };
        case GET_ADMIN_ALL:
            return {
            ...state,
            adminAll : action.payload,
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