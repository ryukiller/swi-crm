// list all clienti
"use client";
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { signIn, useSession } from "next-auth/react";
import axios from "axios";

const socialTimeLine = [{
    date: "12/08/2023",
    type: "Facebook Post",
    moodboardlink: "https://team.swi.it/mood/clientid/adja-adasd-sasd",
    feed: [{
        id: 1,
        type: "update",
        comment: "aggiornata bozza",
        date: new Date()
    },
    {
        id: 2,
        type: "comment",
        comment: "io preferisco la bozza numero 3",
        userid: 5,
        date: new Date()
    }],
    content: [{
        media: "/imgs/avatar.jpeg",
        description: "descrizine post",
        likes: 100,
        comments: 10,
        condivisioni: 100,
        state: 1
    },
    {
        media: "/imgs/avatar.jpeg",
        description: "bozza descrizine post 2",
        likes: 100,
        comments: 10,
        condivisioni: 100,
        state: 0
    },
    {
        media: "/imgs/avatar.jpeg",
        description: "bozza descrizine post 3",
        likes: 100,
        comments: 10,
        condivisioni: 100,
        state: 0
    }]
},
{
    date: "11/09/2023",
    type: "Instagram Post",
    moodboardlink: "https://team.swi.it/mood/clientid/adja-adasd-sasd",
    feed: [{
        id: 1,
        type: "update",
        comment: "aggiornata bozza",
        date: new Date()
    },
    {
        id: 2,
        type: "comment",
        comment: "io preferisco la bozza numero 3",
        userid: 5,
        date: new Date()
    }],
    content: [{
        media: "/imgs/avatar.jpeg",
        description: "descrizine post",
        likes: 100,
        comments: 10,
        condivisioni: 100,
        state: 1
    },
    {
        media: "/imgs/avatar.jpeg",
        description: "bozza descrizine post 2",
        likes: 100,
        comments: 10,
        condivisioni: 100,
        state: 0
    },
    {
        media: "/imgs/avatar.jpeg",
        description: "bozza descrizine post 3",
        likes: 100,
        comments: 10,
        condivisioni: 100,
        state: 0
    }]
},
{
    date: "02/10/2023",
    type: "Instagram Reel",
    moodboardlink: "https://team.swi.it/mood/clientid/adja-adasd-sasd",
    feed: [{
        id: 1,
        type: "update",
        comment: "aggiornata bozza",
        date: new Date()
    },
    {
        id: 2,
        type: "comment",
        comment: "io preferisco la bozza numero 3",
        userid: 5,
        date: new Date()
    }],
    content: [{
        media: "/imgs/avatar.jpeg",
        description: "descrizine post",
        likes: 100,
        comments: 10,
        condivisioni: 100,
        state: 1
    },
    {
        media: "/imgs/avatar.jpeg",
        description: "bozza descrizine post 2",
        likes: 100,
        comments: 10,
        condivisioni: 100,
        state: 0
    },
    {
        media: "/imgs/avatar.jpeg",
        description: "bozza descrizine post 3",
        likes: 100,
        comments: 10,
        condivisioni: 100,
        state: 0
    }]
},
{
    date: "15/12/2023",
    type: "Facebook Post",
    moodboardlink: "https://team.swi.it/mood/clientid/adja-adasd-sasd",
    feed: [{
        id: 1,
        type: "update",
        comment: "aggiornata bozza",
        date: new Date()
    },
    {
        id: 2,
        type: "comment",
        comment: "io preferisco la bozza numero 3",
        userid: 5,
        date: new Date()
    }],
    content: [{
        media: "/imgs/avatar.jpeg",
        description: "descrizine post",
        likes: 100,
        comments: 10,
        condivisioni: 100,
        state: 1
    },
    {
        media: "/imgs/avatar.jpeg",
        description: "bozza descrizine post 2",
        likes: 100,
        comments: 10,
        condivisioni: 100,
        state: 0
    },
    {
        media: "/imgs/avatar.jpeg",
        description: "bozza descrizine post 3",
        likes: 100,
        comments: 10,
        condivisioni: 100,
        state: 0
    }]
}]


const Social = ({ params = {} }) => {
    const { data: session } = useSession();
    const { id } = params;

    const getPosts = async () => {
        const res = await axios.get(`/api/clienti/${id}/social`, {
            params: {
                id: id
            },
            headers: {
                authorization: `bearer ${session?.user.accessToken}`,
            }
        })

        console.log(res)
    }

    const insertPost = async () => {
        const res = await axios.post(`/api/clienti/${id}/social`, {
            data: {
                client_id: id,
                date: "12/07/2023",
                type: "Facebook Post",
                moodboardlink: "https://team.swi.it/mood/"
            },
            headers: {
                authorization: `bearer ${session?.user.accessToken}`,
            }
        })

        console.log(res)
    }


    return (
        <MainLayout className="w-full pt-0 p-12">
            <div>
                <h1 className="text-xl font-bold text-center"
                    onClick={() => getPosts()}
                >Social Timeline</h1>
                <h1 className="text-xl font-bold text-center"
                    onClick={() => insertPost()}
                >Insert Social Timeline</h1>

                {session?.user ? (
                    <div className="">
                        {id}
                        {socialTimeLine.map((item, index) => {
                            return (
                                <div key={index}>
                                    {item.date}
                                </div>
                            )
                        })}
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
    );
};

export default Social;
