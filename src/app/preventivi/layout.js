import Provider from "@/authentication/Provider";

export const metadata = {
    title: "Preventivi - Swi",
    description: "Lista dei preventivi",
};

export default function Layout({ children }) {
    return <Provider>{children}</Provider>
}