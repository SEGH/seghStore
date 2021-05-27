import { useState, useEffect } from 'react';
import './App.css';
import sanityClient from './client';
import client from './shopify';
import Cart from './components/Cart';
import { Base64 } from 'base64-string';

function App() {
  const [products, setProducts] = useState(null);
  const [checkout, setCheckout] = useState({ lineItems: [] });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    client.checkout.create().then(res => setCheckout(res)).catch(err => console.log(err));

    client.product.fetchAll().then(shopifyProducts => {
      sanityClient.fetch(
        `*[_type == 'product']{...}`
      ).then(sanityProducts => {
        // console.log(sanityProducts)
        const allProducts = []
        shopifyProducts.forEach(product => {
          const enc = new Base64()
          const productID = parseInt(enc.decode(product.id).split('gid://shopify/Product/')[1])
          const productDetails = sanityProducts.filter(productDetails => productDetails.productID === productID)[0]
          // console.log(productDetails)
          const productData = {
            ...product,
            ...productDetails
          }
          // console.log(productData)
          allProducts.push(productData);
        })

        setProducts(allProducts)
        // setSelectedProduct(products[0])
      }).catch(err => console.log(err));

    }).catch(err => console.log(err));

  }, []);

  const handleCartClose = () => setIsCartOpen(false);

  const updateQuantityInCart = (lineItemId, quantity) => {
    const checkoutId = checkout.id;
    const lineItemsToUpdate = [{ id: lineItemId, quantity: parseInt(quantity, 10)}]

    return client.checkout.updateLineItems(checkoutId, lineItemsToUpdate).then(res => setCheckout(res));
  }

  const removeLineItemInCart = lineItemId => {
    const checkoutId = checkout.id;
    
    return client.checkout.removeLineItems(checkoutId, [lineItemId]).then(res => setCheckout(res));
  }

  const addVariantToCart = (id, quantity) => {
    setIsCartOpen(true);

    const lineItemsToAdd = [{variantId: id, quantity: parseInt(quantity, 10)}]
    const checkoutId = checkout.id

    return client.checkout.addLineItems(checkoutId, lineItemsToAdd).then(res => setCheckout(res)).catch(err => console.log(err));
  }

  const selectVariant = (product) => {
    const selectedVariant = client.product.helpers.variantForOptions(product, {[product.options[0].name]: product.options[0].values[0]});
    console.log(selectedVariant)
    return selectedVariant.id
  }

  // console.log(checkout)
  console.log(products)

  return (
    <div className="App">
      {products && products.map(product => <p key={product.id} onClick={() => addVariantToCart(product.variants[0].id, 1)}>{product.title}</p>)}
      <Cart checkout={checkout} isCartOpen={isCartOpen} handleCartClose={handleCartClose} updateQuantityInCart={updateQuantityInCart} removeLineItemInCart={removeLineItemInCart} />
    </div>
  );
}

export default App;
