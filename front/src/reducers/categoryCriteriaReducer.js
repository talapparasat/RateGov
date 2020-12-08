import {
    GET_CATEGORIES,
    GET_CATEGORIES_ALL,
    ORGANIZATION_LOADING
} from "../actions/types";

const initialState={
    categories : [],
    categoriesAll:[],
    loading : false,
};
export default function (state=initialState,action) {
    switch (action.type) {
        case GET_CATEGORIES:
            return {
                ...state,
                categories : action.payload,
                loading : false
            };
        case GET_CATEGORIES_ALL:
            return {
                ...state,
                categoriesAll : action.payload,
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