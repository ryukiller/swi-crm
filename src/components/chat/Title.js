

const MessagesTitle = ({ user }) => {

    return (
        <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
            <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
                <div className="ml-4 mt-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <img
                                className="h-12 w-12 rounded-full"
                                src={user.avatar}
                                alt={user.name}
                            />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-base font-semibold leading-6 text-gray-900">{user.name}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MessagesTitle