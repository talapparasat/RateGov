import {
    GET_ANALYTICS,
    GET_CONFIRM, GET_PROFILE, GET_REVIEWS, GET_STATISTICS,
    GET_USER_ID, GET_USERS, GET_USERS_ORGANIZATION,

    ORGANIZATION_LOADING,
} from "../actions/types";

const initialState={
    user:{},
    users:[],
    orgUsers:[],
    confirm:{},
    profile:{},
    reviews:[],
    statistics: {},
    analytics: {},
};
export default function (state = initialState, action) {
    switch (action.type) {
        case GET_USER_ID:
            return {
                ...state,
                user : action.payload,
                loading : false
            };
        case GET_STATISTICS:
            return {
                ...state,
                statistics : action.payload,
                loading : false
            };
        case GET_USERS:
            return {
                ...state,
                users : action.payload,
                loading : false
            };
        case GET_USERS_ORGANIZATION:
            return {
                ...state,
                orgUsers : action.payload,
                loading : false
            };
        case GET_CONFIRM:
            return{
                ...state,
                confirm:action.payload,
                loading:false
        }
        case GET_PROFILE:
            return{
                ...state,
                profile:action.payload,
                loading:false
            }
        case GET_ANALYTICS:
            return {
                ...state,
                analytics: action.payload,
                loading:false
            }
        case ORGANIZATION_LOADING:
            return {
                ...state,
                loading:true
            };
        default:
            return state;
    }
}