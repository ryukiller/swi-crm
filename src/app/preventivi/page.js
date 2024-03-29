// list all preventivi
"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import List from "../../components/List";
import MainLayout from "@/components/layout/MainLayout";

const Preventivi = () => {
  const { data: session } = useSession();
  const [preventivi, setPreventivi] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(false)


  const fetchPreventivi = async () => {
    const res = await fetch("/api/preventivi", {
      method: "GET",
      headers: {
        authorization: `bearer ${session?.user.accessToken}`,
      },
    });
    const data = await res.json();
    setPreventivi(data);
    setLoading(true)
  };

  useEffect(() => {
    setLoading(false)
    if (session?.user) fetchPreventivi();
  }, [refresh, session]);

  return (
    <MainLayout className="pt-0 p-12">
      <div>
        <h1 className="text-5xl font-bold">Preventivi</h1>
        <p className="py-6">
          Lista dei preventivi preparati, puoi modificare le impostazioni
          generali da questa schermata, oppure accedere al page builder per
          modificare il template del preventivo.
        </p>
        {session?.user ? (
          <List
            refresh={refresh}
            setRefresh={setRefresh}
            columns={[
              "Stato",
              "id",
              "Titolo",
              "Totale",
              "Cliente",
              "Categoria",
              "Note",
              "Data ultima modifica",
              "Data creazione",
            ]}
            items={preventivi}
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
                <span>Effetua il login per visualizzare i preventivi</span>
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

export default Preventivi;


// loading ? (
//   <List
//     refresh={refresh}
//     setRefresh={setRefresh}
//     columns={[
//       "Stato",
//       "id",
//       "Titolo",
//       "Totale",
//       "Cliente",
//       "Categoria",
//       "Note",
//       "Data ultima modifica",
//       "Data creazione",
//     ]}
//     items={preventivi}
//   />) : (
//   <div className="animate-pulse flex space-x-4">
//     <div className="flex-1 space-y-6 py-1">
//       <div className="h-4 bg-slate-200 rounded"></div>
//       <div className="space-y-3">
//         <div className="grid grid-cols-3 gap-4">
//           <div className="h-4 bg-slate-200 rounded col-span-2"></div>
//           <div className="h-4 bg-slate-200 rounded col-span-1"></div>
//         </div>
//         <div className="h-4 bg-slate-200 rounded"></div>
//       </div>
//       <div className="space-y-3">
//         <div className="grid grid-cols-3 gap-4">
//           <div className="h-4 bg-slate-200 rounded col-span-2"></div>
//           <div className="h-4 bg-slate-200 rounded col-span-1"></div>
//         </div>
//         <div className="h-4 bg-slate-200 rounded"></div>
//       </div>
//     </div>
//   </div>
// )