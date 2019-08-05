import React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

export default ({ children }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          author
          keywords
        }
      }
    }
  `)

  return(
    <React.Fragment>
      <Helmet>
        <title>{data.site.siteMetadata.title}</title>
        <meta
          name="description"
          content={data.site.siteMetadata.description}/>
        <meta
          name="author"
          content={data.site.siteMetadata.author}/>
        <meta
          name="keywords"
          content={data.site.siteMetadata.keywords}/>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"/>
      </Helmet>
      <style dangerouslySetInnerHTML={{__html: `
        body, html{
          margin: 0;
          padding: 0;
          font-family: helvetica;
        }
      `}}/>
      {children}
    </React.Fragment>
  )
}
