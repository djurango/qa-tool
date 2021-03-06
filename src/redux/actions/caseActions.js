import * as moment from "moment";
export const CREATE_CASE_SUCCESS = 'CREATE_CASE_SUCCESS';
export const CREATE_CASE_ERROR = 'CREATE_CASE_ERROR';
export const CLEAN_CASE_SUCCESS = 'CLEAN_CASE_SUCCESS';
export const CLEAN_CASE_ERROR = 'CLEAN_CASE_ERROR';
export const UPDATE_CASE_SUCCESS = 'UPDATE_CASE_SUCCESS';
export const UPDATE_CASE_ERROR = 'UPDATE_CASE_ERROR';
export const UPDATE_CASE_CHECKLIST_ERROR = 'UPDATE_CASE_CHECKLIST_ERROR';
export const ADD_CHECKLIST_ELEMENT_SUCCESS = 'ADD_CHECKLIST_ELEMENT_SUCCESS';
export const ADD_CHECKLIST_ELEMENT_ERROR = 'ADD_CHECKLIST_ELEMENT_ERROR';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_ERROR = 'ADD_COMMENT_ERROR';
export const UPDATE_ARCHIVE_STATE_SUCCESS = 'UPDATE_ARCHIVE_STATE_SUCCESS';
export const UPDATE_ARCHIVE_STATE_ERROR = 'UPDATE_ARCHIVE_STATE_ERROR';

//thunk actions
export const createCase = newCase => {
    return (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();
        // noinspection NonAsciiCharacters,JSNonASCIINames
        firestore.collection('cases').add({
            ...newCase,
            approved: Boolean(false),
            date: new Date(moment.now()),
            leadChecks: {
                "Browserkompatibilät Desktop (Chrome, Firefox, IE, Edge, Safari)": Boolean(false),
                "Browserkompatibilät Mobile (iOS // Safari, Android // Chrome)": Boolean(false),
                "Page-Title korrekt": Boolean(false),
                "Favicon gesetzt": Boolean(false),
                "Open Graph Sharing komplett": Boolean(false),
                "Share-Image definiert": Boolean(false),
                "Twitter Share-Image definiert": Boolean(false),
                "Sämtliche Links und Buttons funktionieren": Boolean(false),
                "Share funktoniert": Boolean(false),
                "Print-Version ist optimiert": Boolean(false),
                "Responsive": Boolean(false),
                "Sprachversione stimmen(?lang=fr etc.)": Boolean(false),
                "Send2Friend funktioniert und ist gestyled": Boolean(false)
            },
            webChecks: {
                "Browserkompatibilät Desktop (Chrome, Firefox, IE, Edge, Safari)": Boolean(false),
                "Browserkompatibilät Mobile (iOS // Safari, Android // Chrome)": Boolean(false),
                "Page-Title korrekt": Boolean(false),
                "Favicon gesetzt": Boolean(false),
                "Open Graph Sharing komplett": Boolean(false),
                "Share-Image definiert": Boolean(false),
                "Twitter Share-Image definiert": Boolean(false),
                "Sämtliche Links und Buttons funktionieren": Boolean(false),
                "Share funktoniert": Boolean(false),
                "Print-Version ist optimiert": Boolean(false),
                "Responsive": Boolean(false),
                "Sprachversione stimmen (?lang=fr etc.)": Boolean(false),
                "Send2Friend funktioniert und ist gestyled": Boolean(false),
                "WEB: HTML-Sprache definiert": Boolean(false),
                "WEB: styles.css korrekt eingebunden": Boolean(false),
                "WEB: stepstone alternate.css": Boolean(false),
                "WEB: message.properties file korrekt": Boolean(false),
                "WEB: viewPixel implementiert": Boolean(false),
                "WEB: GoogleMaps mit korrektem API Key": Boolean(false),
                "WEB: alle Pfade korrekt ({{assetsPath}})": Boolean(false),
                "WEB: customfonts korrekt implementiert": Boolean(false)
            },
            archived: Boolean(false)
        }).then(() => {
            dispatch(getCreateCaseSuccessAction(newCase));
        }).catch(error => {
            dispatch(getCreateCaseErrorAction(error));
        })
    }
};

export const updateCase = updatedCase => {
    return (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();
        firestore.collection('cases').doc(updatedCase.id).update({
            customer: updatedCase.customer,
            projectId: updatedCase.projectId,
            lead: updatedCase.lead,
            product: updatedCase.product,
            web: updatedCase.web
        }).then(() => {
            dispatch(getUpdateCaseSuccessAction(updatedCase));
        }).catch((error) => {
            dispatch(getUpdateCaseErrorAction(error));
        })
    }
};

export const updateCaseChecklist = (updatedCheckList, caseId, checkType) => {
    return (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();
        if (updatedCheckList && Object.keys(updatedCheckList).length !== 0) {
            let caseObjectToUpdate = {};
            caseObjectToUpdate[checkType] = updatedCheckList;
            firestore.collection('cases').doc(caseId).update(caseObjectToUpdate).then(() => {
                firestore.collection('cases').doc(caseId).get().then((doc) => {
                    updateCaseApproval(firestore, dispatch, doc.data(), caseId);
                });
            }).catch((error => {
                dispatch(getUpdateCaseCheckListErrorAction(error));
            }))
        }
    }
};

