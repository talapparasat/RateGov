import {
    GET_CATEGORIES_CRITERIA,
    GET_CRITERIAS, GET_CRITERIAS_ALL,
    ORGANIZATION_LOADING
} from "../actions/types";

const initialState={
    criterias : [],
    criteriasAll:[],
    criteriaCategories:{},
    loading : false,
};
export default function (state=initialState,action) {
    switch (action.type) {
        case GET_CRITERIAS:
            return {
                ...state,
                criterias : action.payload,
                loading : false
            };
        case GET_CRITERIAS_ALL:
            return {
                ...state,
                criteriasAll : action.payload,
                loading : false
            };
        case GET_CATEGORIES_CRITERIA:
            return {
                ...state,
                criteriaCategories : action.payload,
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