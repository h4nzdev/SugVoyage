import React from "react";

const categories = [
  { name: "All" },
  { name: "Cultural" },
  { name: "Historical" },
  { name: "Adventure" },
  { name: "Beach" },
];

const CategoryTabs = ({ selectedCategory, onCategorySelect }) => {
  return (
    <div className="mb-6 px-4">
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`flex-shrink-0 px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
              selectedCategory === category.name
                ? "bg-red-600 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
            } active:scale-95 min-w-[100px]`}
            onClick={() => onCategorySelect(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
