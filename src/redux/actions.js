export const ADD_WORDS = 'ADD_WORDS';
export const REMOVE_WORD = 'REMOVE_WORD';
export const REMOVE_ALL_WORDS = 'REMOVE_ALL_WORDS';
export const SET_PAGE_DATA = 'SET_PAGE_DATA';
export const SET_PAGE_NAME = 'SET_PAGE_NAME';
export const SET_EDIT = 'SET_EDIT';
export const SET_TALKING = 'SET_TALKING';
export const SET_PAGE_LOADING = 'SET_PAGE_LOADING';
export const SET_IMAGE_PATH = 'SET_IMAGE_PATH';
export const SET_IMAGE_DONE = 'SET_IMAGE_DONE';

export const addWords = word => dispatch => {
    dispatch({
        type: ADD_WORDS,
        payload: word
    })
}

export const removeWord = word => dispatch => {
    dispatch({
        type: REMOVE_WORD,
        payload: word
    })
}

export const removeAllWords = word => dispatch => {
    dispatch({
        type: REMOVE_ALL_WORDS,
        payload: word
    })
}

export const setPageData = pageData => dispatch => {
    dispatch({
        type: SET_PAGE_DATA,
        payload: pageData
    })
}

export const setPageName = pageName => dispatch => {
    dispatch({
        type: SET_PAGE_NAME,
        payload: pageName
    })
}

export const setEdit = edit => dispatch => {
    dispatch({
        type: SET_EDIT,
        payload: edit
    })
}

export const setTalking = talk => dispatch => {
    dispatch({
        type: SET_TALKING,
        payload: talk
    })
}

export const setPageLoading = loading => dispatch => {
    dispatch({
        type: SET_PAGE_LOADING,
        payload: loading
    })
}

export const setImagePath = path => dispatch => {
    dispatch({
        type: SET_IMAGE_PATH,
        payload: path
    })
}

export const setImageDone = done => dispatch => {
    dispatch({
        type: SET_IMAGE_DONE,
        payload: done
    })
}


