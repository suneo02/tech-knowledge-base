import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
// import md5 from 'js-md5';
import store from './store/store'
import App from './App'

// React.Component.prototype.$md5 = md5;

ReactDOM.render(
  <Provider store={store}>
    <App defalutRoute={'group'} />
  </Provider>,
  document.getElementById('root')
)
