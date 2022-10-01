import React, { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import ACTIONS from '../Action';
import Client from '../components/Client'
import Editor from '../components/Editor';
import { initSocket } from '../socket';

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const reactNavigator = useNavigate();
    const { roomId } = useParams();
    const [clients, setClients] = useState([]);

    useEffect(() => {

        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username
            });
            // Listening for joined event
            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                        console.log(`${username} joined`);
                    }
                    setClients(clients);
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId
                    });
                }
            );
            // Listening for disconnected
            socketRef.current.on(
                ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        )
                    })
                }
            )
        };

        init();
        return () => {

            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        }
    }, []);

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (error) {
            toast.error('Could not copy the Room ID');
        }
    }

    function leaveRoom() {
        reactNavigator('/');
    }
    // if (!location.state) {
    //     return <Navigate to="/" />;
    // }


    return (
        <div style={{ display: "grid", gridTemplateColumns: "230px 1fr" }}>
            <div className='bg-[#1c1e29] p-4 text-white flex flex-col'>
                <div style={{ flex: 1 }}>
                    <div className='rounded-sm border-solid border-[#424242] pb-2'>
                        <img
                            className="h-14"
                            src="/brand2.png"
                            alt="logo"
                        />
                    </div>

                    <h3 className='font-bold w-full mt-1 border-t-2 border-solid border-white'>Connected</h3>
                    <div className='flex items-center flex-wrap gap-5 mt-3'>
                        {clients.map((client, i) => (
                            <Client key={i}
                                username={client.username} />
                        ))}

                    </div>
                </div>
                <button className="border-2 border-solid border-white p-2 rounded text-sm font-bold cursor-pointer transition-all duration-1000 ease-in-out  w-full mt-5"
                    onClick={copyRoomId}
                >
                    Copy ROOM ID
                </button>
                <button className="border-none p-2 rounded text-sm font-bold cursor-pointer transition-all duration-1000 ease-in-out w-full mt-3 bg-[#4aed88] ml-auto hover:bg-[#2b824c]"
                    onClick={leaveRoom}
                >
                    Leave
                </button>
            </div>

            <div className='CodeMirror'>
                {/* <Editor /> */}
                <Editor

                    socketRef={socketRef}
                    roomId={roomId}
                    onCodeChange={(code) => {
                        codeRef.current = code;
                    }}
                />
            </div>
        </div>
    )
}

export default EditorPage