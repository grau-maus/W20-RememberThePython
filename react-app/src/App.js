import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UsersList from "./components/UsersList";
import User from "./components/User";
import * as sessionActions from "./store/session";
import { authenticate } from "./services/auth";

function App() {
	const [authenticated, setAuthenticated] = useState(false);
	const dispatch = useDispatch();
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		(async () => {
			const user = await authenticate();
			if (!user.errors) {
				// setAuthenticated(true);
				dispatch(sessionActions.restoreUser());
			}
			setLoaded(true);
		})();
	}, [dispatch]);

	if (!loaded) {
		return null;
	}

	return (
		<BrowserRouter>
			<Navigation />
			<Switch>
				<Route path="/login" exact={true}>
					<LoginForm authenticated={authenticated} setAuthenticated={setAuthenticated} />
				</Route>
				<Route path="/sign-up" exact={true}>
					<SignUpForm authenticated={authenticated} setAuthenticated={setAuthenticated} />
				</Route>
				<ProtectedRoute path="/users" exact={true} authenticated={authenticated}>
					<UsersList />
				</ProtectedRoute>
				<ProtectedRoute path="/users/:userId" exact={true} authenticated={authenticated}>
					<User />
				</ProtectedRoute>
				<ProtectedRoute path="/" exact={true} authenticated={authenticated}>
					<h1>My Home Page</h1>
				</ProtectedRoute>
				<Route path="/">
					<Redirect to="/" />
				</Route>
			</Switch>
		</BrowserRouter>
	);
}

export default App;
