import USERS_SEARCH_RESULTS_ACTION_TYPES from "./users-search-result.types"

export const setUsersSearchResult = (results) => {
    return {type: USERS_SEARCH_RESULTS_ACTION_TYPES.SET_USERS_SEARCH_RESULTS, payload: results};
}