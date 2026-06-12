function SearchBar({ value, onChange }) {
  return (
    <label className="search-bar">
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Pesquisar carta..."
      />
    </label>
  );
}

export default SearchBar;
