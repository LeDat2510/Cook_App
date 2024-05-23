import * as React from 'react';
import RootNavigation from './src/navigations/rootNavigation';
import { Provider } from 'react-redux';
import { persistor, store } from './src/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { PaperProvider } from 'react-native-paper';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <RootNavigation />
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