export const addCheckListElement = (newChecklistElement, caseId, checkType, currentChecks) => {
    return (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();
        if (newChecklistElement !== '') {
            currentChecks[newChecklistElement] = false;
            let caseObjectToUpdate = {[checkType]: currentChecks};
            firestore.collection('cases').doc(caseId).update(caseObjectToUpdate).then(() => {
                console.log("successfully added CheckListElement");
                dispatch(getAddCheckListElementSuccessAction(newChecklistElement));
            }).catch(error => {
                console.log(error);
                dispatch(getAddCheckListElementErrorAction(error));
            })
        }
    }
};

export const updateCaseArchiveState = (caseId) => {
    return(dispatch, getState, {getFirestore}) =>{
        const firestore = getFirestore();
        firestore.collection('cases').doc(caseId).get().then((doc) => {
            const currentArchivedValue = doc.data().archived;
            firestore.collection('cases').doc(caseId).update({archived: (!currentArchivedValue === true)}).then(()=>{
                console.log("updated archive state of the case!");
                dispatch(getUpdateArchiveStateSuccessAction(doc.data().projectId));
            }).catch(error =>{
                console.log(error);
                dispatch(getUpdateArchiveStateErrorAction(error));
            })
        });
    }
};

export const createNewComment = (caseId, newCommentContent, currentComments, authorName, commentCounter) => {
    return (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();
        let comments;
        let counter;
        if (currentComments === undefined) {
            counter = 0;
            comments = {};
            comments[counter] = {author: authorName, content: newCommentContent, date: moment.now()};
            writeCommentToFirestore({comments: comments, commentCounter: ++counter}, caseId, firestore, dispatch)
        } else {
            counter = commentCounter;
            comments = currentComments;
            comments[counter] = {author: authorName, content: newCommentContent, date: moment.now()};
            writeCommentToFirestore({comments: comments, commentCounter: ++counter}, caseId, firestore, dispatch)
        }
    }
};

const writeCommentToFirestore = (caseUpdates, caseId, firestore, dispatch) => {
    firestore.collection('cases').doc(caseId).update(caseUpdates).then(() => {
        dispatch(getAddCommentSuccessAction())
    }).catch(error => {
        dispatch(getAddCommentErrorAction(error))
    })
};


const updateCaseApproval = (firestore, dispatch, updatedCase, caseId) => {
    const allChecks = [...Object.values(updatedCase.webChecks), ...Object.values(updatedCase.leadChecks)];
    const allChecksApproved = allChecks.every((element => element === true));
    if (allChecksApproved) {
        firestore.collection('cases').doc(caseId).update({
            approved: Boolean(true)
            //we dont want a snackbar to popup on case approval or disapproval so we dont dispatch actions here.
        }).then(() => {
            console.log("successfully updated case approval");
        }).catch((error) => {
            console.log("error in case approval" + error);
        })
    } else {
        firestore.collection('cases').doc(caseId).update({
            approved: Boolean(false)
            //we dont want a snackbar to popup on case approval or disapproval so we dont dispatch actions here.
        }).then(() => {
            console.log("successfully updated case approval");
        }).catch((error) => {
            console.log("error in case approval" + error);
        })
    }
};


//action creators
const getCreateCaseSuccessAction = newCase => ({
    type: CREATE_CASE_SUCCESS,
    payload: {newCase}
});
const getCreateCaseErrorAction = error => ({
    type: CREATE_CASE_ERROR,
    payload: {error}
});

const getUpdateCaseSuccessAction = updatedCase => ({
    type: UPDATE_CASE_SUCCESS,
    payload: {updatedCase}
});

const getUpdateCaseErrorAction = error => ({
    type: UPDATE_CASE_ERROR,
    payload: {error}
});

export const getUpdateCaseCheckListErrorAction = error => ({
    type: UPDATE_CASE_CHECKLIST_ERROR,
    payload: {error}
});

const getAddCheckListElementSuccessAction = addedElement => ({
    type: ADD_CHECKLIST_ELEMENT_SUCCESS,
    payload: {addedElement}
});

const getAddCheckListElementErrorAction = error => ({
    type: ADD_CHECKLIST_ELEMENT_SUCCESS,
    payload: {error}
});

const getAddCommentSuccessAction = () => ({
    type: ADD_COMMENT_SUCCESS,
});

const getAddCommentErrorAction = error => ({
    type: ADD_COMMENT_ERROR,
    payload: {error}
});

const getUpdateArchiveStateSuccessAction = projectId =>({
    type: UPDATE_ARCHIVE_STATE_SUCCESS,
    payload:{projectId}
});

const getUpdateArchiveStateErrorAction = error =>({
    type: UPDATE_ARCHIVE_STATE_ERROR,
    payload:{error}
});

export const cleanCaseSuccessAction = () => ({
    type: CLEAN_CASE_SUCCESS
});

export const cleanCaseErrorAction = () => ({
    type: CLEAN_CASE_ERROR
});





