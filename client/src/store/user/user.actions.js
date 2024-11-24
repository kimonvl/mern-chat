import USER_ACTION_TYPES from "./user.types";

export const setUsername = (username) => {
    return {type: USER_ACTION_TYPES.SET_USERNAME, payload: username};
}

export const setUserId = (userId) => {
    return {type: USER_ACTION_TYPES.SET_USERID, payload: userId};
}