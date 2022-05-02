import React from "react"
import { graphql } from "gatsby"

export default function Story({ data }) {
  const story = data.nodeJson
  const created = new Date(story.created * 1000)
  const updated = new Date(story.changed * 1000)
  return (
    <main>
      <header className="mb-4">
        <h1 className="font-bold text-2xl">{story.revision.title}</h1>
        <div className="text-sm text-gray-700 flex flex-row gap-2">
          <span>{story.author.name}</span>
          <time dateTime={created.toISOString()}>{created.toISOString()}</time>
          {story.changed !== story.created && (
            <time dateTime={updated.toISOString()}>
              (aktualizováno {updated.toISOString()})
            </time>
          )}
        </div>
      </header>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: story.revision.body }}
      />
    </main>
  )
}

export const query = graphql`
  query Story($nid: String!) {
    nodeJson(nid: { eq: $nid }) {
      id
      created
      changed
      vid
      uid
      revision {
        vid
        teaser
        format
        body
        title
      }
      sticky
      status
      type
      slugs {
        dst
      }
      nid
      author {
        name
      }
    }
  }
`
