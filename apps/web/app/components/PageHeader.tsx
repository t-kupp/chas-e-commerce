import Link from "next/link";
import { ArrowLeft, LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description: string;
  backLink?: {
    href: string;
    label: string;
  };
  badge?: {
    icon: LucideIcon;
    value: string | number;
    label: string;
  };
}

export default function PageHeader({
  title,
  description,
  backLink,
  badge,
}: PageHeaderProps) {
  return (
    <section
      className="bg-gray-800 text-white border-b-8 border-yellow-400"
      aria-labelledby="page-title"
    >
      <div className="container mx-auto px-4 py-16">
        {/* Back Button */}
        {backLink && (
          <Link
            href={backLink.href}
            className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-6 group transition font-medium"
            aria-label={backLink.label}
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>{backLink.label}</span>
          </Link>
        )}

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1
              id="page-title"
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-yellow-400 mb-3"
            >
              {title}
            </h1>
            <p className="text-gray-200 text-lg">{description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
