import React from "react";
import Routes from "./Routes";
import { BrowserRouter as Router } from "react-router-dom";
import { CartProvider } from './CartContext'; // Импортируйте CartProvider

function App() {
  return (
  <CartProvider>
    <Router>
      <Routes />
    </Router>
  </CartProvider>

  );
}

export default App;
