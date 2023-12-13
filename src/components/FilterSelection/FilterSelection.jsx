function FilterSelection(props) {
  const { categories, selectedCategory, handleSelectChange } = props;

  return (
    <select
      value={selectedCategory}
      onChange={handleSelectChange}
      className="form-select mx-2 h-1 my-2"
    >
      <option value="">Select a category</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
}

export default FilterSelection;
