import React from "react"
import { Helmet } from "react-helmet"
import Layout from "../components/layout.js"

export default class Watch extends React.Component {

  constructor(props) {
    super(props)
    this.state={
      mounted: false
    }
  }

  componentDidMount() {
    this.setState({mounted: true})
  }

  render() {
    const { data } = this.props
    const { mounted } = this.state
    const urlParams = new URLSearchParams(this.props.location.search)
    const videoId = urlParams.get('v') || ''
    const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
    const allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    return (
      <Layout>
        <Helmet>
          <title>Watch {data.site.siteMetadata.title}</title>
        </Helmet>
        <div style={{height: '100vh'}}>
          {mounted &&
            <iframe
              name="youtube-video-player"
              title="youtube-video-player"
              width="100%"
              height="100%"
              src={src}
              frameborder="0"
              allow={allow}
              allowfullscreen="true"/>
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
      }
    }
  }
`
