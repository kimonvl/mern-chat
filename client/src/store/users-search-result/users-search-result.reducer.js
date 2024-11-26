import USERS_SEARCH_RESULTS_ACTION_TYPES from "./users-search-result.types";

const INITIAL_STATE = {
    usersSearchResult: [],
}

export const usersSearchResultReducer = (state = INITIAL_STATE, action) => {
    const {type, payload} = action;

    switch (type) {
        case USERS_SEARCH_RESULTS_ACTION_TYPES.SET_USERS_SEARCH_RESULTS:
            return {...state, usersSearchResult: payload};
    
        default:
            return state;
    }
}