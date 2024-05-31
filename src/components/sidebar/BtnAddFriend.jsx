import React, { useEffect, useState } from 'react';
import { EditOutlined, DownloadOutlined, SettingOutlined, PlusOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import { Button, Avatar, Card, Drawer, message } from 'antd';
import { Input, Skeleton } from 'antd';
import { APIURL } from '../../serverConfig';
import { useAuthContext } from '../../context/AuthContext';
import useGetConversations from '../../hooks/useGetConversations';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useConversation from '../../zustand/useConversation';

const { Search } = Input;
const { Meta } = Card;
const BtnAddFriend = (
    // {getConversations}
) => {
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState('left');
    const [searchValue, setSearchValue] = useState(''); // Add this line
    const [foundUser, setFoundUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const { authUser, setConversations } = useAuthContext();
    const navigate = useNavigate();
    // const { setConversations } = useConversation();

    const [messageApi, contextHolder] = message.useMessage();

    const success = (mess) => {
        messageApi.open({
            type: 'success',
            content: mess
        });
    };

    const error = (mess) => {
        messageApi.open({
            type: 'error',
            content: mess,
        });
    };

    const warning = (mess) => {
        messageApi.open({
            type: 'warning',
            content: mess
        });
    };


    useEffect(() => {
        if (searchValue) {
            getFoundUser();
        }
    }, [searchValue]);

    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const onChange = (e) => {
        setPlacement(e.target.value);
    };
    const onSearch = (value, _e, info) => {
        console.log(info?.source, value);
        setSearchValue(value);
    };

    // tức là createConversation phía server
    const addFriend = async () => {
        setLoading(true);
        try {
            console.log(foundUser._id, authUser._id)
            const res = await fetch(`${APIURL}/api/conversations/creact/${foundUser._id}/${authUser._id}/`, {
                method: 'POST',
            });
            const data = await res.json();
            console.log(data);
            setOpen(false);
            success('Add Friend Success');
            if (data.error) {
                throw new Error(data.error);
            }
            // getConversations();
        } catch (error) {
            console.error(error.message)
        } finally {
            setLoading(false);
        }

        try {
            const res = await fetch(`${APIURL}/api/conversations/get/${authUser._id}`);
            const data = await res.json();
            console.log(data);
            if (data.error) {
                throw new Error(data.error);
            }
            setConversations(data);
    // Cập nhật conversationsFiltered khi lấy dữ liệu ban đầu
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };
    const getFoundUser = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${APIURL}/api/users/getByUsername/${searchValue}`);
            const data = await res.json();
            console.log(data);
            if (data.error) {
                throw new Error(data.error);
            }
            setFoundUser(data);
        } catch (error) {
            console.error(error.message)
            // warning('Pepole not found')
        } finally {
            setLoading(false);
        }
    };



    return (
        <>
            {contextHolder}
            <FloatButton.Group
                trigger="click"
                type="primary"
                style={{
                    left: 24,
                }}
                icon={<PlusOutlined />}
            >
                <FloatButton />
                <FloatButton icon={<PlusOutlined />} onClick={showDrawer} />
            </FloatButton.Group>

            <Drawer
                title="Add Friends"
                onClose={onClose}
                open={open}
                placement={placement}
            >
                <Search
                    placeholder="input search text"
                    allowClear
                    enterButton="Search"
                    size="large"
                    onSearch={onSearch}
                    style={{ marginBottom: '20px' }}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                {!foundUser && <Skeleton
                    avatar
                    paragraph={{
                        rows: 4,
                    }}
                />}

                {foundUser && <Card
                    style={{
                        width: 320,
                    }}
                    cover={
                        <Avatar size={320} src={<img src={foundUser.profilePic} alt="avatar" />} />
                    }
                    actions={[
                        // <SettingOutlined key="setting" />,
                        <Button
                            type="dashed"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>,
                        
                            <Button
                                type="primary"
                                shape="round"
                                icon={<PlusOutlined />}
                                size={50}
                                onClick={() => { addFriend() }}>
                                Add
                            </Button>
                        

                    ]}
                >
                    <Meta
                        // avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                        title={foundUser.username}
                        description={foundUser._id}
                    />
                </Card>}

            </Drawer>
        </>
    );
}


export default BtnAddFriend;