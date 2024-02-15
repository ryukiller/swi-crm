'use state'
import { MessageSquare } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
const UserList = ({ token, currentUser, currentChat }) => {

    const [chatChange, setChatChange] = useState();

    useEffect(() => {
        currentChat(chatChange);
    }, [chatChange]);

    const handleChange = (chat) => {
        setChatChange(chat);
    };

    const [people, setPeople] = useState()

    const fetchUsers = async () => {
        try {
            const res = await fetch(`/api/chat/get-users`, {
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
            const parsedDataArray = data.map(item => ({
                ...item,
                options: JSON.parse(item.options)
            }));
            setPeople(parsedDataArray);
        } catch (error) {
            console.error("An error occurred while fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers()
    }, [])

    return (
        <ul role="list" className="divide-y divide-gray-100">
            {people?.map((person) => {
                const chatId = [person.userChatId, currentUser].sort().join('__')
                const user = {
                    chatId: chatId,
                    avatar: person.options.avatar,
                    name: person.name
                }
                return (
                    <li onClick={() => handleChange(user)} key={person.id} className="flex flex-row items-center gap-x-2 p-3 hover:bg-gray-50 cursor-pointer rounded-2xl">
                        <Image width={40} height={40} className="h-8 w-8 flex-none rounded-full bg-gray-50" src={person.options.avatar ?? '/uploads/avatars/1693298124748-letitbe.jpg'} alt={person.name} />
                        <div className="min-w-0 flex flex-row items-center justify-between w-full">
                            <p className="text-sm leading-6 text-gray-900">
                                {
                                    person.name.split(' ').map((item, index, array) => {
                                        if (index === 0) {
                                            // Take first letter of the first name
                                            return <span key={index} className=" font-bold">{item.charAt(0)}. </span>;
                                        } else if (index === array.length - 1) {
                                            // Take the last name and truncate if needed
                                            let lastName = item.length > 8 ? item.slice(0, 8) + '...' : item;
                                            return <span key={index}>{lastName}</span>;
                                        } else {
                                            // Skip middle names
                                            return null;
                                        }
                                    })
                                }
                            </p>
                            <MessageSquare />
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}

export default UserList;