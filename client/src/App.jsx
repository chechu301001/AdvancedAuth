import React from 'react';
import { Route, Switch} from 'react-router-dom'
//Routing
import PrivateRoute from './components/routing/PrivateRoute';

//Screens
import PrivateScreen from './components/screens/PrivateScreen';
import LoginScreen from './components/screens/LoginScreen';
import RegisterScreen from './components/screens/RegisterScreen';
import ForgotPasswordScreen from './components/screens/ForgotPasswordScreen';
import ResetPasswordScreen from './components/screens/ResetPasswordScreen';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './app.css'


const App = () => {
  return (
    <>
      <Switch>
          <PrivateRoute exact path ='/private' component={PrivateScreen}/>
          <Route exact path = "/login" component={LoginScreen}/>
          <Route exact path = "/register" component={RegisterScreen}/>
          <Route exact path = "/forgotpassword" component={ForgotPasswordScreen}/>
          <Route exact path = "/passwordreset/:resetToken" component={ResetPasswordScreen}/>
      </Switch>
    </>
  );
}

export default App;
