import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { APIURL } from "../serverConfig";
import { useAuthContext } from "../context/AuthContext";
import useConversation from "../zustand/useConversation";
const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState([]);
	// const [conversations, setConversations] = useConversation();
	const { authUser } = useAuthContext();

	useEffect(() => {
		console.log("authUser", authUser);
		const getConversations = async () => {
			setLoading(true);
			try {
				// const res = await fetch("/api/users"); // Lấy tất cả các user từ database
				const res = await fetch(`${APIURL}/api/conversations/get/${authUser._id}`);
				const data = await res.json();
				console.log(data);
				if (data.error) {
					throw new Error(data.error);
				}
				setConversations(data);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};
		getConversations();
	}, []);
	

	return { loading, conversations };
	//conversation là mảng chứa tất cả các user từ database
};
export default useGetConversations;
