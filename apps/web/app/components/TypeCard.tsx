import Link from "next/link";
import Image from "next/image";
import { getTypeData, TypeItem } from "../../../shared/types/type";

interface TypeCardProps {
  type: TypeItem;
}

export function TypeCard({ type }: TypeCardProps) {
  const typeName = type.attributes?.title || type.title || "Unknown";
  const slug = type.attributes?.slug || type.slug;
  const cardCount =
    type.attributes?.pokemon?.data?.length || type.pokemon?.length || 0;
  const typeData = getTypeData(typeName);

  return (
    <Link
      href={`/types/${slug}`}
      className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-yellow-400"
    >
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <Image
          src={typeData.image}
          alt={`${typeName} type`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-900/80 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2 className="text-2xl font-bold text-white mb-1">{typeName}</h2>
          <p className="text-gray-200 text-sm">Type</p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-3xl font-bold text-blue-600">{cardCount}</p>
            <p className="text-gray-600 text-sm">
              {cardCount === 1 ? "Card" : "Cards"}
            </p>
          </div>

          <span className="text-yellow-400 font-medium text-sm group-hover:translate-x-1 transition-transform">
            View All →
          </span>
        </div>

        <p className="text-gray-500 text-sm">
          Explore all {typeName.toLowerCase()} type Pokemon cards
        </p>
      </div>
    </Link>
  );
}
