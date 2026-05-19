const FilterBar = ({ filters, onFilterChange, onSearch }) => {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>
          Category
          <input
            type="text"
            value={filters.category}
            onChange={(event) => onFilterChange('category', event.target.value)}
            placeholder="Water Supply"
          />
        </label>
        <label>
          Status
          <select
            value={filters.status}
            onChange={(event) => onFilterChange('status', event.target.value)}
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </label>
      </div>
      <div className="filter-group">
        <label>
          Search by location
          <input
            type="text"
            value={filters.location}
            onChange={(event) => onFilterChange('location', event.target.value)}
            placeholder="Ghaziabad"
          />
        </label>
        <button type="button" className="primary-btn" onClick={onSearch}>
          Apply
        </button>
      </div>
    </div>
  )
}

export default FilterBar
