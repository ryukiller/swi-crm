import "../styles/globals.css";
import "../styles/output.css";
import Provider from "../authentication/Provider";

export const metadata = {
  title: "Preventivi",
  description: "App per gestire i preventivi",
};

export default function RootLayout({ children }) {
  return (
    
    <html lang="en" data-theme="switheme">
      <body>
      <Provider>{children}</Provider>
      </body>
    </html>
  );
}
