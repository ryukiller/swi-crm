// list all clienti
"use client";
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ListaClienti from "../../components/ListaClienti";
import { signIn, useSession } from "next-auth/react";


const Clienti = () => {
    const { data: session } = useSession();
    const [clienti, setClienti] = useState([]);
    const [refresh, setRefresh] = useState(0);
    const [loading, setLoading] = useState(false)

    const fetchClienti = async () => {
        const res = await fetch("/api/clienti", {
            method: "GET",
            headers: {
                authorization: `bearer ${session?.user.accessToken}`,
            },
        });
        const data = await res.json();
        setClienti(data);
        setLoading(true)
    };

    useEffect(() => {
        setLoading(false)
        if (session?.user) fetchClienti();
    }, [refresh, session]);

    return (
        <MainLayout className="w-full pt-0 p-12">
            <div>
                <h1 className="text-5xl font-bold">Clienti</h1>
                <p className="py-6">
                    Lista dei clienti, puoi modificare le impostazioni
                    generali da questa schermata.
                </p>

                {session?.user ? (
                    <ListaClienti
                        refresh={refresh}
                        setRefresh={setRefresh}
                        columns={[
                            "Stato",
                            "id",
                            "Nome",
                            "Email",
                            "Telefono",
                            "Sito web",
                            "Note",
                            "Data ultima modifica",
                            "Data creazione",
                        ]}
                        items={clienti}
                    />

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

export default Clienti;


// loading ? (<ListaClienti
//     refresh={refresh}
//     setRefresh={setRefresh}
//     columns={[
//         "Stato",
//         "id",
//         "Nome",
//         "Email",
//         "Telefono",
//         "Sito web",
//         "Note",
//         "Data ultima modifica",
//         "Data creazione",
//     ]}
//     items={clienti}
// />) : (
//     <div className="animate-pulse flex space-x-4">
//         <div className="flex-1 space-y-6 py-1">
//             <div className="h-4 bg-slate-200 rounded"></div>
//             <div className="space-y-3">
//                 <div className="grid grid-cols-3 gap-4">
//                     <div className="h-4 bg-slate-200 rounded col-span-2"></div>
//                     <div className="h-4 bg-slate-200 rounded col-span-1"></div>
//                 </div>
//                 <div className="h-4 bg-slate-200 rounded"></div>
//             </div>
//             <div className="space-y-3">
//                 <div className="grid grid-cols-3 gap-4">
//                     <div className="h-4 bg-slate-200 rounded col-span-2"></div>
//                     <div className="h-4 bg-slate-200 rounded col-span-1"></div>
//                 </div>
//                 <div className="h-4 bg-slate-200 rounded"></div>
//             </div>
//         </div>
//     </div>
// )