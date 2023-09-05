import Link from "next/link";
import { usePathname } from 'next/navigation'


import { ScrollText, FileBadge } from "lucide-react";

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

const navigation = [
  { name: 'Preventivi', href: '/preventivi', icon: ScrollText },
  { name: 'Clienti', href: '/clienti', icon: FileBadge }
]
const tools = [
  { id: 1, name: 'Password generator', href: '/passgen', initial: 'P' }
]

const chat = [
  { id: 1, name: 'Chat', href: '/chat', initial: 'C' }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


const Sidebar = () => {
  const pathname = usePathname()

  console.log(pathname)
  return (
    <div className="drawer-side">
      <label htmlFor="my-drawer" className="drawer-overlay"></label>
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2 h-full">
        <div className="flex h-16 shrink-0 items-center">
          <img
            className="h-8 w-auto"
            src="/imgs/logo-dark.png"
            alt="Your Company"
          />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={classNames(
                        pathname === item.href
                          ? 'bg-gray-50 text-indigo-600'
                          : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                      )}
                    >
                      <item.icon
                        className={classNames(
                          pathname === item.href ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                          'h-6 w-6 shrink-0'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400">Tools</div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {tools.map((tool) => (
                  <li key={tool.name}>
                    <Link
                      href={tool.href}
                      className={classNames(
                        pathname === tool.href
                          ? 'bg-gray-50 text-indigo-600'
                          : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                      )}
                    >
                      <span
                        className={classNames(
                          pathname === tool.href
                            ? 'text-indigo-600 border-indigo-600'
                            : 'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600',
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'
                        )}
                      >
                        {tool.initial}
                      </span>
                      <span className="truncate">{tool.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400">Comunicazioni</div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {chat.map((chat) => (
                  <li key={chat.name}>
                    <Link
                      href={chat.href}
                      className={classNames(
                        pathname === chat.href
                          ? 'bg-gray-50 text-indigo-600'
                          : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                      )}
                    >
                      <span
                        className={classNames(
                          pathname === chat.href
                            ? 'text-indigo-600 border-indigo-600'
                            : 'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600',
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'
                        )}
                      >
                        {chat.initial}
                      </span>
                      <span className="truncate">{chat.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
