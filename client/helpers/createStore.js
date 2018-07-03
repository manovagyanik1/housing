import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import reducers from '../reducers';
import webConfig from './../../webConfig';
import { composeWithDevTools } from 'redux-devtools-extension';


export default (req) => {

    const axiosInstance = axios.create({
        baseURL: webConfig.axiosInstance_baseURL,
        headers: {
            cookie: req.get('cookie') || ''
        }
    });

    const store = createStore(
        reducers, 
        {},
        composeWithDevTools(applyMiddleware(thunk.withExtraArgument(axiosInstance))
    ));
    return store;
};