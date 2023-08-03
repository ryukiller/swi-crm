// list all preventivi
"use client";
import { useState, useRef, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { signIn, useSession } from "next-auth/react";

import { KeyRound, Lock, Copy } from 'lucide-react';
import { Transition, Switch } from '@headlessui/react';


const PassGen = () => {
    const { data: session } = useSession();
    const [passwordLength, setPasswordLength] = useState(20);
    const [includeSpecialChars, setIncludeSpecialChars] = useState(true);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [isShowing, setIsShowing] = useState(false)
    const passwordRef = useRef(null);

    const generatePassword = () => {
        let charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        if (includeSpecialChars) {
            charset += '!@#$%^&*()_-+=';
        }
        let password = '';
        const array = new Uint8Array(passwordLength);
        window.crypto.getRandomValues(array);
        for (let i = 0; i < passwordLength; i++) {
            password += charset[array[i] % charset.length];
        }
        setGeneratedPassword(password);
        setIsShowing(true)
    };

    const copyToClipboard = (e) => {
        navigator.clipboard.writeText(generatedPassword);
        setIsCopied(true)
    };

    useEffect(() => {
        if (isCopied) {
            const timerId = setTimeout(() => {
                setIsCopied(false);
            }, 1200); // you can control the time showing the notification here
            return () => clearTimeout(timerId);
        }
    }, [isCopied]);

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <MainLayout className="pt-0 p-12">
            <div>
                {session?.user ? (
                    <div className="max-w-xl">
                        <div className="px-4 sm:px-0">
                            <h3 className="text-base font-semibold leading-7 text-gray-900">Password Generator</h3>
                            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Tool per generare delle password molto sicure.</p>
                        </div>
                        <div className="mt-6 border-t border-gray-100">
                            <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                                <label htmlFor="name" className="block text-xs font-medium text-gray-900">
                                    Lunghezza password
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={passwordLength}
                                    onChange={(e) => setPasswordLength(e.target.value)}
                                    className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="mt-6 space-y-5">
                            <div className="relative flex items-start">
                                <div className="flex h-6 items-center">
                                    <Switch
                                        checked={includeSpecialChars}
                                        onChange={() => setIncludeSpecialChars(!includeSpecialChars)}
                                        className={classNames(
                                            includeSpecialChars ? 'bg-indigo-600' : 'bg-gray-200',
                                            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
                                        )}
                                    >
                                        <span className="sr-only">Includi caratteri speciali</span>
                                        <span
                                            aria-hidden="true"
                                            className={classNames(
                                                includeSpecialChars ? 'translate-x-5' : 'translate-x-0',
                                                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                            )}
                                        />
                                    </Switch>
                                </div>
                                <div className="ml-3 text-sm leading-6">
                                    <label htmlFor="comments" className="font-medium text-gray-900">
                                        Includi caratteri speciali
                                    </label>
                                    <p id="comments-description" className="text-gray-500">
                                        I caratteri speciali rendono le password più sicure
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex flex-row items-start justify-between relative">
                            <button
                                type="button"
                                onClick={generatePassword}
                                className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Genera password
                                <KeyRound size={16} strokeWidth={1.5} className="-mr-0.5 h-5 w-5" aria-hidden="true" />
                            </button>

                            <Transition
                                show={isShowing}
                                enter="transition-all ease-in duration-200"
                                enterFrom="opacity-0 left-[-15px]"
                                enterTo="opacity-100 left-0"
                                leave="transition-all ease-out duration-500"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                                className="relative flex flex-row rounded-md shadow-sm w-8/12"
                            >
                                <div className="relative flex flex-grow items-stretch focus-within:z-10">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Lock size={16} strokeWidth={1.5} className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        value={generatedPassword}
                                        ref={passwordRef}
                                        readOnly
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={copyToClipboard}
                                    className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    <Copy size={16} strokeWidth={1.5} className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                    Copia
                                </button>
                            </Transition>

                            <Transition
                                show={isCopied}
                                enter="transition-all ease-in duration-200"
                                enterFrom="opacity-0 top-[-50%]"
                                enterTo="opacity-100 top-[-70%]"
                                leave="transition-all ease-out duration-500"
                                leaveFrom="opacity-100 top-[-70%]"
                                leaveTo="opacity-0  top-[-50%]"
                                className="absolute right-0 inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
                            >
                                <span>
                                    Password Copiata
                                </span>
                            </Transition>
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
                                <span>Effetua il login per visualizzare questa sezione</span>
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

export default PassGen;
