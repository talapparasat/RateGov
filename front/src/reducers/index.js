import  {combineReducers} from "redux";
import authReducer from './authReducer';
import profileReducer from "./profileReducer";
import organizationReducer from "./organizationReducer";
import serviceTypeReducer from "./serviceTypeReducer";
import serviceReducer from "./serviceReducer";
import criteriaReducer from "./criteriaReducer";
import categoryCriteriaReducer from "./categoryCriteriaReducer";
import adminReducer from "./adminReducer";
import serviceProviderReducer from "./serviceProviderReducer"
import userReducer from "./userReducer";
import errorReducer from "./errorReducer";
import navigationReducer from "./navigationReducer";
import reviewReducer from "./reviewReducer";
import fieldReducer from "./fieldReducer";
import loadingReducer from "./loadingReducer"
export default combineReducers({
    profile:profileReducer,
    auth: authReducer,
    organization:organizationReducer,
    serviceType:serviceTypeReducer,
    service:serviceReducer,
    categoryCriteria:categoryCriteriaReducer,
    criteria:criteriaReducer,
    admin:adminReducer,
    user:userReducer,
    serviceProvider:serviceProviderReducer,
    error:errorReducer,
    navs: navigationReducer,
    review: reviewReducer,
    field: fieldReducer,
    loading: loadingReducer,
});
