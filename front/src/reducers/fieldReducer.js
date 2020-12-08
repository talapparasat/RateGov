import {GET_FIELDS, GET_FIELDS_OSPT} from "../actions/types";

const initialState={
    fields : [],
    fieldsOspt: [],
    loading : false,
};
export default function (state=initialState,action) {
    switch (action.type) {
        case GET_FIELDS:
            return {
                ...state,
                fields : action.payload,
                loading : false
            };
        case GET_FIELDS_OSPT:
            return {
                ...state,
                fieldsOspt : action.payload,
                loading : false
            };

        default:
            return state;
    }
}