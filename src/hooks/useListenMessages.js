import { useEffect, useState } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";
import { APIURL } from "../serverConfig";
import { useAuthContext } from "../context/AuthContext";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { messages, setMessages } = useConversation();
	const { selectedConversation } = useConversation();
	
	const { authUser, setConversations } = useAuthContext();

	const getConversations = async () => {
		console.log("auth", authUser._id);
		try {
			const res = await fetch(`${APIURL}/api/conversations/get/${authUser._id}`);
			const data = await res.json();
			console.log(data);
			if (data.error) {
				throw new Error(data.error);
			}
			setConversations(data);
		} catch (error) {
			console.log(error.message);
		} finally {
		}
	};

	useEffect(() => {
		socket?.on("newMessage", (newMessage) => {
			newMessage.shouldShake = true;
			const sound = new Audio(notificationSound);
			sound.play();
			console.log("newMessage", newMessage);
			if (newMessage.conversationId == selectedConversation?._id) {
				console.log("newMessage here");
				setMessages([...messages, newMessage]);
			} else {
				console.log("newMessage not here");
			}
			getConversations();
		});
		return () => socket?.off("newMessage");

	}, [socket, setMessages, messages]);
};
export default useListenMessages;
