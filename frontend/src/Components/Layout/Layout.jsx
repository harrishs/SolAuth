// import Auth from "../Auth/Auth";
import NavBar from "./NavBar/NavBar";
import Dashboard from "../Dashboard/Dashboard";

const Layout = (props) => {
	return (
		<>
			<NavBar />
			{/* <Auth /> */}
			<Dashboard />
		</>
	);
};

export default Layout;
