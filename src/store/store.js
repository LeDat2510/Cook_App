import { applyMiddleware, combineReducers, createStore } from "redux";
import AsyncStorage from '@react-native-async-storage/async-storage'
import userReducers from "./UserReducers";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
};

const rootReducer = combineReducers({
    userData: persistReducer(persistConfig, userReducers),
});

const store = createStore(rootReducer);
const persistor = persistStore(store);

export { store, persistor };

