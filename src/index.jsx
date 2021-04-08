import React from "react"
import { render } from "react-dom"
import { Provider, ReactReduxContext } from 'react-redux'
// import { addLocaleData } from 'react-intl'
import configureStore, { history } from "./store"
import rootSaga from "./sagas"
import App from './containers/App'

// import './img/favicon.ico'
import InstallFontAwesome from './lib/icon'


if (!Intl.PluralRules) {
    require('@formatjs/intl-pluralrules/polyfill')
    require('@formatjs/intl-pluralrules/locale-data/en')
    require('@formatjs/intl-pluralrules/locale-data/zh')
}

if (!Intl.RelativeTimeFormat) {
    require('@formatjs/intl-relativetimeformat/polyfill')
    require('@formatjs/intl-relativetimeformat/locale-data/en')
    require('@formatjs/intl-relativetimeformat/locale-data/zh')
}

InstallFontAwesome();

const store = configureStore();
// start saga
store.runSaga(rootSaga);
// install icon
// InstallFontAwesome();
// install language pack
// addLocaleData([...locale_en, ...locale_zh,])

const rootElement = document.getElementById("root");



render(
    <Provider store={store} context={ReactReduxContext}>
        <App history={history} />
    </Provider>,
    rootElement
)

