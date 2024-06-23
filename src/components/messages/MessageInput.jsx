import { useState, useEffect } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import { MoreOutlined, FileImageOutlined, SendOutlined, BulbOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { message as mess, Tooltip, Button, Dropdown, Image, Upload, Row, Col, Modal } from 'antd';
import { storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { CohereClient } from "cohere-ai";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { setKey, fromLatLng } from "react-geocode";

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const MessageInput = () => {
    const [message, setMessage] = useState("");
    const { loading, sendMessage } = useSendMessage();
    const [file, setFile] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);
    const [loadingAI, setLoadingAI] = useState(false);
    const [messageApi, contextHolder] = mess.useMessage();

    //maps
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [currentLocation, setCurrentLocation] = useState({ lat: -34.397, lng: 150.644 });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentLocation({ lat: latitude, lng: longitude });
                setSelectedLocation({ latitude, longitude });
            },
            (error) => {
                console.error("Error getting current location:", error);
                message.error('Unable to retrieve current location. Please check your network and enable location services.');
            },
            console.log("Current location:", currentLocation)
        );
    }, []);

    const handleGetLocation = () => {
        setIsMapModalOpen(true);
    };

    const handleMapClick = (event) => {
        const { latLng } = event;
        const latitude = latLng.lat();
        const longitude = latLng.lng();
        setSelectedLocation({ latitude, longitude });
    };

    const handleLocationSelect = async () => {
        if (selectedLocation) {
            const { latitude, longitude } = selectedLocation;
            try {
                setKey("AIzaSyCvaT5cyLq55PU2EFgSv7UTg9mnF-S9mrw");
                const response = await fromLatLng(latitude, longitude); 
                const address = response.results[0].formatted_address;
                const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
                await sendMessage(googleMapsLink); 
                setIsMapModalOpen(false);
                setSelectedLocation(null);
            } catch (error) {
                console.error("Lỗi khi lấy địa chỉ", error);
                message.error('Kiểm tra kết nối internet của bạn');
            }
        }
    };
    //end maps

    const success = (mess) => {
        messageApi.open({
            type: 'success',
            content: mess,
        });
    };
    const warning = (mess) => {
        messageApi.open({
          type: 'warning',
          content: mess,
        });
      };
    const cohere = new CohereClient({
        token: 'RbwbP0Gf2QTNtv5XtmAPL8uki4wp8Ot36uIfB9mL',
    });

    const handleGenerateMessage = async () => {
        setLoadingAI(true);
        if (!message) {
            warning('Please enter a message');
            setLoadingAI(false);
            return;
        }
        const promt = "Viết 50 từ về " + message;
        try {
            const response = await cohere.chat({
                message: promt,
            });
            // const data = response.body.generations[0].text;
            console.log(response.text);
            // Cập nhật nội dung tin nhắn
            setMessage(message + " AI: '" + response.text + "'");
        } catch (error) {
            console.error("Error generating message:", error);
            // Xử lý lỗi và hiển thị thông báo cho người dùng
        } finally {
            setLoadingAI(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message) {
            warning('Please enter a message');
            return;
        } 
        await sendMessage(message);
        setMessage("");
    };

    const handleImageUpload = (file) => {
        setFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            // Set the uploaded image to the img element
            const img = document.getElementById('uploaded-image');
            img.src = reader.result;
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };
    const handleSendImage = async () => {
        
        try {
            let imageUrl = "img"
            if (file) {
                // Upload image to Firebase Storage
                const storageRef = ref(storage, `ImageMessages/${file.name}`);
                await uploadBytesResumable(storageRef, file);
                // Get download URL of the uploaded image
                imageUrl = await getDownloadURL(storageRef);
                setMessage(imageUrl);
                sendMessage(imageUrl);
                setFileList([])
                setPreviewImage('')
                setFile(null)
                console.log("Downloading image", imageUrl);
                setMessage("");
            } else {
                console.log("File not found", file);
            }
        } catch (e) {
            console.error(e);
        }
    }

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };
    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);

        // Check if a file is selected 
        // if (newFileList.length > 0) {
        //     const file = newFileList[0];
        //     setFile(file);
        //     console.log(file)
        //     const reader = new FileReader();
        //     reader.onloadend = () => {
        //         setPreviewImage(reader.result);
        //     };
        //     reader.readAsDataURL(file.originFileObj);
        // } else {
        //     // Handle the case where no file is selected
        //     setFile(null);
        //     setPreviewImage('');
        // }
    };
    const sendImage = (
        <Button
            style={{ margin: 'auto 10px auto 10px' }}
            type="primary" shape="circle"
            icon={<SendOutlined />}
            onClick={() => handleSendImage()}
            size={30} />
    );
    const items = [
        {
            key: '1',
            label: (
                <Upload
                    // listType="picture-card"
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    onPreview={handlePreview}
                    onChange={handleChange}
                    style={{ width: '100px', height: '30px' }}
                    beforeUpload={(file) => handleImageUpload(file)}
                >
                    <Button style={{ width: '100px' }} type="dashed" icon={<FileImageOutlined />}>
                        Image
                    </Button>
                </Upload>

            ),
        },
        {
            key: '2',
            label: (
                <Button style={{ width: '100px' }} type="dashed" icon={<EnvironmentOutlined />} onClick={handleGetLocation}>
                    Location
                </Button>
            ),
        },
        {
            key: '3',
            label: (
                <Button style={{ width: '100px' }} type="dashed" icon={<FileImageOutlined />}>
                    File
                </Button>
            ),
        },
    ];



    return (
        
        <Col span={24}>
            {contextHolder}
            {fileList.length == 0 ? null :
                <Row style={{ position: 'absolute', bottom: '70px', margin: '20px', padding: '10px', borderRadius: '10px', backgroundColor: '#ffffff' }}>
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                    >
                        {/* {fileList.length == 0 ? null : sendImage} */}
                    </Upload>

                    {fileList.length == 0 ? null : sendImage}
                    {previewImage && (
                        <Image
                            wrapperStyle={{
                                display: 'none',
                            }}
                            preview={{
                                visible: previewOpen,
                                onVisibleChange: (visible) => setPreviewOpen(visible),
                                afterOpenChange: (visible) => !visible && setPreviewImage(''),
                            }}
                            src={previewImage}
                        />
                    )}
                </Row>
            }


            <form className='p-4 flex' onSubmit={handleSubmit} style={inputStyle}>
                <div className='w-full relative flex-grow'>
                    <div style={containerStyle}>
                        <Dropdown
                            menu={{
                                items,
                            }}
                            placement="topLeft"
                        >
                            <Button type="dashed" shape="circle" icon={<MoreOutlined />} style={{ marginRight: '10px' }} />
                        </Dropdown>
                        <input
                            type='text'
                            style={{ background: '#F7F8FC', paddingLeft: '30px', color: 'black', height: '40px' }} // Add padding left to avoid overlap with the icon
                            className='border text-sm rounded-lg block w-full p-2.5 border-gray-300 text-white'
                            placeholder='Send a message'
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                    <Tooltip placement="topLeft" title="Generate message">
                        <button onClick={() => handleGenerateMessage()} type='button' className='absolute inset-y-0 end-0 flex items-center pe-3 '>
                            {loadingAI ? <div className='loading loading-spinner'></div> :
                                // <span role='img' aria-label='emoji'>😀</span>
                                <BulbOutlined />
                            }
                        </button>
                    </Tooltip>
                </div>
                <Tooltip placement="topLeft" title="Send message">
                    <button type='submit' className='flex items-center justify-center' style={sendButton}>
                        {loading ? <div className='loading loading-spinner'></div> : <BsSend />}
                    </button>
                </Tooltip>
            </form>
            <Modal
                title="Chọn vị trí"
                visible={isMapModalOpen}
                onOk={handleLocationSelect}
                onCancel={() => setIsMapModalOpen(false)}
                okText="Gửi"
                cancelText="Hủy"
            >
                <LoadScript googleMapsApiKey="AIzaSyBCrF5aGBr8-e1xIgutAaw3qndzJmmNq4s">
                    <GoogleMap
                        mapContainerStyle={{ height: "400px", width: "100%" }}
                        center={currentLocation}
                        zoom={15} 
                        onClick={handleMapClick}
                    >
                        {selectedLocation && (
                            <Marker
                                position={{
                                    lat: selectedLocation.latitude,
                                    lng: selectedLocation.longitude,
                                }}
                            />
                        )}
                    </GoogleMap>
                </LoadScript>
            </Modal>
        </Col>
    );
};
export default MessageInput;

const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};


const inputStyle = {
    width: "100%",
    backgroundColor: "#f7f8fc",
};
const sendButton = {
    background: '#0462C4',
    color: '#fff',
    borderRadius: 10,
    width: 40,
    height: 40,
    marginLeft: '10px',
};
