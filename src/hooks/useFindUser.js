import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { APIURL } from "../serverConfig";
import { useAuthContext } from "../context/AuthContext";
const useFindUser = (username) => {
	const [loading, setLoading] = useState(false);
	const [foundUser, setFoundUser] = useState([]);
	const { authUser } = useAuthContext();

	useEffect(() => {
        console.log("username" + username);
		const getFoundUser = async () => {
			setLoading(true);
			try {
				const res = await fetch(`${APIURL}/api/users/getByUsername/${username}`);
				const data = await res.json();
				console.log(data);
				if (data.error) {
					throw new Error(data.error);
				}
				setFoundUser(data);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		getFoundUser();
	}, []);
	

	return { loading, foundUser };
	//conversation là mảng chứa tất cả các user từ database
};
export default useFindUser;
