const fetch = require('node-fetch');

const query = `
{
  products(first: 20) {
    edges {
      node {
        id
        title
      }
    }
  }
}
`;

fetch('https://aveam-clothing.myshopify.com/api/2024-01/graphql.json', {
    method: 'POST',
    headers: {
        'X-Shopify-Storefront-Access-Token': '031cbd799586da1b5f9ced2164f37f73',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query })
})
.then(res => res.json())
.then(data => console.log(JSON.stringify(data, null, 2)))
.catch(err => console.error(err));
