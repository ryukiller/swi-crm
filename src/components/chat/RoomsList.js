'use state'
import { MessagesSquare } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";



const RoomsList = ({ token, currentChat }) => {

    const roomsOld = [
        {
            name: 'SWI',
            avatar: '/imgs/logo-dark.png',
        },
        {
            name: 'WEB',
            avatar: '/imgs/logo-dark.png',
        },
        {
            name: 'SOCIAL',
            avatar: '/imgs/logo-dark.png',
        },
        {
            name: 'UFFICIO VENDITE',
            avatar: '/imgs/logo-dark.png',
        },
        {
            name: 'AMMINISTRAZIONE',
            avatar: '/imgs/logo-dark.png',
        }
    ]

    const [chatChange, setChatChange] = useState();

    useEffect(() => {
        currentChat(chatChange);
    }, [chatChange]);

    const handleChange = (chat) => {
        setChatChange(chat);
    };

    const [rooms, setRooms] = useState(roomsOld)

    const fetchRooms = async () => {
        try {
            const res = await fetch(`/api/chat/get-rooms`, {
                method: "GET",
                headers: {
                    authorization: `bearer ${token}`,
                },
            });

            if (!res.ok) {
                console.error("Failed to fetch users");
                return;
            }

            const data = await res.json();
            setRooms(data);
        } catch (error) {
            console.error("An error occurred while fetching users:", error);
        }
    };

    useEffect(() => {
        fetchRooms()
    }, [])


    return (
        <ul role="list" className="divide-y divide-gray-100">
            {rooms.map((room) => {
                const roomid = {
                    chatId: room.name,
                    avatar: room.avatar,
                    name: room.name
                }
                return (
                    <li onClick={() => handleChange(roomid)} key={room.name} className="flex flex-row items-center gap-x-2 p-3 hover:bg-gray-50 cursor-pointer rounded-2xl">
                        <Image width={40} height={40} className="h-8 w-8 flex-none rounded-full bg-gray-50" src={room.avatar} alt={room.name} />
                        <div className="min-w-0 flex flex-row items-center justify-between w-full">
                            <p className="text-sm leading-6 text-gray-900">{room.name}</p>
                            <MessagesSquare />
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}

export default RoomsList;