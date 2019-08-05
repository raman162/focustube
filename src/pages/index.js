import React from "react"
import { graphql, navigate } from "gatsby"
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
    navigate(`/results?search_query=${encodeURIComponent(query)}`)
  }

  render() {
    const {query} = this.state
    const {data} = this.props
    const searchDisabled = query === ''
    return(
      <Layout>
        <div className={indexStyles.indexContainer}>
          <div>
            <h1 className={indexStyles.indexHeader}>
              {data.site.siteMetadata.title}
            </h1>
            <div className={indexStyles.description}>
              {data.site.siteMetadata.description}
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

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`
