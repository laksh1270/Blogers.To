import { useState } from 'react';

interface CategoryFiltersProps {
  categories: { label: string; value: string }[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilters({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategoryChange(category.value)}
          className={`text-sm font-medium transition-colors pb-2 capitalize ${
            selectedCategory === category.value
              ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}

