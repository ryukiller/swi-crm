"use client";
import React from "react";
import { useSession } from "next-auth/react";
import PageBuilder from "../../../components/pagebuilder/PageBuilder";
import MainLayout from "@/components/layout/MainLayout";
import { redirect } from "next/navigation";

function App({ params = {} }) {
  const { id } = params;
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/preventivi");
    },
  });

  return (
    <MainLayout className="content pt-0 p-5">
      {session ? (
        <div className="App">
          <PageBuilder quote_id={id} />
        </div>
      ) : (
        <progress className="progress w-56"></progress>
      )}
    </MainLayout>
  );
}

export default App;
