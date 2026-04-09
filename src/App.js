import React, { useState, useMemo, useEffect, useRef } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';

// --- State Management with Persistence ---
const useStore = create(
  persist(
    (set) => ({
      cart: [],
      isDarkMode: false,
      lastOrder: null,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      addToCart: (product) => set((state) => {
        const existing = state.cart.find((item) => item.id === product.id);
        if (existing) {
          return { cart: state.cart.map((item) => 
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) };
        }
        return { cart: [...state.cart, { ...product, quantity: 1 }] };
      }),
      decrementItem: (id) => set((state) => ({
        cart: state.cart.map(item => 
          item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item)
      })),
      removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),
      clearCart: () => set({ cart: [] }),
      setLastOrder: (order) => set({ lastOrder: order }),
    }),
    { name: 'hammas-storage' }
  )
);

// --- Styles & Animations ---
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0; padding: 0;
    transition: background 0.3s ease;
    background-color: ${props => props.dark ? '#121212' : '#fcfaf7'};
    color: ${props => props.dark ? '#f0f0f0' : '#2d1b15'};
    font-family: 'Poppins', sans-serif;
  }
  * { box-sizing: border-box; scroll-behavior: smooth; }
`;

const slideIn = keyframes`from { transform: translateX(100%); } to { transform: translateX(0); }`;

const Nav = styled.nav`
  background: #3e2723; color: white; padding: 1rem 5%;
  display: flex; justify-content: space-between; align-items: center;
  position: sticky; top: 0; z-index: 1000; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
