import React from "react"
import axios from "axios"
import { navigate, Link } from "gatsby"

export default class Search extends React.Component {

  constructor(props) {
    super(props)
    let query = this.currentQueryParam()
    this.state = {
      loading: query != '',
      results: [],
      query: query,
      initSearchQuery: query,
      loadingExtraResults: false
    }
    this.onQueryChange = this.onQueryChange.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.loadExtraResults = this.loadExtraResults.bind(this)
  }

  currentQueryParam() {
    const urlParams = new URLSearchParams(this.props.location.search)
    return urlParams.get('query') || ''
  }

  componentDidMount() {
    if (this.state.query != ''){this.fetchResults()}
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

  componentDidUpdate(prevProps, prevState, snapshot) {
    const prevUrlParams = new URLSearchParams(prevProps.location.search)
    const prevQuery = prevUrlParams.get('query') || ''
    if (prevQuery != this.currentQueryParam()) {
      this.setState({query: this.currentQueryParam()}, ()=> this.fetchResults())
    }
  }

  fetchResults() {
    const {query} = this.state
    this.setState({loading: true, results: [], lastSearchQuery: query})
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
        loading: false
      })
    })
  }

  loadExtraResults(event) {
    this.setState({loadingExtraResults: true})
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
          loadingExtraResults: false
        }
      })
    })
  }

  render() {
    const {
      lastSearchQuery, query, results, loading,
      loadingExtraResults, nextPageToken
    } = this.state
    const searchDisabled = query === '' || query === lastSearchQuery
    const showLoadExtra = !loadingExtraResults &&
                                nextPageToken !== null &&
                                  nextPageToken !== undefined
    return(
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
        <h1>Showing results for "{lastSearchQuery}"</h1>
        {loading ?
          <div>Loading Results...</div>
          :
          <div>
            {results.map((result) => (
              <Link
                to={`/watch?v=${result.id.videoId}`}
                key={result.id.videoId}>
                <div>
                  <div>{result.id.videoId} | {result.snippet.title}</div>
                  <img
                    src={result.snippet.thumbnails.medium.url}
                    style={{width: '300px'}}
                    alt='thumbnail'
                  />
                </div>
              </Link>
            ))} 
            {showLoadExtra &&
              <button
                onClick={this.loadExtraResults}>
                Load More
              </button>
            }
            {loadingExtraResults &&
              <div>Loading More Results...</div>
            }
          </div>
        }
      </div>
    )
  }

}
