import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { APIURL } from "../serverConfig";
import { useAuthContext } from "../context/AuthContext";

const useRecallMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();
	const { authUser } = useAuthContext();
	const recallMessage = async (messageID) => {
        console.log(messageID, selectedConversation._id);
		setLoading(true);
		try {
			const res = await fetch(`${APIURL}/api/messages/recall/${selectedConversation._id}/${messageID}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				// body: JSON.stringify({ message }),
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			setMessages([...messages, ]);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { recallMessage, loading };
};
export default useRecallMessage;
