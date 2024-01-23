import Topnav from "./Topnav";
import Breadcrumbs from "./Breadcrumbs";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

import { Unbounded, Kanit } from 'next/font/google'

const unbounded = Unbounded({
  variable: '--font-unbounded',
  subsets: ['latin'],
  weight: ["200", "300", "400", "500", "600", "700", "800"]
})

const kanit = Kanit({
  variable: '--font-kanit',
  subsets: ['latin'],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: 'swap'
})

const MainLayout = ({ children, ...props }) => {
  return (
    <div className={unbounded.variable}>
      <div className={"drawer min-h-[100vh] " + kanit.className}>
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <Topnav />
          <div className={props.className ? props.className : 'container pt-0 p-12'}>
            <Breadcrumbs />
            {children}
          </div>

        </div>
        <Sidebar />

      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
