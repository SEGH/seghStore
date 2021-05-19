import Client from 'shopify-buy';

// Initializing client to return content
const client = Client.buildClient({
    domain: 'seghland.myshopify.com',
    storefrontAccessToken: process.env.REACT_APP_SHOPIFY_API_TOKEN
});

export default client;