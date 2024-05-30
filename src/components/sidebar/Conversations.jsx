import { useState, useEffect } from "react";
import useGetConversations from "../../hooks/useGetConversations";
import { getRandomEmoji } from "../../utils/emojis";
import Conversation from "./Conversation";
import { useAuthContext } from "../../context/AuthContext";
import { APIURL } from "../../serverConfig";
import BtnAddFriend from "./BtnAddFriend";
import { IoSearchSharp } from "react-icons/io5";


const Conversations = () => {
	// const { loading, conversations } = useGetConversations();
	const [conversations, setConversations] = useState([]);
	const { authUser } = useAuthContext();
	const [loading, setLoading] = useState([]);
	const [search, setSearch] = useState("");
	const [conversationsFiltered, setConversationsFiltered] = useState([]);

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
			setConversationsFiltered(data); // Cập nhật conversationsFiltered khi lấy dữ liệu ban đầu
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		console.log("authUser", authUser);
		getConversations();
	}, []);

	// Filter conversations based on search input
	useEffect(() => {
		const filteredConversations = conversations.filter(conversation =>
			conversation.name.toLowerCase().includes(search.toLowerCase())
		);
		setConversationsFiltered(filteredConversations);
	}, [search, conversations]) // Add conversations to dependency array

	return (
		<div>
			<div className='' style={{
				height: 'calc(100vh - 138px)',
				overflow: 'auto',
				padding: '0 16px',
			}}>
				<form className='relative'>
					<input
						style={{ background: '#F7F8FC', paddingRight: '2.5rem' }}
						type='text'
						placeholder='Search…'
						className='input input-bordered rounded-full w-full'
						onChange={(e) => setSearch(e.target.value)}
						value={search} // Bind the value to the search state
					/>
					<button type='submit' className='text-white absolute right-0 top-1/2 transform -translate-y-1/2' style={{ background: 'transparent' }}>
						<IoSearchSharp className='w-6 h-6 outline-none' style={{ color: '#0462C4', marginRight: 15 }} />
					</button>
				</form>
				<div className='divider px-3'></div>
				{/* Display filtered conversations */}
				{conversationsFiltered.map((conversation, idx) => (
					<Conversation
						key={conversation._id}
						conversation={conversation}
						emoji={getRandomEmoji()}
						lastIdx={idx === conversationsFiltered.length - 1}
					/>
				))}
				{loading ? <span className='loading loading-spinner mx-auto'></span> : null}
				<BtnAddFriend getConversations={getConversations} ></BtnAddFriend>
			</div>
		</div>


	);
};
export default Conversations;