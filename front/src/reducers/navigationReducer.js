import {
    GET_MAX, GET_NAV_CHILD, GET_NAV_PARENT,
    GET_NAVS, GET_PREVS
} from "../actions/types";

const initialState={
    navs: [],
    max: 1,
    prevs: [],
    parents: [],
    children: [],
    loading : false,
};
export default function (state=initialState,action) {
    switch (action.type) {
        case GET_NAVS:
            return {
                ...state,
                navs : action.payload,
                loading : false
            };
        case GET_MAX:
            return {
                ...state,
                max : action.payload,
                loading : false
            };
        case GET_NAV_PARENT:
            return {
                ...state,
                parents : action.payload,
                loading : false
            };
        case GET_NAV_CHILD:
            return {
                ...state,
                children : action.payload,
                loading : false
            };
        case GET_PREVS:
            return {
                ...state,
                prevs : action.payload,
                loading : false
            };
        default:
            return state;
    }
}