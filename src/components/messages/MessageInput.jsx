import { useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import { MoreOutlined, FileImageOutlined, SendOutlined } from '@ant-design/icons';
import { FloatButton, Button, Dropdown, Image, Upload, Row, Col } from 'antd';
import { storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

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
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message) return;
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
                    beforeUpload={(file) =>handleImageUpload(file)}
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
                <Button style={{ width: '100px' }} type="dashed" icon={<FileImageOutlined />}>
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
                            style={{ background: '#F7F8FC', paddingLeft: '30px', color: 'black' }} // Add padding left to avoid overlap with the icon
                            className='border text-sm rounded-lg block w-full p-2.5 border-gray-300 text-white'
                            placeholder='Send a message'
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                    <button type='button' className='absolute inset-y-0 end-0 flex items-center pe-3'>
                        <span role='img' aria-label='emoji'>😀</span>
                    </button>
                </div>
                <button type='submit' className='flex items-center justify-center' style={sendButton}>
                    {loading ? <div className='loading loading-spinner'></div> : <BsSend />}
                </button>
            </form>
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
