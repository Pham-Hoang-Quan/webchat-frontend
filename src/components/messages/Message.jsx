import { Col, Row, Button, Image } from "antd";
import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";
import LinkPreview from "./LinkPreview";
import Microlink from '@microlink/react';
import { useState } from 'react';
import { DownloadOutlined, EllipsisOutlined, CopyOutlined, RollbackOutlined } from '@ant-design/icons';
import { Dropdown, message, Space, Tooltip } from 'antd';
import zIndex from "@mui/material/styles/zIndex";
import useRecallMessage from "../../hooks/useRecallMessage";
import { APIURL } from "../../serverConfig";


const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const { setMessages, selectedConversation } = useConversation();
	const fromMe = message.senderId === authUser._id;
	const formattedTime = extractTime(message.createdAt);
	const chatClassName = fromMe ? "chat-end" : "chat-start";
	const profilePic = fromMe ? authUser.profilePic : selectedConversation?.img;
	const bubbleBgColor = fromMe ? "bg-[#5F6F52]" : "bg-white";
	const textColor = fromMe ? "text-white" : "text-black";
	const shakeClass = message.shouldShake ? "shake" : "";
	const [loading, setLoading] = useState(false);

	const [showOptions, setShowOptions] = useState(false);

	// const { recallMessage, loading } = useRecallMessage();
	// Handle mouse events to show/hide the download button
	const handleMouseOver = () => {
		setShowOptions(true);
	};

	const handleMouseOut = () => {
		setShowOptions(false);
	};

	const handleDownload = (url) => {
		// Tạo một a-tag ẩn để kích hoạt tải xuống
		const link = document.createElement('a');
		link.href = url;
		link.download = 'image.jpg'; // Tên tệp tải xuống
		link.click();
	};

	const recallMessage = async (messageID) => {
		console.log(messageID, selectedConversation._id);
		setLoading(true);
		try {
			const res = await fetch(`${APIURL}/api/messages/recallMessage/${selectedConversation._id}/${messageID}`, {
				method: "PUT",
				// headers: {
				// 	"Content-Type": "application/json",
				// },
				// body: JSON.stringify({ message }),
			});
			const data = await res.json();
			console.log(data);
			if (data.error) throw new Error(data.error);
			try {
				const res = await fetch(`${APIURL}/api/messages/${selectedConversation._id}`);
				const data = await res.json();
				if (data.error) throw new Error(data.error);
				setMessages(data);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		} catch (error) {
			console.log(error.message);
		} finally {
			setLoading(false);
		}
	};

	const items = [
		{
			key: '1',
			label: (
				message.message.includes("firebasestorage.googleapis.com")
					?
					<Tooltip title="Download Image">
						<Button onClick={() => { handleDownload(message.message) }} icon={<DownloadOutlined />} /> {/* Correctly attach onClick here */}
					</Tooltip>
					:
					<Tooltip title="Copy message">
						<Button icon={<CopyOutlined />} />
					</Tooltip>
			),
		},
		{
			key: '2',
			label: (
				<a onClick={() => { recallMessage(message._id) }} title="Recall">
					<Button icon={<RollbackOutlined />} title="Recall" />
				</a>
			),
		},
		// {
		// 	key: '3',
		// 	label: (
		// 		<a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
		// 			Download
		// 		</a>
		// 	),
		// },
	];
	return (
		<Row className={`chat ${chatClassName}`} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} >

			<Col className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img alt='Tailwind CSS chat bubble component' src={profilePic} />
				</div>
			</Col>
			<Col
				className={`chat-bubble ${textColor} ${bubbleBgColor} ${shakeClass} `}
				style={{ boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)' }}
			>
				{/* message.message */}
				{message.message.includes("firebasestorage.googleapis.com") ? (
					<>
						<Image
							width={200}
							src={message.message}
							style={{ borderRadius: '10px' }}
						/>
					</>
				) : (
					message.message.includes("http") ? (
						<Microlink url={message.message} />
					) : (
						message.status=="recall" ? (
							<p color="gray">Tin nhắn đã được thu hồi</p>
						) : (
							<p>{message.message}</p>
						)
					)
				)}

				{showOptions &&
					<Dropdown
						menu={{
							items,
						}}
						style={{}}
						placement="top"
					>
						<Button style={{
							position: 'absolute',
							right: fromMe ? '105%' : '-45px',
							bottom: '0',
							zIndex: '100'

						}}
							icon={<EllipsisOutlined />} >

						</Button>
					</Dropdown>
				}
			</Col>



			<Col className='chat-footer opacity-80 text-xs flex gap-1 items-center'>{formattedTime}

			</Col>
		</Row>
	);
};
export default Message;