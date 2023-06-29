// list all clienti
"use client";
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { signIn, useSession } from "next-auth/react";

function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const monthIndex = date.getMonth();
    const monthNames = [
        "Gen",
        "Feb",
        "Mar",
        "Apr",
        "Mag",
        "Giu",
        "Lug",
        "Ago",
        "Set",
        "Ott",
        "Nov",
        "Dic",
    ];
    const month = monthNames[monthIndex];
    const year = String(date.getFullYear()).substr(-2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return (
        <>
            <span className="text-xs">
                {day} {month} {year} -{" "}
            </span>
            <span className="text-xs">
                {hours}:{minutes}
            </span>
        </>
    );
}


const Cliente = ({ params = {} }) => {
    const { data: session } = useSession();
    const { id } = params;

    const [cliente, setCliente] = useState();
    const [refresh, setRefresh] = useState(0);


    const fetchClienti = async () => {
        const res = await fetch(`/api/clienti/${id}`, {
            method: "GET",
            headers: {
                authorization: `bearer ${session?.user.accessToken}`,
            },
        });
        const data = await res.json();
        setCliente(data);
    };

    useEffect(() => {
        if (session?.user) fetchClienti();
    }, [refresh, session]);

    let euro = Intl.NumberFormat("en-DE", {
        style: "currency",
        currency: "EUR",
    });

    return (
        <MainLayout>
            <div>
                <h1 className="text-5xl font-bold">Cliente: {cliente && cliente[0].name}</h1>
                {session?.user ? (
                    <div className="flex flex-row items-start gap-8 mt-10">
                        <div>
                            {cliente && (
                                cliente.map((item, index) => {
                                    return (
                                        <div key={index} className="card w-96 bg-base-100 shadow-xl">
                                            <figure><img src="/uploads/avatars/1684747505184-slidenew1-low.jpg" alt={item.name} /></figure>
                                            <div className="card-body flex-row gap-4 items-start">
                                                <div className="avatar">
                                                    <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                                        <img src="/uploads/avatars/1684747505184-slidenew1-low.jpg" />
                                                    </div>
                                                </div>
                                                <div className="max-w-40">
                                                    <h2 className="card-title my-2">{item.name}</h2>
                                                    <p className="flex flex-row gap-2 items-center my-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                                        {item.email}
                                                    </p>
                                                    <p className="flex flex-row gap-2 items-center my-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                                        {item.phone_number}
                                                    </p>
                                                    <p className="flex flex-row gap-2 items-center my-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-monitor"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
                                                        {item.website}
                                                    </p>
                                                    <p className="flex flex-row gap-2 items-center my-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sticky-note"><path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z" /><path d="M15 3v6h6" /></svg>
                                                        {item.notes}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )
                            }
                        </div>
                        <div>
                            <div className="stats shadow">

                                <div className="stat">
                                    <div className="stat-figure text-primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                    </div>
                                    <div className="stat-title">Total Likes</div>
                                    <div className="stat-value text-primary">25.6K</div>
                                    <div className="stat-desc">21% more than last month</div>
                                </div>

                                <div className="stat">
                                    <div className="stat-figure text-secondary">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                    </div>
                                    <div className="stat-title">Page Views</div>
                                    <div className="stat-value text-secondary">2.6M</div>
                                    <div className="stat-desc">21% more than last month</div>
                                </div>

                                <div className="stat">
                                    <div className="stat-figure text-secondary">
                                        <div className="avatar online">
                                            <div className="w-16 rounded-full">
                                                <img src="/uploads/avatars/1687336711725-letitbe.jpg" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="stat-value">86%</div>
                                    <div className="stat-title">Tasks done</div>
                                    <div className="stat-desc text-secondary">31 tasks remaining</div>
                                </div>

                            </div>
                            <div className="my-10">
                                <h3 className="font-bold text-2xl">Contratti:</h3>
                                <div className="overflow-x-auto">
                                    <table className="table">
                                        {/* head */}
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>VALORE</th>
                                                <th>TIPO</th>
                                                <th>DATA FIRMA</th>
                                                <th>DATA SCADENZA</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cliente && cliente[0].contratti.map((item) => {
                                                return (
                                                    <tr>
                                                        <th>{item.id}</th>
                                                        <th>{item.contract_type}</th>
                                                        <td>{euro.format(item.contract_amount)}</td>
                                                        <td>🕐 {formatDate(item.contract_date)}</td>
                                                        <td>🕐 {formatDate(item.contract_expiry)}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
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

export default Cliente;
