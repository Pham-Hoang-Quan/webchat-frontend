import React, { useState, useEffect } from 'react';
import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import { Col, FloatButton, Row } from 'antd';
import {PlusOutlined} from '@ant-design/icons';

import { useResponsiveContext } from '../../context/ResponsiveContext';
import { Link } from 'react-router-dom';

const Home = () => {
	const { showSidebar, setShowSidebar } = useResponsiveContext();
	useEffect(() => {
		
		console.log(showSidebar);
	});
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
		</>
	);
};
export default Home;


