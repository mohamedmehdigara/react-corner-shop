import React, { useState, useMemo } from 'react';
import { create } from 'zustand';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';

// --- State Management ---
const useStore = create((set) => ({
  cart: [],
  isOrdering: false,
  orderSuccess: false,
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  addToCart: (product) => set((state) => {
    const existing = state.cart.find((item) => item.id === product.id);
    if (existing) {
      return { cart: state.cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) };
    }
    return { cart: [...state.cart, { ...product, quantity: 1 }] };
  }),
  removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),
  processOrder: async () => {
    set({ isOrdering: true });
    await new Promise(r => setTimeout(r, 1500));
    set({ isOrdering: false, orderSuccess: true, cart: [] });
    setTimeout(() => set({ orderSuccess: false }), 5000);
  }
}));

// --- Styles ---
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0; padding: 0;
    transition: all 0.3s ease;
    background-color: ${props => props.dark ? '#1a1a1a' : '#fdfaf6'};
    color: ${props => props.dark ? '#fdfaf6' : '#3e2723'};
    font-family: 'Inter', sans-serif;
  }
  * { box-sizing: border-box; }
`;

const scroll = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

const Ticker = styled.div`
  background: #d35400; color: white; padding: 8px 0; overflow: hidden; white-space: nowrap;
  div { display: inline-block; animation: ${scroll} 20s linear infinite; font-weight: bold; }
`;

const Nav = styled.nav`
  background: #3e2723; color: white; padding: 1rem 5%; display: flex; 
  justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100;
`;

const SearchInput = styled.input`
  padding: 10px 15px; border-radius: 20px; border: none; width: 300px;
  @media (max-width: 600px) { width: 150px; }
`;

const Grid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 15px;
  padding: 20px 0;
`;

const ProductCard = styled.div`
  background: ${props => props.dark ? '#2d2d2d' : 'white'};
  border: 1px solid ${props => props.dark ? '#444' : '#efebe9'};
  border-radius: 12px; padding: 15px; display: flex; flex-direction: column; justify-content: space-between;
  &:hover { border-color: #d35400; }
`;

