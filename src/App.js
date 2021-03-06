import React, { Component } from 'react'
import { connect } from 'react-redux'

import Page from 'components/Page'
import Form from 'components/Form'

import * as authActions from 'redux/actions/auth'

import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    /**
     * sessionStorage is internet browser's feature which stores data
     * until the browser tab is closed.
     */
    const walletFromSession = sessionStorage.getItem('walletInstance')
    const { integrateWallet, removeWallet } = this.props

    if (walletFromSession) {
      try {
        /**
         * 1. If 'walletInstance' value exists,
         * add it to caver's wallet and it's information to store
         * cf) redux/actions/auth.js -> integrateWallet()
         */
        integrateWallet(JSON.parse(walletFromSession).privateKey)
      } catch (e) {
        /**
         * 2. If value in sessionStorage is invalid wallet instance,
         * remove it from caver's wallet and it's information from store
         * cf) redux/actions/auth.js -> removeWallet()
         */
        removeWallet()
      }
    }
  }
  /**
   * 3. Whether walletInstance is exist in the session storage,
   * Redux will initialize state(isLoggedIn) of our app.
   * Let's render the page, depending on if user is logged in or not
   */
  render() {
    const { isLoggedIn } = this.props
    return (
      <div className="App">

        {isLoggedIn ?<Page /> : <Form />}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
})

const mapDispatchToProps = (dispatch) => ({
  integrateWallet: (privateKey) => dispatch(authActions.integrateWallet(privateKey)),
  removeWallet: () => dispatch(authActions.removeWallet()),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
