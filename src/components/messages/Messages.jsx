import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";
import { Col, Row } from "antd";


const Messages = () => {
	const { messages, loading } = useGetMessages();
	useListenMessages();
	const lastMessageRef = useRef();


	useEffect(() => {
		setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100);
	}, [messages]);

	return (
		<Col span={24} className='' style={{ 
			// backgroundImage: 'url(/image_mo.png)', 
			backgroundColor: '#f0f0f0',
			 }}>
			<Col span={24} style={{
				height: 'calc(100vh - 138px)',
				overflow: 'auto',
				padding: '0 16px',
			}}>
				{!loading &&
					messages.length > 0 &&
					messages.map((message, index) => (
						<Col span={24} key={message._id} ref={index === messages.length - 1 ? lastMessageRef : null}>
							<Message message={message} />
						</Col>
					))}
				{loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
				{!loading && messages.length === 0 && (
					<p className='text-center'>Send a message to start the conversation</p>
				)}
			</Col>
		</Col>
	);

};
export default Messages;


