import React, { useState, useEffect } from 'react';
import { create } from 'zustand';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0; padding: 0;
    font-family: 'Inter', sans-serif;
    background-color: #fdfaf6;
    color: #3e2723;
  }
  * { box-sizing: border-box; }
`;

// --- State Management ---
const useStore = create((set) => ({
  cart: [],
  customerCount: 14,
  isOrdering: false,
  orderSuccess: false,
  addToCart: (product) => set((state) => {
    const existing = state.cart.find((item) => item.id === product.id);
    if (existing) {
      return { cart: state.cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) };
    }
    return { cart: [...state.cart, { ...product, quantity: 1 }] };
  }),
  removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),
  incrementVisitors: () => set((state) => ({ customerCount: state.customerCount + 1 })),
  processOrder: async () => {
    set({ isOrdering: true });
    // Simulate a 1.5s delay like a real network request
    await new Promise(resolve => setTimeout(resolve, 1500));
    set({ isOrdering: false, orderSuccess: true, cart: [] });
    // Reset success message after 5 seconds
    setTimeout(() => set({ orderSuccess: false }), 5000);
  }
}));

// --- Styled Components ---
const Navbar = styled.nav`
  background: #5d4037; color: #fff;
  padding: 1rem 5%; display: flex;
  justify-content: space-between; align-items: center;
  position: sticky; top: 0; z-index: 1000;
`;

const Hero = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #d35400 0%, #e67e22 100%);
  display: flex; flex-direction: column;
  justify-content: center; align-items: center; color: white;
`;

const Layout = styled.div`
  display: grid; grid-template-columns: 1fr 380px;
  gap: 30px; padding: 40px 5%; max-width: 1400px; margin: auto;
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const Card = styled.div`
  background: white; border-radius: 12px; padding: 20px;
  border: 1px solid #efebe9; display: flex; flex-direction: column;
  justify-content: space-between;
`;

const Grid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;
`;

const SidebarSection = styled.div`
  background: #fff; padding: 25px; border-radius: 15px;
  margin-bottom: 25px; border: 2px solid #5d4037;
  animation: ${fadeIn} 0.3s ease;
`;

const OrderStatus = styled.div`
  background: #e8f5e9; color: #2e7d32;
  padding: 15px; border-radius: 8px; margin-bottom: 20px;
  text-align: center; border: 1px solid #a5d6a7;
  animation: ${fadeIn} 0.4s ease-out;
`;

const CheckoutButton = styled.button`
  width: 100%; margin-top: 20px; padding: 15px;
  background: ${props => props.disabled ? '#bdc3c7' : '#2e7d32'};
  color: white; border: none; border-radius: 8px;
  font-weight: 800; cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  &:hover { opacity: ${props => props.disabled ? 1 : 0.9}; }
`;

// --- Data ---
const PRODUCTS = [
  { id: 1, name: 'Gloub Bidha (White)', price: 4.50, cat: 'Seeds' },
  { id: 2, name: 'Gloub Kahla (Black)', price: 2.50, cat: 'Seeds' },
  { id: 3, name: 'Salted Peanuts', price: 5.00, cat: 'Nuts' },
  { id: 4, name: 'Premium Almonds', price: 19.00, cat: 'Nuts' },
  { id: 5, name: 'Pistachios', price: 22.50, cat: 'Nuts' },
  { id: 6, name: 'Dried Figs', price: 11.00, cat: 'Fruits' },
];

export default function App() {
  const { cart, addToCart, removeFromCart, customerCount, isOrdering, orderSuccess, processOrder } = useStore();
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      <GlobalStyle />
      <Navbar>
        <div style={{fontWeight: '900', fontSize: '1.2rem'}}>TUNIS ROASTERY 🏮</div>
        <div style={{fontSize: '0.9rem'}}>Visitors: {customerCount}</div>
      </Navbar>

      <Hero>
        <h1>Freshly Roasted Today</h1>
        <p>Your favorite Tunisian "Gloub" and Nuts</p>
      </Hero>

      <Layout>
        <main>
          <h2 style={{borderLeft: '5px solid #d35400', paddingLeft: '15px', marginBottom: '25px'}}>Available Now</h2>
          <Grid>
            {PRODUCTS.map(p => (
              <Card key={p.id}>
                <div>
                  <small style={{color: '#d35400', fontWeight: 'bold'}}>{p.cat}</small>
                  <h3 style={{margin: '5px 0'}}>{p.name}</h3>
                  <p style={{fontWeight: '800'}}>{p.price.toFixed(3)} TND</p>
                </div>
                <button 
                  onClick={() => addToCart(p)}
                  style={{width: '100%', padding: '10px', background: '#3e2723', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
                >
                  Add to Bag
                </button>
              </Card>
            ))}
          </Grid>
        </main>

        <aside>
          {orderSuccess && (
            <OrderStatus>
              🎉 <strong>Mabrouk!</strong> Your order has been placed. Head to the shop for pickup!
            </OrderStatus>
          )}

          <SidebarSection>
            <h3 style={{marginTop: 0}}>Your Selection</h3>
            {cart.length === 0 ? (
              <p style={{color: '#8d6e63', textAlign: 'center'}}>Bag is empty</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee'}}>
                    <span>{item.name} x{item.quantity}</span>
                    <button onClick={() => removeFromCart(item.id)} style={{border: 'none', background: 'none', color: '#e74c3c', cursor: 'pointer'}}>×</button>
                  </div>
                ))}
                <div style={{marginTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold'}}>
                  <span>Total:</span>
                  <span>{total.toFixed(3)} TND</span>
                </div>
                <CheckoutButton 
                  disabled={isOrdering || cart.length === 0} 
                  onClick={processOrder}
                >
                  {isOrdering ? 'PROCESSING...' : 'PLACE ORDER FOR PICKUP'}
                </CheckoutButton>
              </>
            )}
          </SidebarSection>

          <SidebarSection style={{background: '#fef9e7', borderColor: '#f1c40f'}}>
            <h4 style={{marginTop: 0}}>Quick Info</h4>
            <p style={{fontSize: '0.85rem'}}>⚡ <strong>Instant Prep:</strong> Your order will be ready in 5 minutes.</p>
            <p style={{fontSize: '0.85rem'}}>🛑 <strong>Pickup Only:</strong> Please pay at the counter.</p>
          </SidebarSection>
        </aside>
      </Layout>

      <footer style={{textAlign: 'center', padding: '30px', color: '#7f8c8d'}}>
        © 2026 El Hammas Shop. No tobacco. No copyright issues. Just nuts.
      </footer>
    </>
  );
}