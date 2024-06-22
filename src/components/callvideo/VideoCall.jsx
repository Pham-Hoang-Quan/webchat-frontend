import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";
import peer from "./peer";
import ReactPlayer from "react-player";
import {
    Row, Col, Button, Typography, notification,
    Result, Tooltip, Space, Spin
} from "antd";
import { SearchOutlined } from '@ant-design/icons';
import { APIURL } from "../../serverConfig";
const { Title, Text } = Typography;

import {
    PhoneOutlined
} from '@ant-design/icons';

const VideoCall = () => {
    const { authUser } = useAuthContext();
    const { socket, callerId } = useSocketContext();
    const { conversationId } = useParams();
    const navigate = useNavigate();

    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState();
    const [remoteStream, setRemoteStream] = useState(null);
    const [isIncomingCall, setIsIncomingCall] = useState(false);
    const [started, setStarted] = useState(false);
    const [isReciever, setIsReciever] = useState(false);
    const [participants, setParticipants] = useState(null)

    const handleUserJoined = useCallback(({ email, id }) => {
        setRemoteSocketId(id);
    }, []);

    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        const offer = await peer.getOffer();
        socket.emit("user:call", { to: remoteSocketId, offer });
        setMyStream(stream);
        setStarted(true);
    }, [remoteSocketId, socket]);

    const handleIncommingCall = useCallback(
        async ({ from, offer }) => {
            setRemoteSocketId(from);
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            setMyStream(stream);
            const ans = await peer.getAnswer(offer);
            socket.emit("call:accepted", { to: from, ans });
            setIsIncomingCall(true);
        },
        [socket]
    );

    const sendStreams = useCallback(() => {
        for (const track of myStream.getTracks()) {
            peer.peer.addTrack(track, myStream);
        }
    }, [myStream]);

    const handleCallAccepted = useCallback(
        ({ from, ans }) => {
            peer.setLocalDescription(ans);
            notification.success({
                message: `Call Accepted`,
                description: `Call has been accepted.`,
            });
            sendStreams();
        },
        [sendStreams]
    );

    const handleNegoNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
    }, [remoteSocketId, socket]);

    useEffect(() => {
        if (callerId && callerId != authUser._id) {
            setIsReciever(true);
        }
    }, [socket]);

    useEffect(() => {
        const getParticipants = async () => {
            try {
                // const res = await fetch("/api/users"); // Lấy tất cả các user từ database
                const res = await fetch(`${APIURL}/api/conversations/getParticipants/${conversationId}/${authUser._id}`);
                const data = await res.json();
                console.log(data);
                if (data.error) {
                    throw new Error(data.error);
                }
                setParticipants(data);
            } catch (error) {
                console.log(error.message);
            } finally {
            }
        };
        getParticipants();
    }, []);

    useEffect(() => {
        peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
        return () => {
            peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
        };
    }, [handleNegoNeeded]);

    const handleNegoNeedIncomming = useCallback(
        async ({ from, offer }) => {
            const ans = await peer.getAnswer(offer);
            socket.emit("peer:nego:done", { to: from, ans });
        },
        [socket]
    );

    const handleNegoNeedFinal = useCallback(async ({ ans }) => {
        await peer.setLocalDescription(ans);
    }, []);

    useEffect(() => {
        socket.emit("room:join", { email: authUser._id, room: conversationId });
    }, [socket, authUser._id, conversationId]);

    useEffect(() => {
        peer.peer.addEventListener("track", async (ev) => {
            const remoteStream = ev.streams;
            setRemoteStream(remoteStream[0]);
        });
    }, []);

    useEffect(() => {
        socket.on("user:joined", handleUserJoined);
        socket.on("incomming:call", handleIncommingCall);
        socket.on("call:accepted", handleCallAccepted);
        socket.on("peer:nego:needed", handleNegoNeedIncomming);
        socket.on("peer:nego:final", handleNegoNeedFinal);

        return () => {
            socket.off("user:joined", handleUserJoined);
            socket.off("incomming:call", handleIncommingCall);
            socket.off("call:accepted", handleCallAccepted);
            socket.off("peer:nego:needed", handleNegoNeedIncomming);
            socket.off("peer:nego:final", handleNegoNeedFinal);
        };
    }, [
        socket,
        handleUserJoined,
        handleIncommingCall,
        handleCallAccepted,
        handleNegoNeedIncomming,
        handleNegoNeedFinal,
    ]);

    const initCall = useCallback(async () => {
        try {
            if (!isIncomingCall) {
                socket.emit("startCall", {
                    conversationId,
                    callerId: authUser._id,
                });
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: `Error getting media stream: ${error.message}`,
            });
        }
    }, [isIncomingCall, socket, conversationId, authUser._id]);

    useEffect(() => {
        initCall();
    }, [initCall]);

    const handleEndCall = useCallback(() => {
        if (myStream) {
            myStream.getTracks().forEach(track => track.stop());
            setMyStream(null);
        }
        if (remoteStream) {
            remoteStream.getTracks().forEach(track => track.stop());
            setRemoteStream(null);
        }
        if (peer.peer) {
            peer.peer.close();
        }
        socket.emit("call:end", { to: remoteSocketId });
        setRemoteSocketId(null);
        notification.info({
            message: "Call Ended",
            description: "The call has been ended.",
        });
        navigate("/");
    }, [myStream, remoteStream, socket, remoteSocketId, navigate]);

    return (
        <div className="video-call-container"

        >
            <Row gutter={[16, 16]} style={{
                padding: "20px", backgroundColor: "#f0f2f5",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: "100vh",
            }}>
                <Col span={24} style={{ padding: '0px' }}>
                    <Title
                        style={{
                            color: "white",
                            textAlign: "center",
                            backgroundColor: "#b3c4a5",
                            padding: "10px",
                            borderRadius: "5px",
                            marginBottom: "0px",
                        }}
                        level={2}>Video Call</Title>
                </Col>

                {myStream && <Col span={12}

                >

                    {myStream && (
                        <>
                            {/* <Title level={4}>You</Title> */}
                            <ReactPlayer
                                playing
                                muted
                                height="100%"
                                width="100%"
                                url={myStream}
                                style={{
                                    borderRadius: "5px",
                                    padding: "0px",
                                    margin: "0px",
                                }}
                            />
                        </>
                    )}
                </Col>}
                {remoteStream && <Col span={12} >
                    {remoteStream && (
                        <>
                            {/* <Title level={4}>{participants[0].fullName }</Title> */}
                            <ReactPlayer
                                playing
                                height="100%"
                                width="100%"
                                url={remoteStream}
                            />
                        </>
                    )}
                </Col>}
                <Col span={24}>

                    {(!started && !remoteStream && !isReciever) &&
                        <div style={{ backgroundColor: '#eff6b7' }}>
                            <Result
                                status="success"
                                title="Cuộc gọi Video!"
                                subTitle="Bắt đầu cuộc gọi"
                                extra={[
                                    <Button type="primary" key="console" onClick={handleCallUser}>
                                        Bắt đầu cuộc gọi với {participants && participants.map((participant) => participant.fullName).join(", ")}
                                    </Button>,
                                    <Button key="buy">Hủy bỏ</Button>,
                                ]}
                            />
                        </div>

                    }

                    {/* {(remoteSocketId && !started && !remoteStream && !isReciever) && (
                        <Button type="primary" onClick={handleCallUser} style={{ marginRight: "10px" }}>
                            Start Call
                        </Button>
                    )} */}
                    {(isReciever && !remoteStream) &&
                        <Spin tip="Loading" size="large">
                            Chờ người gọi bắt đầu...
                        </Spin>

                    }
                    <Col span={24} style={{ textAlign: "center", display: 'flex', justifyContent: 'center' }}>
                        {myStream && (
                            <Button size="large" onClick={sendStreams} style={{ marginRight: "10px" }}>
                                Share Video
                            </Button>
                        )}
                        {(myStream || remoteStream) && (
                            <Tooltip title="Kết thúc">
                                <Button size="large" type="primary" onClick={() => handleEndCall()} danger shape="circle" icon={<PhoneOutlined />} />
                            </Tooltip>
                        )}
                    </Col>



                </Col>

            </Row>
        </div>
    );
};

export default VideoCall;
