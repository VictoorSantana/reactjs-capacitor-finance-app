import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { QueryClient, QueryClientProvider } from 'react-query';

/* Routes */
import ChooseRoute from './pages/home/choose.jsx';
import DashboardRoute from './pages/home/dashboard';
/*****/

/* Helpers */
// import Auth from './utils/auth';
/*****/

// const PrivateRoute = ({ component: Component, ...rest }) => (
//   <Route
//     {...rest}
//     render={props =>
//       Auth.isValidToken() ? (
//         <Component {...props} />
//       ) : (
//         <Redirect to={{ pathname: "/", state: { from: props.location } }} />
//       )
//     }
//   />
// );


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const Routes = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={(props) => <ChooseRoute  {...props}></ChooseRoute>}></Route>
        <Route exact path="/dashboard" component={(props) => <DashboardRoute  {...props}></DashboardRoute>}></Route>
      </Switch>
    </BrowserRouter>
  </QueryClientProvider>
);
export default Routes; //end