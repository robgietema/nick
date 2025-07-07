import reducers from './reducers';
import Assistant from './components/Assistant/Assistant';

const applyConfig = (config) => {
  config.addonReducers = { ...config.addonReducers, ...reducers };
  config.settings = {
    ...config.settings,
    appExtras: [
      ...config.settings.appExtras,
      {
        match: '',
        component: Assistant,
      },
    ],
  };
  return config;
};

export default applyConfig;
