import React from "react"
import { navigate } from "gatsby"

export default class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      query: '',
      results: []
    }
    this.onQueryChange = this.onQueryChange.bind(this)
    this.onSearch = this.onSearch.bind(this)
  }

  onQueryChange(event) {
    const query = event.currentTarget.value
    this.setState({query})
  }

  onSearch(event) {
    event.preventDefault()
    const {query} = this.state
    navigate(`/search?query=${encodeURIComponent(query)}`)
  }

  render() {
    const {results, query} = this.state
    const searchDisabled = query == ''
    return(
      <div>
        <div>
          <h1>FocusTube</h1>
          <div>
            <form>
              <input
                onChange={this.onQueryChange}
                placeholder="Search for videos"
                value={query}/>
              <button
                type='submit'
                disabled={searchDisabled}
                onClick={this.onSearch}>
                Search
              </button>
            </form>
          </div>
        </div>
        <br/>
      </div>
    )
  }
}
