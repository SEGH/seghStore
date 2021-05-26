import { useState, useEffect } from 'react';
import './App.css';
import sanityClient from './client';
import client from './shopify';
import Cart from './components/Cart';

function App() {
  const [products, setProducts] = useState(null);
  const [checkout, setCheckout] = useState({ lineItems: [] });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    sanityClient.fetch(
      `*[_type == 'product']{...}`
    ).then(data => setProducts(data)).catch(err => console.log(err));

    client.checkout.create().then(res => setCheckout(res)).catch(err => console.log(err));

    client.product.fetchAll().then(products => {
      console.log(products)
      setSelectedProduct(products[0])
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

  const selectVariant = () => {
    const selectedVariant = client.product.helpers.variantForOptions(selectedProduct, { Size: "S"});
    console.log(selectedVariant)
    return selectedVariant.id
  }

  console.log(checkout)
  console.log(products)

  return (
    <div className="App">
      {products && products.map(product => <p onClick={() => addVariantToCart(selectVariant(), 1)}>{product.title}</p>)}
      <Cart checkout={checkout} isCartOpen={isCartOpen} handleCartClose={handleCartClose} updateQuantityInCart={updateQuantityInCart} removeLineItemInCart={removeLineItemInCart} />
    </div>
  );
}

export default App;