const Layout = styled.div`
  display: grid; grid-template-columns: 1fr 350px; gap: 30px; padding: 20px 5%;
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const Button = styled.button`
  background: #d35400; color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer;
  font-weight: bold; width: 100%; &:hover { background: #a04000; }
`;

// --- The Master List (60+ Items) ---
const PRODUCTS = [
  // SEEDS
  { id: 1, name: 'White Gloub (Salted)', price: 4.5, cat: 'Seeds' },
  { id: 2, name: 'Black Gloub (Large)', price: 2.8, cat: 'Seeds' },
  { id: 3, name: 'Egyptian Gloub (Red)', price: 3.5, cat: 'Seeds' },
  { id: 4, name: 'Pumpkin Seeds (Small)', price: 6.0, cat: 'Seeds' },
  { id: 5, name: 'Spiced Sunflower', price: 4.2, cat: 'Seeds' },
  { id: 6, name: 'Watermelon Seeds', price: 5.0, cat: 'Seeds' },
  // NUTS
  { id: 7, name: 'Pistachios (Salted)', price: 26.0, cat: 'Nuts' },
  { id: 8, name: 'Almonds (Smoked)', price: 19.5, cat: 'Nuts' },
  { id: 9, name: 'Hazelnuts (Roasted)', price: 17.0, cat: 'Nuts' },
  { id: 10, name: 'Cashews (Chilli)', price: 23.0, cat: 'Nuts' },
  { id: 11, name: 'Walnuts (Half)', price: 15.0, cat: 'Nuts' },
  { id: 12, name: 'Peanuts (In Shell)', price: 5.0, cat: 'Nuts' },
  { id: 13, name: 'Peanuts (Red Skin)', price: 5.5, cat: 'Nuts' },
  { id: 14, name: 'Pecans', price: 28.0, cat: 'Nuts' },
  { id: 15, name: 'Macadamias', price: 35.0, cat: 'Nuts' },
  // SNACKS & LEGUMES
  { id: 16, name: 'Chickpeas (Hommos)', price: 3.5, cat: 'Snacks' },
  { id: 17, name: 'Spicy Chickpeas', price: 4.0, cat: 'Snacks' },
  { id: 18, name: 'Sugared Chickpeas', price: 4.5, cat: 'Snacks' },
  { id: 19, name: 'Corn Crunch (Salty)', price: 3.8, cat: 'Snacks' },
  { id: 20, name: 'Lupin (Tirmis)', price: 4.0, cat: 'Snacks' },
  { id: 21, name: 'Rice Cracker Mix', price: 7.0, cat: 'Snacks' },
  { id: 22, name: 'Fava Beans', price: 3.5, cat: 'Snacks' },
  // FRUITS
  { id: 23, name: 'Deglet Nour Dates', price: 10.0, cat: 'Fruits' },
  { id: 24, name: 'Dried Figs', price: 12.0, cat: 'Fruits' },
  { id: 25, name: 'Dried Apricots', price: 14.0, cat: 'Fruits' },
  { id: 26, name: 'Golden Raisins', price: 8.5, cat: 'Fruits' },
  { id: 27, name: 'Dried Pineapple', price: 16.0, cat: 'Fruits' },
  { id: 28, name: 'Dried Mango', price: 18.0, cat: 'Fruits' },
  // SWEETS
  { id: 29, name: 'Halwa Plain', price: 6.5, cat: 'Sweets' },
  { id: 30, name: 'Halwa Pistachio', price: 9.5, cat: 'Sweets' },
  { id: 31, name: 'Gummy Bears', price: 3.0, cat: 'Sweets' },
  { id: 32, name: 'Nougat Almond', price: 12.0, cat: 'Sweets' },
  { id: 33, name: 'Sesame Snaps', price: 2.5, cat: 'Sweets' },
  { id: 34, name: 'Chocolate Peanuts', price: 7.0, cat: 'Sweets' },
  { id: 35, name: 'Fruit Lollipops', price: 0.5, cat: 'Sweets' },
  { id: 36, name: 'Turkish Delight', price: 11.0, cat: 'Sweets' },
  // BISCUITS
  { id: 37, name: 'Saida Classic', price: 1.2, cat: 'Biscuits' },
  { id: 38, name: 'Prince Chocolate', price: 2.5, cat: 'Biscuits' },
  { id: 39, name: 'Major Strawberry', price: 1.5, cat: 'Biscuits' },
  { id: 40, name: 'Galette Biscuits', price: 2.0, cat: 'Biscuits' },
  { id: 41, name: 'Wafers (Vanilla)', price: 1.8, cat: 'Biscuits' },
  // DRINKS
  { id: 42, name: 'Selecto (1.5L)', price: 2.5, cat: 'Drinks' },
  { id: 43, name: 'Boga White', price: 2.2, cat: 'Drinks' },
  { id: 44, name: 'Boga Cidre', price: 2.2, cat: 'Drinks' },
  { id: 45, name: 'Apla Juice', price: 2.8, cat: 'Drinks' },
  { id: 46, name: 'Safia Water', price: 0.8, cat: 'Drinks' },
  { id: 47, name: 'Cold Milk (Bottle)', price: 1.6, cat: 'Drinks' },
  { id: 48, name: 'Viva Energy Drink', price: 3.0, cat: 'Drinks' },
  // PANTRY / ESSENTIALS
  { id: 49, name: 'Canned Harissa', price: 1.5, cat: 'Pantry' },
  { id: 50, name: 'Tomato Paste', price: 1.2, cat: 'Pantry' },
  { id: 51, name: 'Couscous (1kg)', price: 2.0, cat: 'Pantry' },
  { id: 52, name: 'Spaghetti n°2', price: 1.1, cat: 'Pantry' },
  { id: 53, name: 'Vegetable Oil', price: 4.5, cat: 'Pantry' },
  { id: 54, name: 'Salt (Table)', price: 0.5, cat: 'Pantry' },
  { id: 55, name: 'Sugar (1kg)', price: 1.8, cat: 'Pantry' },
  // MISC
  { id: 56, name: 'Pocket Tissues', price: 0.5, cat: 'Misc' },
  { id: 57, name: 'Matches', price: 0.3, cat: 'Misc' },
  { id: 58, name: 'Disposable Lighter', price: 1.0, cat: 'Misc' },
  { id: 59, name: 'Soap Bar', price: 1.5, cat: 'Misc' },
  { id: 60, name: 'Phone Card (5DT)', price: 5.4, cat: 'Misc' }
];

export default function App() {
  const { cart, addToCart, removeFromCart, isOrdering, orderSuccess, processOrder, isDarkMode, toggleDarkMode } = useStore();
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() => 
    PRODUCTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase())), [search]);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      <GlobalStyle dark={isDarkMode} />
      <Ticker>
        <div>🔥 FRESH BATCH: Salted Almonds just out of the roaster! • 🌙 OPEN LATE: We close at 3:00 AM tonight • 🥜 NEW: Spiced Pumpkin Seeds available now!</div>
      </Ticker>
      <Nav>
        <h2 style={{margin: 0}}>EL HAMMAS 🏮</h2>
        <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
          <SearchInput placeholder="Search gloub, nuts, drinks..." onChange={(e) => setSearch(e.target.value)} />
          <button onClick={toggleDarkMode} style={{background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem'}}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </Nav>

      <Layout>
        <main>
          {['Seeds', 'Nuts', 'Snacks', 'Fruits', 'Sweets', 'Biscuits', 'Drinks', 'Pantry', 'Misc'].map(cat => {
            const catItems = filteredItems.filter(p => p.cat === cat);
            if (catItems.length === 0) return null;
            return (
              <div key={cat}>
                <h3 style={{borderLeft: '4px solid #d35400', paddingLeft: '10px', marginTop: '30px'}}>{cat}</h3>
                <Grid>
                  {catItems.map(p => (
                    <ProductCard key={p.id} dark={isDarkMode}>
                      <div>
                        <h4 style={{margin: '0 0 5px 0'}}>{p.name}</h4>
                        <p style={{fontWeight: 'bold', color: '#d35400'}}>{p.price.toFixed(3)} TND</p>
                      </div>
                      <Button onClick={() => addToCart(p)}>+ Add</Button>
                    </ProductCard>
                  ))}
                </Grid>
              </div>
            );
          })}
        </main>

        <aside>
          <div style={{background: isDarkMode ? '#2d2d2d' : 'white', padding: '20px', borderRadius: '15px', position: 'sticky', top: '100px', border: '1px solid #efebe9'}}>
            <h3>Your Bag</h3>
            {orderSuccess && <p style={{color: 'green', textAlign: 'center'}}>✅ Order Successful!</p>}
            {cart.map(item => (
              <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem'}}>
                <span>{item.name} x{item.quantity}</span>
                <button onClick={() => removeFromCart(item.id)} style={{background: 'none', border: 'none', color: 'red', cursor: 'pointer'}}>×</button>
              </div>
            ))}
            <hr />
            <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem'}}>
              <span>Total:</span>
              <span>{total.toFixed(3)} TND</span>
            </div>
            <Button disabled={isOrdering || cart.length === 0} onClick={processOrder} style={{marginTop: '15px', background: '#27ae60'}}>
              {isOrdering ? 'PROCESSING...' : 'ORDER FOR PICKUP'}
            </Button>
          </div>
        </aside>
      </Layout>
    </>
  );
}