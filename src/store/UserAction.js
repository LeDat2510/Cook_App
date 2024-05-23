import { LOGIN, LOGOUT } from "./types";
import { persistor } from "./store";

export const LoginAction = (uid) => {
    return {
        type: LOGIN,
        payload: uid
    }
}

export const LogoutAction = () => {
    persistor.purge();
    return {
        type: LOGOUT,
    }
}