`;

const SearchBar = styled.input`
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
  color: white; padding: 10px 20px; border-radius: 25px; width: 300px;
  &::placeholder { color: #ccc; }
  &:focus { outline: none; background: rgba(255,255,255,0.2); }
`;

const CategoryBar = styled.div`
  display: flex; gap: 10px; overflow-x: auto; padding: 15px 5%;
  background: ${props => props.dark ? '#1e1e1e' : '#fff'};
  position: sticky; top: 60px; z-index: 900;
  &::-webkit-scrollbar { display: none; }
`;

const Chip = styled.button`
  background: ${props => props.active ? '#d35400' : 'transparent'};
  color: ${props => props.active ? '#white' : (props.dark ? '#ccc' : '#3e2723')};
  border: 1px solid #d35400; padding: 6px 18px; border-radius: 20px;
  cursor: pointer; white-space: nowrap; font-weight: 600;
  &:hover { background: #d35400; color: white; }
`;

const ProductGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;
`;

const ProductCard = styled.div`
  background: ${props => props.dark ? '#252525' : 'white'};
  border-radius: 16px; padding: 20px; border: 1px solid ${props => props.dark ? '#333' : '#eee'};
  display: flex; flex-direction: column; transition: 0.3s;
  &:hover { transform: translateY(-5px); border-color: #d35400; }
`;

const Price = styled.span`
  font-size: 1.2rem; font-weight: 800; color: #d35400;
`;

const ActionButton = styled.button`
  background: ${props => props.color || '#d35400'};
  color: white; border: none; padding: 12px; border-radius: 8px;
  font-weight: 700; cursor: pointer; transition: 0.2s;
  &:hover { opacity: 0.9; transform: scale(1.02); }
  &:disabled { background: #ccc; cursor: not-allowed; }
`;

const CartSidebar = styled.div`
  background: ${props => props.dark ? '#1e1e1e' : 'white'};
  padding: 25px; border-radius: 20px; border: 1px solid ${props => props.dark ? '#333' : '#eee'};
  height: fit-content; position: sticky; top: 130px;
`;

const Toast = styled.div`
  position: fixed; bottom: 20px; right: 20px; background: #27ae60;
  color: white; padding: 15px 25px; border-radius: 10px;
  animation: ${slideIn} 0.3s ease; z-index: 2000;
`;

// --- The Complete Inventory (80+ Items) ---
const PRODUCTS = [
  // SEEDS (The Legends)
  { id: 1, name: 'Gloub Bidha (Salted)', price: 4.5, cat: 'Seeds' },
  { id: 2, name: 'Gloub Kahla (Black)', price: 2.8, cat: 'Seeds' },
  { id: 3, name: 'Egyptian Red Seeds', price: 3.5, cat: 'Seeds' },
  { id: 4, name: 'Pumpkin Seeds (Qaraa)', price: 7.2, cat: 'Seeds' },
  { id: 5, name: 'Spiced Sunflower', price: 4.2, cat: 'Seeds' },
  { id: 6, name: 'Salted Watermelon Seeds', price: 5.0, cat: 'Seeds' },
  { id: 7, name: 'Gloub Bidha (No Salt)', price: 4.5, cat: 'Seeds' },
  
  // NUTS
  { id: 8, name: 'Pistachios (Roasted)', price: 26.0, cat: 'Nuts' },
  { id: 9, name: 'Almonds (Smoked)', price: 19.5, cat: 'Nuts' },
  { id: 10, name: 'Hazelnuts (Bofriwa)', price: 17.5, cat: 'Nuts' },
  { id: 11, name: 'Cashews (Salty)', price: 24.0, cat: 'Nuts' },
  { id: 12, name: 'Walnuts (Shelled)', price: 16.0, cat: 'Nuts' },
  { id: 13, name: 'Peanuts (Kakawia)', price: 5.5, cat: 'Nuts' },
  { id: 14, name: 'Honey Glazed Almonds', price: 21.0, cat: 'Nuts' },
  { id: 15, name: 'Macadamias', price: 38.0, cat: 'Nuts' },
  { id: 16, name: 'Pecans', price: 30.0, cat: 'Nuts' },
  { id: 17, name: 'Mixed Deluxe Nuts', price: 22.0, cat: 'Nuts' },

  // LEGUMES & CRUNCH
  { id: 18, name: 'Roasted Hommos', price: 3.5, cat: 'Snacks' },
  { id: 19, name: 'Mlabbes (Sugared Hommos)', price: 4.5, cat: 'Snacks' },
  { id: 20, name: 'Corn Nuts (Chili)', price: 4.0, cat: 'Snacks' },
  { id: 21, name: 'Tirmis (Lupin)', price: 4.2, cat: 'Snacks' },
  { id: 22, name: 'Fava Beans (Roasted)', price: 3.8, cat: 'Snacks' },
  { id: 23, name: 'Rice Crackers Mix', price: 7.5, cat: 'Snacks' },

  // TRADITIONAL SWEETS
  { id: 24, name: 'Halwa Chamia (Plain)', price: 6.5, cat: 'Sweets' },
  { id: 25, name: 'Halwa Chamia (Pistachio)', price: 10.5, cat: 'Sweets' },
  { id: 26, name: 'Traditional Nougat', price: 12.0, cat: 'Sweets' },
  { id: 27, name: 'Sesame Snaps', price: 2.5, cat: 'Sweets' },
  { id: 28, name: 'Gummy Bears (Briket)', price: 3.5, cat: 'Sweets' },
  { id: 29, name: 'Chocolate Toffee', price: 0.5, cat: 'Sweets' },
  { id: 30, name: 'Zgougou Paste (Seasonal)', price: 45.0, cat: 'Sweets' },

  // DRINKS (Gazouza)
  { id: 31, name: 'Selecto (1.5L)', price: 2.6, cat: 'Drinks' },
  { id: 32, name: 'Boga White (1.5L)', price: 2.3, cat: 'Drinks' },
  { id: 33, name: 'Boga Cidre', price: 2.3, cat: 'Drinks' },
  { id: 34, name: 'Coca Cola (Glass)', price: 1.8, cat: 'Drinks' },
  { id: 35, name: 'Apla Apple Juice', price: 3.0, cat: 'Drinks' },
  { id: 36, name: 'Safia Water (1.5L)', price: 0.9, cat: 'Drinks' },
  { id: 37, name: 'Sabrine Water (0.5L)', price: 0.6, cat: 'Drinks' },
  { id: 38, name: 'Viva Energy', price: 3.2, cat: 'Drinks' },

  // PANTRY & EMERGENCY
  { id: 39, name: 'Harissa Diari (Small)', price: 2.5, cat: 'Pantry' },
  { id: 40, name: 'Canned Tomato Paste', price: 1.4, cat: 'Pantry' },
  { id: 41, name: 'Couscous Fine (1kg)', price: 2.2, cat: 'Pantry' },
  { id: 42, name: 'Pasta n°2 (Makrouna)', price: 1.2, cat: 'Pantry' },
  { id: 43, name: 'Vegetable Oil (1L)', price: 5.0, cat: 'Pantry' },
  { id: 44, name: 'Table Salt', price: 0.5, cat: 'Pantry' },
  { id: 45, name: 'Refined Sugar (1kg)', price: 2.0, cat: 'Pantry' },
  { id: 46, name: 'Green Tea (Box)', price: 3.5, cat: 'Pantry' },
  { id: 47, name: 'Coffee Powder (100g)', price: 4.8, cat: 'Pantry' },

  // HOUSEHOLD & MISC
  { id: 48, name: 'Pocket Tissues', price: 0.5, cat: 'Misc' },
  { id: 49, name: 'Disposable Lighter', price: 1.2, cat: 'Misc' },
  { id: 50, name: 'Box of Matches', price: 0.3, cat: 'Misc' },
  { id: 51, name: 'Soap (Saboun Lakhdar)', price: 1.8, cat: 'Misc' },
  { id: 52, name: 'Ooredoo 5DT Recharge', price: 5.4, cat: 'Misc' },
  { id: 53, name: 'Telecom 10DT Recharge', price: 10.8, cat: 'Misc' },
  { id: 54, name: 'Plastic Plates (Set)', price: 4.5, cat: 'Misc' },
  { id: 55, name: 'Cleaning Sponge', price: 1.0, cat: 'Misc' },
  { id: 56, name: 'Emergency Candles', price: 2.0, cat: 'Misc' }
];

export default function App() {
  const store = useStore();
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [showToast, setShowToast] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);

  // Shop Status Logic
  const currentHour = new Date().getHours();
  const isOpen = currentHour >= 8 || currentHour <= 3;

  const categories = ['All', 'Seeds', 'Nuts', 'Snacks', 'Sweets', 'Drinks', 'Pantry', 'Misc'];

  const filteredItems = useMemo(() => {
    return PRODUCTS.filter(p => 
      (activeCat === 'All' || p.cat === activeCat) &&
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, activeCat]);

  const total = store.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleAdd = (p) => {
    store.addToCart(p);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleCheckout = async () => {
    setIsOrdering(true);
    await new Promise(r => setTimeout(r, 2000)); // Simulate API
    store.setLastOrder(store.cart);
    store.clearCart();
    setIsOrdering(false);
    alert("Order Successful! Your items are reserved at the counter. 🏮");
  };

  return (
    <>
      <GlobalStyle dark={store.isDarkMode} />
      
      <Nav>
        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
          <h1 style={{fontSize:'1.5rem', margin:0}}>HAMMAS PRO 🏮</h1>
          <span style={{fontSize:'0.8rem', padding:'4px 10px', borderRadius:'10px', background: isOpen ? '#27ae60' : '#c0392b'}}>
            {isOpen ? 'OPEN UNTIL 3 AM' : 'CLOSED'}
          </span>
        </div>
        <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
          <SearchBar 
            placeholder="Search nuts, seeds, drinks..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={store.toggleDarkMode} style={{background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer'}}>
            {store.isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </Nav>

      <CategoryBar dark={store.isDarkMode}>
        {categories.map(cat => (
          <Chip 
            key={cat} 
            active={activeCat === cat} 
            dark={store.isDarkMode}
            onClick={() => setActiveCat(cat)}
          >
            {cat}
          </Chip>
        ))}
      </CategoryBar>

      <div style={{padding: '0 5% 50px 5%', maxWidth: '1600px', margin: 'auto'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 380px', gap:'40px', marginTop:'30px'}}>
          
          <main>
            <h2 style={{marginBottom:'25px'}}>{activeCat} Selection</h2>
            <ProductGrid>
              {filteredItems.map(p => (
                <ProductCard key={p.id} dark={store.isDarkMode}>
                  <div>
                    <small style={{color:'#d35400', fontWeight:'bold'}}>{p.cat}</small>
                    <h4 style={{margin:'5px 0 15px 0', minHeight:'40px'}}>{p.name}</h4>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <Price>{p.price.toFixed(3)}</Price>
                    <ActionButton onClick={() => handleAdd(p)} style={{padding:'8px 15px', fontSize:'0.8rem'}}>
                      + ADD
                    </ActionButton>
                  </div>
                </ProductCard>
              ))}
            </ProductGrid>
          </main>

          <aside>
            <CartSidebar dark={store.isDarkMode}>
              <h3 style={{marginTop:0, borderBottom:'1px solid #ddd', paddingBottom:'15px'}}>Your Qortas</h3>
              {store.cart.length === 0 ? (
                <div style={{textAlign:'center', padding:'40px 0', color:'#888'}}>
                  <p>Your bag is empty. Start adding some gloub!</p>
                </div>
              ) : (
                <>
                  <div style={{maxHeight:'400px', overflowY:'auto'}}>
                    {store.cart.map(item => (
                      <div key={item.id} style={{display:'flex', justifyContent:'space-between', padding:'15px 0', borderBottom:'1px solid #eee'}}>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:'bold', fontSize:'0.9rem'}}>{item.name}</div>
                          <div style={{display:'flex', alignItems:'center', gap:'10px', marginTop:'5px'}}>
                            <button onClick={() => store.decrementItem(item.id)} style={{border:'1px solid #ccc', borderRadius:'4px', padding:'2px 8px'}}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => store.addToCart(item)} style={{border:'1px solid #ccc', borderRadius:'4px', padding:'2px 8px'}}>+</button>
                          </div>
                        </div>
                        <div style={{textAlign:'right'}}>
                          <div style={{fontWeight:'800'}}>{(item.price * item.quantity).toFixed(3)}</div>
                          <button onClick={() => store.removeFromCart(item.id)} style={{color:'red', border:'none', background:'none', fontSize:'0.7rem', cursor:'pointer'}}>REMOVE</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:'25px', padding:'20px', background: store.isDarkMode ? '#333' : '#f9f9f9', borderRadius:'12px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                      <span>Subtotal</span>
                      <strong>{total.toFixed(3)} TND</strong>
                    </div>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px', fontSize:'0.8rem', color:'#d35400'}}>
                      <span>Est. Prep Time</span>
                      <span>~5-10 Mins</span>
                    </div>
                    <ActionButton 
                      disabled={isOrdering} 
                      onClick={handleCheckout} 
                      color="#27ae60" 
                      style={{width:'100%'}}
                    >
                      {isOrdering ? 'PREPARING...' : 'CONFIRM ORDER'}
                    </ActionButton>
                    <button onClick={store.clearCart} style={{width:'100%', background:'none', border:'none', marginTop:'15px', color:'#888', cursor:'pointer', fontSize:'0.8rem'}}>
                      Clear Bag
                    </button>
                  </div>
                </>
              )}
            </CartSidebar>
          </aside>
        </div>
      </div>

      {showToast && <Toast>Added to Qortas! 🥜</Toast>}

      <footer style={{textAlign:'center', padding:'50px', background:'#3e2723', color:'#8d6e63', marginTop:'100px'}}>
        <p>© 2026 El Hammas Pro - 100% Traditional, 100% Tobacco-Free.</p>
        <p style={{fontSize:'0.8rem', opacity:0.6}}>Tunis, Tunisia • Real-time Roasting</p>
      </footer>
    </>
  );
}