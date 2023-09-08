export const metadata = {
    title: "Login - Swi",
    description: "Login page",
};

export default function Layout({ children }) {
    return (
        <html className="h-full bg-white">
            <body className="h-full">
                {children}
            </body>
        </html>
    )
}