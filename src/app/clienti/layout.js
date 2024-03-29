import Provider from "@/authentication/Provider";

export const metadata = {
    title: "Clienti - Swi",
    description: "Lista dei clienti",
};

export default function Layout({ children }) {
    return <Provider>{children}</Provider>
}