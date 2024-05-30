import React from 'react';
import { useState, useEffect } from 'react';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
const { Meta } = Card;

const LinkPreview = ({ url }) => {
    const [previewData, setPreviewData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetches the link preview data when the URL prop changes
        const fetchData = async () => {
            try {
                const response = await fetch(`${url}`, {
                    headers: {
                        'Accept': '*/*',
                    },
                    method: 'GET',
                });
                const data = await response.text();
                console.log(data);

                // Parsing logic to extract link preview data goes here. 
                // Example:
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const title = doc.querySelector('title')?.textContent || '';
                const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
                const image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';

                setPreviewData({ title, description, image });
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        if (url) { // Only fetch if a valid URL is provided
            fetchData();
        }
    }, [url]);

    if (loading) {
        return <div>Loading preview...</div>;
    }

    if (!previewData) {
        return <a href={url}>{url}</a>;
    }

    return (
        <div>
            {/* <h2>{previewData.title}</h2>
            <p>{previewData.description}</p>
            {previewData.image && <img src={previewData.image} alt={previewData.title} />} */}

            <Card
                style={{
                    width: 300,
                }}
                cover={
                    <img
                        alt="example"
                        src={previewData.image}
                    />
                }
                actions={[
                    <SettingOutlined key="setting" />,
                    <EditOutlined key="edit" />,
                    <EllipsisOutlined key="ellipsis" />,
                ]}
            >
                <Meta
                    avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                    title={previewData.title}
                    description={previewData.description}
                />
            </Card>
        </div>

    );
};

export default LinkPreview;