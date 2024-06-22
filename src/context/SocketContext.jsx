import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";
import { APIURL } from "../serverConfig";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [conversations, setConversations] = useState([]);
	const [callerId, setCallerId] = useState(null);
	const { authUser } = useAuthContext();

	useEffect(() => {
		if (authUser) {
			console.log("Url api: ", APIURL);
			// const socket = io("http://localhost:4600", {
			const socket = io(APIURL, {
				query: {
					userId: localStorage.getItem("chat-user") ? JSON.parse(localStorage.getItem("chat-user"))._id : authUser._id,
				}
			});

			setSocket(socket);

			// socket.on() is used to listen to the events. can be used both on client and server side
			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			// video call 
			socket.on('incomingCall', ({ callerId, conversationId }) => { // Xử lý sự kiện incomingCall
				// Hiển thị thông báo gọi đến
				// ...
				setCallerId(callerId);
			});

			return () => {
				socket.close();
			}
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser]);

	return <SocketContext.Provider value={{ socket, onlineUsers, callerId }}>{children}</SocketContext.Provider>;
};