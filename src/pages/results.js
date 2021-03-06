import React from "react"
import { Helmet } from "react-helmet"
import axios from "axios"
import { navigate, Link } from "gatsby"
import resultsStyles from "./results.module.css"
import Layout from "../components/layout.js"
import SearchResult from "../components/search_result.js"

export default class Search extends React.Component {

  constructor(props) {
    super(props)
    let query = this.currentQueryParam()
    this.state = {
      loading: query !== '',
      results: [],
      query: query,
      initSearchQuery: query,
      loadingExtraResults: false,
      error: false
    }
    this.onQueryChange = this.onQueryChange.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.loadExtraResults = this.loadExtraResults.bind(this)
  }

  currentQueryParam() {
    const urlParams = new URLSearchParams(this.props.location.search)
    return urlParams.get('search_query') || ''
  }

  componentDidMount() {
    if (this.state.query !== ''){this.fetchResults()}
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

  componentDidUpdate(prevProps, prevState, snapshot) {
    const prevUrlParams = new URLSearchParams(prevProps.location.search)
    const prevQuery = prevUrlParams.get('search_query') || ''
    if (prevQuery !== this.currentQueryParam()) {
      this.setState({query: this.currentQueryParam()}, ()=> this.fetchResults())
    }
  }

  fetchResults() {
    const {query} = this.state
    this.setState({
      loading: true,
      results: [],
      lastSearchQuery: query,
      error: false
    })
    axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        key: process.env.GATSBY_YOUTUBE_API_KEY,
        type: 'video',
        maxResults: '10'
      }
    }).then((response) => {
      this.setState({
        results: response.data.items || [],
        totalResults: response.data.pageInfo.totalResults,
        nextPageToken: response.data.nextPageToken,
        loading: false,
        error: false
      })
    }).catch((response) => {
      this.setState({loading: false, error: true})
    })
  }

  loadExtraResults(event) {
    this.setState({loadingExtraResults: true, error: false})
    const {query, nextPageToken} = this.state
    axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        key: process.env.GATSBY_YOUTUBE_API_KEY,
        type: 'video',
        maxResults: '10',
        pageToken: nextPageToken
      }
    }).then((response) => {
      this.setState((prevState) => {
        const results = prevState.results.concat(response.data.items)
        return {
          results: results,
          totalResults: response.data.pageInfo.totalResults,
          nextPageToken: response.data.nextPageToken,
          loadingExtraResults: false,
          error: false
        }
      })
    }).catch((response) => {
      this.setState({
        loadingExtraResults: false,
        error: true
      })
    })
  }

  render() {
    const {
      lastSearchQuery, query, results, loading, error,
      loadingExtraResults, nextPageToken, totalResults
    } = this.state
    const { data } = this.props
    const searchDisabled = query === '' || query === lastSearchQuery
    const showLoadExtra = !loadingExtraResults &&
                                nextPageToken !== null &&
                                  nextPageToken !== undefined
    const showResultDescription = lastSearchQuery !== "" &&
                                    lastSearchQuery !== null &&
                                      lastSearchQuery !== undefined &&
                                        totalResults !== null &&
                                          totalResults !== undefined
    const resultCount = results.length
    return(
      <Layout>
        <Helmet>
          <title>Search {data.site.siteMetadata.title}</title>
        </Helmet>
        <div className={resultsStyles.container}>
          <Link to="/" className={resultsStyles.headerLink}>
            <h1 className={resultsStyles.header}>
              {data.site.siteMetadata.title}
            </h1>
          </Link>
          <div className={resultsStyles.description}>
            {data.site.siteMetadata.description}
          </div>
          <form className={resultsStyles.form}>
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
          {showResultDescription &&
            <div className={resultsStyles.showResultsText}>
              Showing {resultCount} out of {totalResults} results
              for "{lastSearchQuery}"
            </div>
          }
          {loading ?
            <div>
              Loading Results...
            </div>
            :
            <div>
              {results.map((result) => (
                <SearchResult
                  key={result.id.videoId}
                  result={result}/>
              ))}
              {showLoadExtra &&
                <button
                  onClick={this.loadExtraResults}
                  className={resultsStyles.loadMore}>
                  Load More
                </button>
              }
              {loadingExtraResults &&
                <div className={resultsStyles.loadMore}>
                  Loading More Results...
                </div>
              }
            </div>
          }
          {error &&
            <div>
              Error loading results :(
            </div>
          }
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
