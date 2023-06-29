'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Breadcrumbs = () => {
  const pathname = usePathname();
  if (!pathname) return null
  const paths = pathname.split("/").filter(path => path);

  return (
    <div className="text-sm breadcrumbs py-6">
      <ul>
        <li>
          <Link href="/">
            Home
          </Link>
        </li>
        {paths.map((path, i) => {
          const breadcrumb = paths.slice(0, i + 1);
          const url = `/${breadcrumb.join("/")}`;

          return (
            <li key={i}>
              <Link href={url}>
                {path}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Breadcrumbs;
