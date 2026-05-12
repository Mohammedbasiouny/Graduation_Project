import SearchKeySelect from './SearchKeySelect'
import SearchValueInput from './SearchValueInput'

const Search = ({ fields, selectName = "search_key", inputName = "search_value" }) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 w-full">
      <div className="flex-1 ">
        <SearchKeySelect
          fields={fields}
          selectName={selectName}
        />
      </div>

      <SearchValueInput
        selectName={selectName}
        inputName={inputName}
      />
    </div>
  )
}

export default Search
