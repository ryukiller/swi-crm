
'use state'
import moment from 'moment';  // Importing moment for time formatting
import { useRef, useEffect } from 'react';

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const formatTime = (time) => {
    const msgTime = moment(time);
    const currentTime = moment();
    const isSameDay = msgTime.isSame(currentTime, 'day');

    if (isSameDay) {
        return msgTime.format('HH:mm');
    } else {
        // Using 'D MMM' for Day Month format. You may want to localize this.
        const formattedDate = msgTime.format('D MMM');
        const formattedTime = msgTime.format('HH:mm');
        return `${formattedDate}, ${formattedTime}`;
    }
};

const Message = ({ msg, user, displayAvatarAndName, isConsecutive }) => {
    const isCurrentUser = user === msg.sender;

    // return (
    //     <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} items-end mb-2`}>

    //         <div className={`rounded-lg px-4 py-2 mx-2 ${isCurrentUser ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-black'}`}>
    //             {msg.message}
    //         </div>

    //         {!isCurrentUser && !isConsecutive && (
    //             <img
    //                 src={msg.avatar}
    //                 alt={msg.username}
    //                 className="w-10 h-10 rounded-full mr-2"
    //             />
    //         )}
    //         {displayAvatarAndName && (
    //             <div className="flex flex-row">
    //                 <div className="flex flex-row">
    //                     <div className="text-xs text-gray-600 ml-2">
    //                         {msg.username}
    //                     </div>
    //                     <div className="text-xs text-gray-600 ml-2">
    //                         {formatTime(msg.time)}
    //                     </div>

    //                 </div>
    //                 <img
    //                     src={msg.avatar}
    //                     alt={msg.username}
    //                     className="w-10 h-10 rounded-full ml-2"
    //                 />
    //             </div>
    //         )}

    //     </div>
    // );
    return (
        <>
            <li
                className={classNames(
                    user !== msg.sender ? "justify-start" : "justify-end",
                    "flex"
                )}
            >
                <div className={classNames(
                    user !== msg.sender ? "flex-row" : "flex-row-reverse",
                    "flex"
                )}>
                    <div>
                        <img
                            src={msg.avatar}
                            alt={msg.username}
                            className={`w-10 h-10 rounded-full mr-2 ${isConsecutive ? 'invisible' : ''}`}
                        />
                    </div>
                    <div>
                        <span className="block text-sm text-gray-700 dark:text-gray-400">
                            <span className="font-semibold pr-4">{msg.username}</span>
                            {formatTime(msg.time)}
                        </span>
                        <div
                            className={classNames(
                                user !== msg.sender
                                    ? "text-gray-700 dark:text-gray-400 bg-white border border-gray-200 shadow-md dark:bg-gray-900 dark:border-gray-700"
                                    : "bg-blue-600 dark:bg-blue-500 text-white",
                                "relative max-w-xl px-4 py-2 rounded-lg shadow"
                            )}
                        >
                            <span className="block font-normal ">{msg.message}</span>
                        </div>
                    </div>
                </div>
            </li>
        </>
    )
};


const Messages = ({ currentUserChatId, messagesList }) => {

    const scrollRef = useRef();

    useEffect(() => {
        scrollRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messagesList]);


    // return (
    //     <div className="flex flex-col space-y-4 p-3 h-96 overflow-y-auto">
    //         {Array.isArray(messagesList) && messagesList.map((msg, id) => {
    //             const prevMsg = messagesList[id - 1];
    //             const nextMsg = messagesList[id + 1];

    //             const shouldDisplayAvatarAndName =
    //                 !nextMsg ||
    //                 nextMsg.sender !== msg.sender ||
    //                 (nextMsg.time - msg.time > 5 * 60 * 1000);  // 5 minutes

    //             return (
    //                 <Message
    //                     key={id}
    //                     msg={msg}
    //                     user={currentUserChatId}
    //                     displayAvatarAndName={shouldDisplayAvatarAndName}
    //                     isConsecutive={prevMsg && prevMsg.sender === msg.sender}
    //                 />
    //             );
    //         })}
    //     </div>
    // );

    return (
        <div className="lg:col-span-2 lg:block">
            <div className="w-full">
                <div className="relative w-full p-6 overflow-y-auto h-[30rem] bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                    <ul className="space-y-2">
                        {messagesList.map((msg, id) => {

                            const prevMsg = messagesList[id - 1];
                            const nextMsg = messagesList[id + 1];

                            const shouldDisplayAvatarAndName =
                                !nextMsg ||
                                nextMsg.sender !== msg.sender ||
                                (nextMsg.time - msg.time > 5 * 60 * 1000);  // 5 minutes

                            return (
                                <div key={id} ref={scrollRef}>
                                    <Message
                                        msg={msg}
                                        user={currentUserChatId}
                                        displayAvatarAndName={shouldDisplayAvatarAndName}
                                        isConsecutive={prevMsg && prevMsg.sender === msg.sender} />
                                </div>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )
};


export default Messages