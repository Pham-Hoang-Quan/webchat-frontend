import React, { useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Table, Button, Spin, Row, Col, Card, Avatar } from 'antd';
import {
    UserOutlined,
    LaptopOutlined,
    LogoutOutlined,
    InfoCircleOutlined,
    LockOutlined,
    UnlockOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import useGetAllUsers from '../../hooks/useGetAllUsers';
import useBlockUser from '../../hooks/useBlockUser';
import useGetBlockedUsers from '../../hooks/useGetBlockUsers';
import useUnBlockUser from '../../hooks/useUnBlockUser';
import useStatic from '../../hooks/useStatic';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import useLogout from '../../hooks/useLogout';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

const { Header, Content, Sider } = Layout;

const Admin = () => {
    const [selectedOption, setSelectedOption] = useState('1'); // Lưu tab đang chọn
    const { users, loading, error, refreshUsers } = useGetAllUsers(); //isBlocked = false
    const { blockUser, userBlock } = useBlockUser();
    const { blockedUsers, refreshBlockedUsers } = useGetBlockedUsers(); //isBlocked
    const { userUnBlock, unBlockUser } = useUnBlockUser(); //unBlock user
    const { chartData, chartLoading, chartError, chartBlockedUserData, chartConversationData } = useStatic(); // Fetch chart data
    const { logout } = useLogout();
    const navigate = useNavigate();
    const { authUser } = useAuthContext();
    const [currentPage, setCurrentPage] = useState(1);

    const handleMenuClick = (e) => {
        setSelectedOption(e.key);
    };

    const renderUsersContent = () => {
        const columns = [
            {
                title: 'ID',
                dataIndex: '_id',
                key: 'id',
                width: 100, // Thiết lập chiều rộng cột ID
            },
            {
                title: 'Tên',
                dataIndex: 'username',
                key: 'name',
                sorter: (a, b) => a.username.localeCompare(b.username),
                width: 200, // Thiết lập chiều rộng cột Tên
            },
            {
                title: 'Ngày tạo',
                dataIndex: 'createdAt',
                key: 'createdAt',
                sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
                render: (text) => (
                    text ? new Date(text).toLocaleDateString() : '-'
                ),
                width: 150, // Thiết lập chiều rộng cột Ngày tạo
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <Button type="primary" onClick={() => handleBlock(record)}>
                            <LockOutlined />
                        </Button>
                    </span>
                ),
                width: 100, // Thiết lập chiều rộng cột Action
            },
        ];

        if (loading) {
            return <Spin tip="Đang tải dữ liệu..." />;
        }

        if (error) {
            return <div>Có lỗi xảy ra: {error.message}</div>;
        }
        return (
            <div>
                <Table
                    columns={columns}
                    dataSource={users}
                    style={{ tableLayout: 'fixed' }}
                    pagination={{
                        current: currentPage, // Sử dụng state currentPage cho phân trang
                        onChange: (page) => setCurrentPage(page), // Cập nhật state currentPage khi đổi trang
                    }}
                />
            </div>
        );
    };

    const renderUsersBlocked = () => {
        const columns = [
            {
                title: 'ID',
                dataIndex: '_id',
                key: 'id',
                width: 100,
            },
            {
                title: 'Tên',
                dataIndex: 'username',
                key: 'name',
                sorter: (a, b) => a.username.localeCompare(b.username), // Sắp xếp theo tên
                width: 200,
            },
            {
                title: 'Ngày tạo',
                dataIndex: 'createdAt',
                key: 'createdAt',
                sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt), // Sắp xếp theo ngày tạo
                render: (text) => (
                    text ? new Date(text).toLocaleDateString() : '-'
                ),
                width: 150,
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <Button type="primary" onClick={() => handleUnBlock(record)}>
                            <UnlockOutlined />
                        </Button>
                    </span>
                ),
                width: 100,
            },
        ];

        if (loading) {
            return <Spin tip="Đang tải dữ liệu..." />;
        }

        if (error) {
            return <div>Có lỗi xảy ra: {error.message}</div>;
        }

        return (
            <div>
                <Table
                    columns={columns}
                    dataSource={blockedUsers}
                    style={{ tableLayout: 'fixed' }}
                />
            </div>
        );
    };

    const renderHome = () => {
        if (chartLoading) return <Spin tip="Đang tải biểu đồ..." />;
        if (chartError) return <div>Có lỗi xảy ra: {chartError.message}</div>;

        // Chuẩn bị dữ liệu cho biểu đồ 1
        const chartDataFormatted = chartData.map(item => ({
            name: item.date,
            "Số lượng người dùng": item.count
        }));

        // Chuẩn bị dữ liệu cho biểu đồ 2
        const blockedUserDataFormatted = chartBlockedUserData.map(item => ({
            name: item.month,
            "Số lượng người dùng bị chặn": item.count
        }));

        const shortenId = (id) => {
            return id.substring(0, 5);
        };
        // Chuẩn bị dữ liệu cho biểu đồ 3
        const coversationDataFormatted = chartConversationData.map(item => ({
            name: shortenId(item._id),
            "Tổng số tin nhắn": item.totalMessages
        }));

        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {/* Biểu đồ thống kê số lượng người dùng đăng ký hàng tháng */}
                    <div style={{ backgroundColor: '#ffff', padding: '15px', borderRadius: '8px', marginRight: '20px', marginBottom: 15 }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <h2 style={{ marginBottom: '10px' }}>Biểu đồ thống kê số lượng người dùng đăng ký hàng tháng</h2>
                            <div>
                                <BarChart width={400} height={250} data={chartDataFormatted} margin={{ top: 20, right: 30, left: -30, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#d6d6d6d6" />
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <Tooltip />
                                    <Legend wrapperStyle={{ fontSize: '14px' }} />
                                    <Bar dataKey="Số lượng người dùng" fill="#8884d8" barSize={30} />
                                </BarChart>
                            </div>
                        </div>
                    </div>

                    {/* Biểu đồ thống kê số lượng người dùng bị chặn */}
                    <div style={{ backgroundColor: '#ffff', padding: '15px', borderRadius: '8px', marginBottom: 15 }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <h2 style={{ marginBottom: '10px' }}>Biểu đồ thống kê số lượng người dùng bị chặn</h2>
                            <div key="blocked-chart">
                                <BarChart width={400} height={250} data={blockedUserDataFormatted} margin={{ top: 20, right: 30, left: -30, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#d6d6d6d6" />
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <Tooltip />
                                    <Legend wrapperStyle={{ fontSize: '14px' }} />
                                    <Bar dataKey="Số lượng người dùng bị chặn" fill="#82ca9d" barSize={30} /> {/* Sử dụng màu khác cho biểu đồ 2 */}
                                </BarChart>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {/* Biểu đồ thống kê số lượng tin nhắn nhiều nhất */}
                    <div style={{ backgroundColor: '#ffff', padding: '15px', borderRadius: '8px', marginRight: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <h2 style={{ marginBottom: '10px' }}>Biểu đồ thống kê tin nhắn</h2>
                            <div key="blocked-chart">
                                <BarChart width={400} height={250} data={coversationDataFormatted} margin={{ top: 20, right: 30, left: -30, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#d6d6d6d6" />
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <Tooltip />
                                    <Legend wrapperStyle={{ fontSize: '14px' }} />
                                    <Bar dataKey="Tổng số tin nhắn" fill="#58ca9d" barSize={30} /> {/* Sử dụng màu khác cho biểu đồ 2 */}
                                </BarChart>
                            </div>
                        </div>
                    </div>
                    <div style={{ backgroundColor: '#ffff', padding: '15px', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <h2 style={{ marginBottom: '10px' }}>Biểu đồ thống kê số lượng người dùng bị chặn</h2>
                            <div key="blocked-chart">
                                <BarChart width={400} height={250} data={coversationDataFormatted} margin={{ top: 20, right: 30, left: -30, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#d6d6d6d6" />
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <Tooltip />
                                    <Legend wrapperStyle={{ fontSize: '14px' }} />
                                    <Bar dataKey="Tổng số tin nhắn" fill="#58ca9d" barSize={30} /> {/* Sử dụng màu khác cho biểu đồ 2 */}
                                </BarChart>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (selectedOption) {
            case '1':
                return renderHome();
            case '2':
                return renderUsersContent();
            case '3':
                return renderUsersBlocked();
            default:
                return null;
        }
    };

    const handleBlock = async (record) => {
        try {
          await blockUser(record._id);
          console.log('User blocked successfully');
          refreshUsers();
          refreshBlockedUsers();
          setCurrentPage((prevPage) => prevPage);
        } catch (error) {
          console.error('Error blocking user:', error);
        }
      };

    const handleUnBlock = async (record) => {
        try {
            await unBlockUser(record._id);
            console.log('User unblocked successfully:');
            refreshUsers();
            refreshBlockedUsers();
        } catch (error) {
            console.error('Error unblocking user:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        console.log('Đăng xuất');
    };

    return (
        <Layout>
            <Layout>
                <Sider width={280} className="site-layout-background">
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{ height: '100%', borderRight: 0 }}
                        onClick={handleMenuClick}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                            <Avatar size={64} icon={<UserOutlined />} />
                            <span style={{ marginLeft: '10px', fontSize: '18px', fontWeight: 'bold' }}>{authUser.fullName}</span>
                        </div>
                        <Menu.Item key="1" icon={<HomeOutlined
                        />}>
                            Trang chủ
                        </Menu.Item>
                        <Menu.Item key="2" icon={<UserOutlined />}>
                            Danh sách người dùng
                        </Menu.Item>
                        <Menu.Item key="3" icon={<InfoCircleOutlined />}>
                            Danh sách người dùng bị chặn
                        </Menu.Item>
                        <Button type="primary" onClick={handleLogout} style={{ float: 'right', marginRight: 20, marginTop: 15 }}>
                            <span style={{ marginLeft: 5 }}>Đăng xuất</span>
                        </Button>
                    </Menu>
                </Sider>
                <Layout style={{ padding: '0 24px 24px', marginTop: 30 }}>
                    <Content
                        className="site-layout-background"
                        style={{
                            margin: 0,
                            minHeight: '100vh',
                        }}
                    >
                        {renderContent()}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default Admin;