import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ApolloClient, ApolloProvider, createHttpLink, InMemoryCache} from "@apollo/client";
import {BD_URI} from "./config";

const client = new ApolloClient({
    uri: BD_URI,
    cache: new InMemoryCache(),
    link: process.env.NODE_ENV !== "production" ? undefined:createHttpLink({uri: '/graphql'}),
    credentials: process.env.NODE_ENV !== "production" ? undefined:'include'
})

ReactDOM.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById('root')
);


reportWebVitals();
