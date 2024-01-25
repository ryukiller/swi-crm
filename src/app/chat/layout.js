import Provider from "@/authentication/Provider";

export const metadata = {
    title: "Chat - Swi",
    description: "Chat",
};

export default function Layout({ children }) {
    return <Provider>{children}</Provider>
}