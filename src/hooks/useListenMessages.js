import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { messages, setMessages } = useConversation();
	const { selectedConversation } = useConversation();
	useEffect(() => {
		socket?.on("newMessage", (newMessage) => {
			newMessage.shouldShake = true;
			const sound = new Audio(notificationSound);
			sound.play();
			console.log("newMessage", newMessage);
			if (newMessage.conversationId == selectedConversation._id) {
				console.log("newMessage here");
				setMessages([...messages, newMessage]);
			} else {
				console.log("newMessage not here");
			}
		});
		return () => socket?.off("newMessage");
	}, [socket, setMessages, messages]);
};
export default useListenMessages;
