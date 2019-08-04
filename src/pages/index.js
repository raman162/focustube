import React from "react"
import { navigate } from "gatsby"
import indexStyles from "./index.module.css"
import Layout from "../components/layout.js"

export default class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      query: ''
    }
    this.onQueryChange = this.onQueryChange.bind(this)
    this.onSearch = this.onSearch.bind(this)
  }

  componentDidMount() {
    this.textInput.focus()
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
    const searchDisabled = query === ''
    return(
      <Layout>
        <div className={indexStyles.indexContainer}>
          <div>
            <h1 className={indexStyles.indexHeader}>
              FocusTube
            </h1>
            <div className={indexStyles.description}>
              Search videos on youtube without being distracted
            </div>
            <div className={indexStyles.formContainer}>
              <form>
                <input
                  onChange={this.onQueryChange}
                  placeholder="Search for videos"
                  ref={(input) => this.textInput = input}
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
        </div>
      </Layout>
    )
  }
}
