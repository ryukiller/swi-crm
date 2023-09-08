import "../styles/globals.css";
import "../styles/output.css";

import Provider from "../authentication/Provider";

export const metadata = {
  title: "Preventivi",
  description: "App per gestire i preventivi",
  manifest: '/site.webmanifest',
  icons: {
    icon: '/favicon.png',
    shortcut: '/shortcut-icon.png',
    apple: '/apple-touch-icon.png',
  },
};

//<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
// <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
// <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
// <link rel="manifest" href="/site.webmanifest">
// <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
//  <meta name="msapplication-TileColor" content="#da532c">
//  <meta name="theme-color" content="#ffffff">

export default function RootLayout({ children }) {
  return (

    <html lang="en" data-theme="switheme">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
