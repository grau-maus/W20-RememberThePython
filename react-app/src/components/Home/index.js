import React, { useEffect } from "react";

import "./Home.css";

const Home = ({ listLoaded }) => {
	if (listLoaded) document.querySelector("#sideNav-tab-home").click();

	return <></>;
};

export default Home;
