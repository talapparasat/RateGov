import {

    CLEAR_CURRENT_PROFILE,

} from "../actions/types";

const initialState={
    profile:null,
}
export default function (state=initialState,action){
    switch (action.type) {

        case CLEAR_CURRENT_PROFILE:
            return{
               profile:undefined
            }


        default:
            return state;

    }
}