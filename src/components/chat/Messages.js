
import moment from 'moment';  // Importing moment for time formatting

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

    return (
        <div className={`flex flex-col-reverse ${isCurrentUser ? 'justify-end' : 'justify-start'} items-end mb-2`}>
            {!isCurrentUser && !isConsecutive && (
                <img
                    src={msg.avatar}
                    alt={msg.username}
                    className="w-10 h-10 rounded-full mr-2"
                />
            )}
            <div className={`rounded-lg px-4 py-2 mx-2 ${isCurrentUser ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-black'}`}>
                {msg.message}
            </div>
            {displayAvatarAndName && (
                <div className="flex flex-row">
                    <div className="flex flex-row">
                        <div className="text-xs text-gray-600 ml-2">
                            {msg.username}
                        </div>
                        <div className="text-xs text-gray-600 ml-2">
                            {formatTime(msg.time)}
                        </div>

                    </div>
                    <img
                        src={msg.avatar}
                        alt={msg.username}
                        className="w-10 h-10 rounded-full ml-2"
                    />
                </div>
            )}
        </div>
    );
};


const Messages = ({ currentUserChatId, messagesList }) => {
    return (
        <div className="flex flex-col space-y-4 p-3 h-96 overflow-y-auto">
            {Array.isArray(messagesList) && messagesList.map((msg, id) => {
                const prevMsg = messagesList[id - 1];
                const nextMsg = messagesList[id + 1];

                const shouldDisplayAvatarAndName =
                    !nextMsg ||
                    nextMsg.sender !== msg.sender ||
                    (nextMsg.time - msg.time > 5 * 60 * 1000);  // 5 minutes

                return (
                    <Message
                        key={id}
                        msg={msg}
                        user={currentUserChatId}
                        displayAvatarAndName={shouldDisplayAvatarAndName}
                        isConsecutive={prevMsg && prevMsg.sender === msg.sender}
                    />
                );
            })}
        </div>
    );
};


export default Messages