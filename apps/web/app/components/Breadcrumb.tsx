"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  currentPage?: string;
}

export default function Breadcrumb({ items, currentPage }: BreadcrumbProps) {
  const pathname = usePathname();

  const breadcrumbItems = items || generateBreadcrumbs(pathname);

  // schema.org breadcrumbList structured data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}${item.href}`,
    })),
  };

  if (currentPage) {
    breadcrumbSchema.itemListElement.push({
      "@type": "ListItem",
      position: breadcrumbItems.length + 1,
      name: currentPage,
      item: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}${pathname}`,
    });
  }

  return (
    <>
      {/* schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* visual breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center space-x-2 text-sm text-gray-600 mb-8"
      >
        {breadcrumbItems.map((item, index) => (
          <div key={item.href} className="flex items-center space-x-2">
            {index > 0 && <span>/</span>}
            <Link
              href={item.href}
              className="hover:text-gray-900 transition-colors"
            >
              {item.label}
            </Link>
          </div>
        ))}
        {currentPage && (
          <>
            <span>/</span>
            <span className="text-yellow-600 font-medium">{currentPage}</span>
          </>
        )}
      </nav>
    </>
  );
}

// helper function to auto-generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

  let currentPath = "";
  paths.forEach((path, index) => {
    currentPath += `/${path}`;
    // skip the last segment as it will be the current page
    if (index < paths.length - 1) {
      breadcrumbs.push({
        label: capitalizeFirst(path.replace(/-/g, " ")),
        href: currentPath,
      });
    }
  });

  return breadcrumbs;
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
