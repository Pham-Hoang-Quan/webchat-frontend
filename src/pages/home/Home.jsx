import React, { useState, useEffect } from 'react';
import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import { Col, FloatButton, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useListenMessages from "../../hooks/useListenMessages";
import { useResponsiveContext } from '../../context/ResponsiveContext';
import { Link } from 'react-router-dom';
import { useSocketContext } from "../../context/SocketContext";
import { Button, Modal } from 'antd';
import { APIURL } from '../../serverConfig';
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const Home = () => {
	useListenMessages();
	const navigate = useNavigate();
	const { authUser } = useAuthContext();

	const [callerId, setCallerId] = useState("");
	const [caller, setCaller] = useState(null)

	const [conversationId, setConversationId] = useState("");
	const { showSidebar, setShowSidebar } = useResponsiveContext();
	const { socket } = useSocketContext();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const showModal = () => {
		setIsModalOpen(true);
	};
	const handleOk = () => {
		setIsModalOpen(false);
		navigate(`/video-call/${conversationId}`);
	};
	const handleCancel = () => {
		setIsModalOpen(false);
	};
	useEffect(() => {
		socket?.on("incomingCall", ({ callerId, conversationId }) => {
			setCallerId(callerId);
			setConversationId(conversationId);
			const getCaller = async () => {
				try {
					// const res = await fetch("/api/users"); // Lấy tất cả các user từ database
					const res = await fetch(`${APIURL}/api/conversations/getConversationById/${conversationId}/${authUser._id}`);
					const data = await res.json();
					console.log(data);
					if (data.error) {
						throw new Error(data.error);
					}
					setCaller(data);
				} catch (error) {
					console.log(error.message);
				} finally {
				}
			};
			getCaller();

			showModal();
		});
		return () => socket?.off("incomingCall");

	}, [socket, callerId, conversationId]);

	return (
		<>
			<Row style={{ height: '100vh' }}>
				<Col
					span={8}
					xs={showSidebar ? 24 : 0}
					sm={showSidebar ? 24 : 0}
					md={8} style={{ height: '100%' }}>
					<Sidebar />
				</Col>
				<Col
					span={16}
					xs={showSidebar ? 0 : 24}
					sm={showSidebar ? 0 : 24}
					md={16}
					style={{ height: '100%' }}>
					<MessageContainer />
				</Col>
			</Row>
			{/* <Button type="primary" onClick={showModal}>
				Open Modal
			</Button> */}
			<Modal title="Có cuộc gọi đến" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
				<p>{caller && caller.name} đang gọi bạn...</p>
				<Link to={`/video-call/${conversationId}`}>
					{/* <Button type="primary">Trả lời</Button> */}
				</Link>
			</Modal>

		</>
	);
};
export default Home;


