exports.createSchemaCustomization = function createSchemaCustomization({
  actions,
  schema,
}) {
  const { createTypes } = actions
  const typeDefs = [
    schema.buildObjectType({
      name: `UrlAliasJson`,
      fields: {
        nid: {
          type: `String`,
          resolve: (source, args, context, info) => {
            // console.log(source, args, context, info);
            return source?.src.match(/^node\/([0-9]+)$/)?.[1] ?? null
          },
        },
      },
      interfaces: [`Node`],
    }),
    `
      type NodeJson implements Node {
        revision: NodeRevisionsJson @link(by: "vid", from: "vid")
        author: UsersJson @link(by: "uid", from: "uid")
        slugs: [UrlAliasJson] @link(by: "nid", from: "nid")
      }
    `,
  ]
  createTypes(typeDefs)
}

exports.createPages = async function ({ actions, graphql }) {
  const { data } = await graphql(`
    query {
      allNodeJson(
        filter: { type: { in: ["story", "page"] }, status: { eq: "1" } }
      ) {
        nodes {
          slugs {
            dst
            src
          }
          nid
        }
      }
    }
  `)
  const Story = require.resolve(`./src/templates/story.js`)
  data.allNodeJson.nodes.forEach(node => {
    node.slugs.forEach(slug => {
      actions.createPage({
        path: slug.dst,
        component: Story,
        context: { nid: node.nid },
      })
      actions.createRedirect({
        fromPath: slug?.src?.startsWith(`/`) ? slug.src : `/` + slug?.src,
        toPath: slug?.dst?.startsWith(`/`) ? slug.dst : `/` + slug?.dst,
      })
    })
  })
}
