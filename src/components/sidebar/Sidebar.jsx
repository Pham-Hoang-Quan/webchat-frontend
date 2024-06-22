import { Link, Route, Routes } from "react-router-dom";
import BtnAddFriend from "./BtnAddFriend";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import { FloatButton } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { useAuthContext } from "../../context/AuthContext";
import VideoCall from "../callvideo/VideoCall";
const Sidebar = ({ setShowSidebar, setUser, users }) => {
    const [search, setSearch] = useState("");
    const { authUser } = useAuthContext();

    const sidebarStyle = {
        backgroundColor: '#F7F8FC',
        height: '100%',
    };

    const [showVideoCall, setShowVideoCall] = useState(false);
    // ...

    const handleStartVideoCall = (conversation) => {
        setSelectedConversation(conversation);
        setShowVideoCall(true);
    };
    return (
        <div style={sidebarStyle} className='border-r p-4 flex flex-col overflow-auto'>
            <div className="flex justify-between items-center">
                <span style={{ color: '#5F6F52' }} className=" text-3xl font-semibold p-2">{authUser.fullName}</span>
                <LogoutButton />
            </div>
            <Conversations />
            {showVideoCall && <VideoCall selectedConversation={selectedConversation} closeVideoCall={() => setShowVideoCall(false)} />} {/* Hiển thị VideoCall component */}
        </div>


    );
};
export default Sidebar;






