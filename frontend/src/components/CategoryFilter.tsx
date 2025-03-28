import { useState, useEffect } from 'react';
import './CategoryFilter.css'; // You might still have some custom styles here

interface CategoryFilterProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}

function CategoryFilter({
  selectedCategories,
  setSelectedCategories,
}: CategoryFilterProps) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          'https://localhost:5000/api/Bookstore/GetBookTypes'
        );
        const data = await response.json();
        setCategories(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCategories();
  }, []);

  function handleCategoryChange({ target }: { target: HTMLInputElement }) {
    const updatedCategories = selectedCategories.includes(target.value)
      ? selectedCategories.filter((category) => category !== target.value)
      : [...selectedCategories, target.value];

    setSelectedCategories(updatedCategories);
  }

  return (
    <div className="bg-light p-3 mb-3 rounded border">
      {' '}
      {/* Bootstrap background, padding, margin, rounded corners, border */}
      <h5> Book Types</h5>
      <div className="category-list">
        <ul className="list-unstyled">
          {' '}
          {/* Bootstrap to remove default list styling */}
          {categories.map((category) => (
            <li key={category} className="form-check">
              {' '}
              {/* Bootstrap for consistent checkbox styling */}
              <input
                type="checkbox"
                className="form-check-input" /* Bootstrap checkbox input */
                id={category}
                name={category}
                value={category}
                checked={selectedCategories.includes(category)}
                onChange={handleCategoryChange}
              />
              <label className="form-check-label" htmlFor={category}>
                {category}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CategoryFilter;
