import React, { useState } from "react"
import { Link, graphql } from "gatsby"
import InfiniteScroll from "react-infinite-scroll-component"

export default function IndexPage({ data }) {
  const [loadedItemsLength, setLoadedItemsLength] = useState(10)
  return (
    <main className="overflow-x-hidden">
      <InfiniteScroll
        dataLength={loadedItemsLength}
        hasMore={loadedItemsLength < data.allNodeJson.totalCount}
        loader={<h4>Načítám...</h4>}
        next={() => {
          setLoadedItemsLength(prev => prev + 10)
        }}
      >
        {data.allNodeJson.nodes.slice(0, loadedItemsLength).map(node => (
          <article className="w-auto mt-2 mb-8" key={node.id}>
            <TimeLineEntry node={node} />
          </article>
        ))}
      </InfiniteScroll>
    </main>
  )
}

function TimeLineEntry({ node }) {
  const created = new Date(node.created * 1000)
  const updated = new Date(node.changed * 1000)
  return (
    <>
      <h3 className="font-bold text-xl hover:underline mb-1">
        <Link
          to={node.slugs[0].dst}
          dangerouslySetInnerHTML={{ __html: node.revision.title }}
        />
      </h3>
      <section
        className="prose"
        dangerouslySetInnerHTML={{ __html: node.revision.teaser }}
      />
      <div className="text-sm text-gray-700 flex flex-row gap-2">
        <span>{node.author.name}</span>
        <time dateTime={created.toISOString()}>{created.toISOString()}</time>
        {node.changed !== node.created && (
          <time dateTime={updated}>
            (aktualizováno {updated.toISOString()})
          </time>
        )}
        <Link
          className="ml-auto hover:underline text-black"
          to={node.slugs[0].dst}
        >
          číst dál
        </Link>
      </div>
    </>
  )
}

export const query = graphql`
  query IndexPageQuery {
    allNodeJson(
      filter: { type: { eq: "story" }, status: { eq: "1" } }
      sort: { fields: created, order: DESC }
    ) {
      nodes {
        slugs {
          dst
        }
        nid
        author {
          name
        }
        created
        changed
        revision {
          teaser
          title
        }
        id
      }
      totalCount
    }
  }
`

// <main className="overflow-x-hidden">
//   <InfiniteScroll
//     dataLength={loadedItemsLength}
//     hasMore={loadedItemsLength < data.allTimedEntry.edges.length}
//     loader={<h4>Načítám...</h4>}
//     next={() => {
//       setLoadedItemsLength((prev) => prev + 5);
//     }}
//   >
//     {data.allTimedEntry.edges
//       .slice(0, loadedItemsLength)
//       .map(({ node }) => (
//         <article className="w-auto mb-5" key={node.id}>
//           <TimeLineEntry node={node} />
//         </article>
//       ))}
//     {` `}
//   </InfiniteScroll>
// </main>

// export const query = graphql`
//   query IndexPageQuery {
//     allTimedEntry(sort: { fields: timestamp, order: DESC }) {
//       edges {
//         node {
//           children {
//             id
//             internal {
//               type
//             }
//             ... on InstagramMedia {
//               caption
//               permalink
//             }
//           }
//           id
//           timestamp
//         }
//       }
//       totalCount
//     }
//   }
// `;
