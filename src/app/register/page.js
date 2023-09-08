'use client'
import React, { useRef } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { Toaster, toast } from "react-hot-toast";


export default function Register() {

    const userEmail = useRef("");
    const userName = useRef("");
    const pass = useRef("");

    const { push } = useRouter();


    const postData = async () => {
        // The data you want to send in the request
        const data = {
            name: userName.current,
            email: userEmail.current,
            password: pass.current
        };

        try {
            // Make the fetch POST request
            const response = await fetch('/api/register', {
                method: 'POST', // Request method
                headers: {
                    'Content-Type': 'application/json' // Content type (JSON)
                },
                body: JSON.stringify(data) // Convert JavaScript object to JSON string
            });

            // Check if request was successful
            if (response.ok) {
                const jsonData = await response.json(); // Parse the JSON response
                console.log('Data received:', jsonData);
                push('/preventivi');
            } else {
                console.log('Request failed:', response.status, response.statusText);
                if (response.status === 409) {
                    toast.error("Email già presente nel sistema, prova un'altra email")
                } else {
                    toast.error("c'è stato un errore riprova")
                    push('/register');
                }
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <Image
                        width={100}
                        height={100}
                        className="mx-auto h-10 w-auto"
                        src="/imgs/logo-dark.png"
                        alt="Your Company"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Crea un account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" action="#" method="POST">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Nome
                            </label>
                            <div className="mt-2">
                                <input
                                    onChange={(e) => (userName.current = e.target.value)}
                                    id="nome"
                                    name="nome"
                                    type="text"
                                    autoComplete="nome"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email
                            </label>
                            <div className="mt-2">
                                <input
                                    onChange={(e) => (userEmail.current = e.target.value)}
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    onChange={(e) => (pass.current = e.target.value)}
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={postData}
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Registrati
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Hai già un account?{' '}
                        <a href="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Effetua il login in questa pagina.
                        </a>
                    </p>
                </div>
            </div>
            <Toaster
                position="bottom-left"
                reverseOrder={false}
            />
        </>
    )
}
