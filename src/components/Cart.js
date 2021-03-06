import LineItem from './LineItem';

export default function Cart ({ isCartOpen, handleCartClose, checkout, updateQuantityInCart, removeLineItemInCart }) {

    const openCheckout = () => {
        window.open(checkout.webUrl);
    }

    return (
        <div className={`Cart ${isCartOpen ? 'Cart--open' : ''}`}>
        <header className="Cart__header">
          <h2>Your cart</h2>
          <button
            onClick={handleCartClose}
            className="Cart__close">
            ×
          </button>
        </header>
        <ul className="Cart__line-items">
          {checkout.lineItems.map(line_item => <LineItem key={line_item.id.toString()} updateQuantityInCart={updateQuantityInCart} removeLineItemInCart={removeLineItemInCart} line_item={line_item} />)}
        </ul>
        <footer className="Cart__footer">
          <div className="Cart-info clearfix">
            <div className="Cart-info__total Cart-info__small">Subtotal</div>
            <div className="Cart-info__pricing">
              <span className="pricing">$ {checkout.subtotalPrice}</span>
            </div>
          </div>
          <div className="Cart-info clearfix">
            <div className="Cart-info__total Cart-info__small">Taxes</div>
            <div className="Cart-info__pricing">
              <span className="pricing">$ {checkout.totalTax}</span>
            </div>
          </div>
          <div className="Cart-info clearfix">
            <div className="Cart-info__total Cart-info__small">Total</div>
            <div className="Cart-info__pricing">
              <span className="pricing">$ {checkout.totalPrice}</span>
            </div>
          </div>
          <button className="Cart__checkout button" onClick={openCheckout}>Checkout</button>
        </footer>
      </div>
    )
}