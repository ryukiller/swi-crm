import Topnav from "./Topnav";
import Breadcrumbs from "./Breadcrumbs";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const MainLayout = ({ children, ...props }) => {
  return (
    <>
      <div className="drawer min-h-[100vh]">
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
    </>
  );
};

export default MainLayout;
