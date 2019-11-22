// Auth Selectors
export const getAuth = state => {
    return state.firebase.auth;
};

export const getAuthError = state => {
    return state.auth.error
};

export const getAuthSuccessMessage = state => {
    return state.auth.successMessage
};

//Cases Selectors
export const getCases = state => {
    return state.firestore.ordered.cases
};

export const getCasesError = state =>{
    return state.cases.error;
};

export const getCasesSuccessMessage = state =>{
    return state.cases.successMessage;
};
