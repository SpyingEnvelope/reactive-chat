export const ADD_WORDS = 'ADD_WORDS';
export const REMOVE_WORD = 'REMOVE_WORD';
export const REMOVE_ALL_WORDS = 'REMOVE_ALL_WORDS';
export const SET_PAGE_DATA = 'SET_PAGE_DATA';
export const SET_PAGE_NAME = 'SET_PAGE_NAME';
export const SET_WIDTH = 'SET_WIDTH'

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

export const setWidth = width => dispatch => {
    dispatch({
        type: SET_WIDTH,
        payload: width
    })
}