import React from "react"

export default ({ children }) => (
  <React.Fragment>
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
