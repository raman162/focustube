import React from "react"
import { Link } from "gatsby"
import searchResultStyles from "./search_result.module.css"

export default ({result}) => (
  <div className={searchResultStyles.container}>
    <Link
      to={`/watch?v=${result.id.videoId}`}>
      <div>
        <div className={searchResultStyles.title}>
          {result.snippet.title}
        </div>
        <img
          src={result.snippet.thumbnails.medium.url}
          className={searchResultStyles.thumbnail}
          alt='thumbnail'
        />
      </div>
    </Link>
  </div>
)
