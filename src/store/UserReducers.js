import { LOGIN, LOGOUT } from "./types";

const initialState = {
    uid: null
}

const userReducers = (state = initialState, action) => {
    switch (action.type){
        case LOGIN:
            return {
                ...state,
                uid: action.payload,
            };
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
}

export default userReducers;