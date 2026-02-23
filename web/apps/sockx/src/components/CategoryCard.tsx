import Image from "next/image";
import { Category } from "@/data/categories";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div className="relative group overflow-hidden rounded-xl cursor-pointer aspect-[4/3]">
      {/* Background Image */}
      <Image
        src={category.image}
        alt={category.name}
        fill
        sizes="(max-width: 640px) 50vw, 33vw"
        className="object-cover group-hover:scale-110 transition-transform duration-300"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-sockx-text/80 via-sockx-text/30 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="font-heading text-xl text-white mb-1">
          {category.name}
        </h3>
        <p className="font-body text-sm text-purple-200">
          {category.description}
        </p>
      </div>
    </div>
  );
}
