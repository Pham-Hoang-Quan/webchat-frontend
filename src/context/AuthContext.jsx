import { createContext, useContext, useEffect, useState } from "react";
export const AuthContext = createContext();
import { APIURL } from "../serverConfig";

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
	return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
	const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("chat-user")) || null);
	const [conversations, setConversations] = useState([]);

	useEffect(() => {
		try {
			const getConversations = async () => {
				const res = await fetch(`${APIURL}/api/conversations/get/${authUser._id}`);
				const data = await res.json();
				const sortedConversations = data.sort((a, b) => {
					return new Date(b.updatedAt) - new Date(a.updatedAt);
				});
				if (data.error) {
					throw new Error(data.error);
				}
				setConversations(sortedConversations);
			};
			getConversations();
		} catch (error) {
			console.log(error);
		}
	}, [authUser])


	return <AuthContext.Provider value={{ authUser, setAuthUser, conversations, setConversations }}>{children}</AuthContext.Provider>;
};
