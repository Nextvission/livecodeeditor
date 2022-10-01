
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';

const Home = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [roomId, setRoomId] = useState('');


    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success('Create a new room')
    }

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('ROOM ID & username is required');
            return;
        }

        // Redirect
        navigate(`/editor/${roomId}`, {
            state: {
                username
            }
        })
    }

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    };
    // bg-ms-black
    // 1c1e29
    return (
        <div className='h-screen bg-m-black flex items-center justify-center'>
            <div className='bg-ms-black w-[400px] p-5 max-w-[90%] rounded-md' >
                <img

                    className='h-16 mb-2'
                    src="/brand2.png"
                    alt="code-link-logo"
                />
                <h4 className='mb-3 mt-0 text-white'>Create and Join ROOM</h4>
                <div className='flex flex-col'>
                    <input
                        type="text"
                        className="p-2 rounded outline-none border-none mb-3 bg-[#eee] text-sm font-bold"
                        placeholder="NAME"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        onKeyUp={handleInputEnter}
                    />
                    <input
                        // disabled='true'
                        type="text"
                        className="p-2 rounded outline-none border-none mb-3 bg-[#eee] text-sm font-bold"
                        placeholder="ROOM ID"
                        onChange={(e) => setRoomId(e.target.value)}
                        value={roomId}
                        onKeyUp={handleInputEnter}
                    />
                    <button className='border-none p-2 rounded text-sm font-bold cursor-pointer transition-all duration-1000 ease-in-out bg-[#4aed88] w-24 ml-auto hover:bg-[#2b824c]'
                        onClick={joinRoom}
                    >Join</button>
                    <span className="mt-2">
                        If you don't have an invite then create &nbsp;
                        <a
                            onClick={createNewRoom}
                            href=""
                            className="text-[#4aed88] no-underline rounded-sm border-solid border-[#4aed88] hover:text-[#368654] hover:border-[#368654]"
                        >
                            new room
                        </a>
                    </span>
                </div>

            </div>
            <footer className='fixed bottom-0'>
                <h4>
                    Built with 💛 &nbsp; by &nbsp;

                    <a href="https://enrollmind.com/"
                        className='text-[#4aee88] hover:text-[#368654] border-[#368654]'>Enrollmind.com</a>
                </h4>
            </footer>
        </div>
    )
}

export default Home