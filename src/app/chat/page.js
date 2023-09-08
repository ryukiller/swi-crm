// list all clienti
"use client";
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { signIn, useSession } from "next-auth/react";

import { notFound } from 'next/navigation'

import { pusherClient } from "@/lib/pusher";
import axios from "axios";



// chat components
import UserList from "@/components/chat/userList";
import RoomsList from "@/components/chat/RoomsList";
import { User, Users } from "lucide-react";
import MessagesTitle from "@/components/chat/Title";
import Messages from "@/components/chat/Messages";
import MessageInput from "@/components/chat/MessageInput";
// import { fetchRedis } from "@/helpers/redis";
// import { getFriendsByUserId } from "@/helpers/getFriendsByUserId";



const Chat = () => {
    const { data: session } = useSession();

    const [chats, setChats] = useState([]);
    const [messageToSend, setMessageToSend] = useState("");
    const [chatHeader, setChatHeader] = useState({ name: "SWI", avatar: "/imgs/logo-dark.png" })

    const [currentChat, setCurrentChat] = useState();

    const handleCurrentChatChange = (newData) => {
        if (typeof newData === 'object' && newData !== null) {
            setCurrentChat(newData.chatId);
            setChatHeader({ name: newData.name, avatar: newData.avatar })
        }

    };

    const handleNewMessageInput = (newMessage) => {
        setMessageToSend(newMessage)
    }

    const chat = currentChat ?? "SWI";

    useEffect(() => {
        console.log('Fetching messages for chat:', chat, 'and session:', session);

        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/api/chat/get-msg?chat=${chat}`, {
                    headers: {
                        authorization: `bearer ${session?.user.accessToken}`,
                    },
                });
                console.log(response.data)
                setChats(response.data.messages);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }
        };

        fetchMessages();
    }, [chat, session]);

    useEffect(() => {
        console.log("currentChat:", currentChat);  // Debugging line
        console.log("chat:", chat);  // Debugging line

        const channel = pusherClient.subscribe(chat);

        channel.bind("chat-event", function (data) {
            setChats((prevState) => [
                ...(Array.isArray(prevState) ? prevState : []),
                {
                    sender: data.sender,
                    message: data.message,
                    chat: data.chat,
                    username: data.username,
                    avatar: data.avatar,
                    time: data.time
                },
            ]);
        });

        return () => {
            pusherClient.unsubscribe(chat);
        };
    }, [chat]);  // Removed messageToSend from dependency array

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios.post('/api/chat/send-msg', {
            message: messageToSend,
            sender: session?.user.userChatId,
            chat: chat,
            username: session?.user.name,
            avatar: session?.user.options.avatar ?? '/uploads/avatars/1693298124748-letitbe.jpg',
            time: new Date()
        },
            {
                headers: {
                    authorization: `bearer ${session?.user.accessToken}`,
                },
            });
    };

    return (
        <MainLayout className="w-full pt-0 p-12">
            <div>
                {session?.user ? (
                    <div className="flex flex-row">
                        <div id="chatSide" className="flex flex-col w-2/12">
                            <div className="my-3">
                                <div className="my-3 flex flex-row items-center gap-3 pb-3">
                                    <User />
                                    <h3 className="text-base font-semibold leading-6 text-gray-900">Utenti</h3>
                                </div>
                                <UserList currentChat={handleCurrentChatChange} currentUser={session?.user.userChatId} token={session?.user.accessToken} />
                            </div>
                            <div className="my-3">
                                <div className="my-3 flex flex-row items-center gap-3 pb-3">
                                    <Users />
                                    <h3 className="text-base font-semibold leading-6 text-gray-900">Stanze</h3>
                                </div>
                                <RoomsList currentChat={handleCurrentChatChange} token={session?.user.accessToken} />
                            </div>
                        </div>
                        <div id="chatMain" className="w-10/12 m-6 p-4 rounded-lg shadow-lg flex flex-col justify-between">
                            <MessagesTitle user={chatHeader} />
                            <Messages messagesList={chats} currentUserChatId={session?.user.userChatId} />
                            <MessageInput setNewMessage={handleNewMessageInput} currentUser={session?.user} sendNewMessage={handleSubmit} />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="alert shadow-lg w-fit">
                            <div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="stroke-current flex-shrink-0 w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                                <span>Effetua il login per visualizzare i clienti</span>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => signIn()}
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </MainLayout>
    )
}

export default Chat;