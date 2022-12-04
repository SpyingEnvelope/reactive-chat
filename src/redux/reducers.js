import { 
    ADD_WORDS, 
    REMOVE_WORD, 
    REMOVE_ALL_WORDS, 
    SET_PAGE_DATA, 
    SET_PAGE_NAME, 
    SET_EDIT, 
    SET_TALKING, 
    SET_PAGE_LOADING, 
    SET_IMAGE_PATH, 
    SET_IMAGE_DONE,
    SET_SCREEN_WIDTH,
    SET_SCREEN_HEIGHT,
    REMOVE_PAGE_NAME,
    ADD_PAGE_NAME,
    GO_HOME
} from "./actions";

const initialState = {
    words: [],
    pageName: '',
    pageHist: [],
    pageData: [],
    width: 0,
    edit: false,
    talking: false,
    pageLoading: true,
    imgPath: '',
    imageDone: false,
    screenWidth: 0,
    screenHeight: 0
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
        case SET_EDIT:
            return {...state, edit: action.payload}
        case SET_TALKING:
            return {...state, talking: action.payload} 
        case SET_PAGE_LOADING:
            return {...state, pageLoading: action.payload}
        case SET_IMAGE_PATH:
            return {...state, imgPath: action.payload}
        case SET_IMAGE_DONE:
            return {...state, imageDone: action.payload}
        case SET_SCREEN_HEIGHT:
            return {...state, screenHeight: action.payload}
        case SET_SCREEN_WIDTH:
            return {...state, screenWidth: action.payload}
        case ADD_PAGE_NAME:
            return {...state, pageHist: [...state.pageHist, action.payload]}
        case REMOVE_PAGE_NAME:
            return {...state, pageHist: state.pageHist.filter( (_,i) => 
                i !== state.pageHist.length-1
            )}
        case GO_HOME:
            return {...state, pageHist: ['Main']}
        default:
            return state
    }
}

export default wordsReducer