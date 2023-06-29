import Link from "next/link";

const menuItems = [
  {
    // logo
    title: "Home",
    url: "/",
    icon: "HomeIcon",
  },
  {
    title: "Home",
    url: "/",
    icon: "HomeIcon",
  },
];

const Sidebar = () => {
  return (
    <div className="drawer-side">
      <label htmlFor="my-drawer" className="drawer-overlay"></label>
      <ul className="menu p-4 w-80 bg-base-100 text-base-content h-full">
        <li>
          <Link href="/preventivi" title="preventivi">
            Preventivi
          </Link>
        </li>
        <li>
          <Link href="/clienti" title="clienti">
            Clienti
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
