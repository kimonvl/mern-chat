import USER_ACTION_TYPES from "./user.types";

const INITIAL_STATE = {
    username: '',
    userId: '',
}

export const userReducer = (state = INITIAL_STATE, action) => {
    const {type, payload} = action;

    switch (type) {
        case USER_ACTION_TYPES.SET_USERNAME:
            return {
                ...state,
                username: payload
            }

        case USER_ACTION_TYPES.SET_USERID:
            return {
                ...state,
                userId: payload
            }
        default:
            return state;
    }
}