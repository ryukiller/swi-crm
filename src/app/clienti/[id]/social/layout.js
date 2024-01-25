import Provider from "@/authentication/Provider";

export const metadata = {
    title: "Social Timeline - Swi",
    description: "Timeline per i post social",
};

export default function Layout({ children }) {
    return <Provider>{children}</Provider>
}