import reducers from './reducers';

const applyConfig = (config) => {
  config.addonReducers = { ...config.addonReducers, ...reducers };
  return config;
};

export default applyConfig;
