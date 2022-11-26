import { ADD_WORDS, REMOVE_WORD, REMOVE_ALL_WORDS, SET_PAGE_DATA, SET_PAGE_NAME, SET_WIDTH } from "./actions";

const initialState = {
    words: [],
    pageName: '',
    pageData: [],
    width: 0
}

function wordsReducer(state = initialState, action) {
    const wordsLength = state.words.length

    switch(action.type) {
        case ADD_WORDS:
            return {...state, words: [...state.words, action.payload]}
        case REMOVE_WORD:
            return {...state, words: state.words.filter((_,i) =>
                    i !== state.words.length-1
                )}
        case REMOVE_ALL_WORDS:
            return {...state, words: []}
        case SET_PAGE_DATA:
            return {...state, pageData: action.payload}
        case SET_PAGE_NAME:
            return {...state, pageName: action.payload}
        case SET_WIDTH:
            return {...state, width: action.payload}
        default:
            return state
    }
}

export default wordsReducer