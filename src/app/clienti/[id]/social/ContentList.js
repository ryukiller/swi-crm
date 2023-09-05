import { useState, Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { Flame, Frown, Heart, Smile, ThumbsUp, XCircle, CheckCircle, Paperclip } from 'lucide-react'

function formatDate(dateString) {
    const months = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
    const date = new Date(dateString);

    // Build the formatted date string
    const day = date.getDate().toString().padStart(2, '0');  // Pad with leading zero if necessary
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString().slice(2);  // Only the last two digits
    const hours = date.getHours().toString().padStart(2, '0');  // Pad with leading zero if necessary
    const minutes = date.getMinutes().toString().padStart(2, '0');  // Pad with leading zero if necessary

    // Determine the label based on whether the date is in the past
    const now = new Date();
    let label = "Post da publicare il";
    if (date < now) {
        label = "Publicato il";
    }

    return `${label} ${day} ${month} ${year} alle ${hours}:${minutes}`;
}




const ContentList = ({ json }) => {

    return (
        <div className="w-full space-y-6 flex flex-col items-center justify-start">
            {
                json && json.map((item, index) => {

                    return (
                        <div key={index}>
                            <div class="relative flex flex-row items-center justify-center gap-x-4 w-full">

                                <div className='relative'>
                                    <span class="absolute left-[-1000%] py-0.5 text-xs leading-5 text-gray-500"><span class="font-medium text-gray-900">{formatDate(item.date)}</span></span>
                                    <div class="absolute left-0 top-[-25px] flex w-6 justify-center -bottom-6">
                                        <div class="w-px bg-gray-200"></div>
                                    </div>
                                    <div class="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
                                        <div class="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300"></div>
                                    </div>
                                    <time datetime="2023-01-23T10:32" class="absolute right-[-200%] top-0 flex-none py-0.5 text-xs leading-5 text-gray-500">7d ago</time>
                                </div>

                            </div>
                            <div className="h-56 w-full"> </div>
                        </div>
                    )
                })
            }
        </div >
    )
}

export default ContentList;