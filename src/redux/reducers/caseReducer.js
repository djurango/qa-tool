import {CREATE_CASE, CREATE_CASE_ERROR} from "../actions/caseActions";

const initalState = {
    successMessage: null,
    error: null
};

export default function caseReducer(state = initalState, action) {
    switch (action.type) {
        case CREATE_CASE:
            console.log("created case", action.payload);
            return {
                ...state,
                successMessage: "successfully created new case with the projectid: " + action.payload.newCase.projectId + ".",
                error: null
            };
        case CREATE_CASE_ERROR:
            console.log("create case error", action.payload);
            return {
                ...state,
                successMessage: null,
                error: action.payload.error
            };
        default:
            return state;
    }
}