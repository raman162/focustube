import React from "react"

export default class Watch extends React.Component {

  render() {
    const urlParams = new URLSearchParams(this.props.location.search)
    const videoId = urlParams.get('v') || ''
    const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
    const allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    return (
      <div style={{height: '100vh'}}>
        <iframe
          name="youtube-video-player"
          title="youtube-video-player"
          width="100%"
          height="100%"
          src={src}
          frameborder="0"
          allow={allow}
          allowfullscreen="true"/>
      </div>
    )
  }

}

