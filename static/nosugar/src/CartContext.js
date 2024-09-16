



// import React, { createContext, useState } from 'react';

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);
//   const [user, setUser] = useState({});
//   const [comment, setComment] = useState('');
//   const [selectedAddress, setSelectedAddress] = useState('');
//   const [selectedTime, setSelectedTime] = useState('');

//   const addToCart = (product) => {
//     setCartItems((prevItems) => {
//       const itemIndex = prevItems.findIndex(item => item.id === product.id);
//       if (itemIndex !== -1) {
//         const updatedItems = [...prevItems];
//         updatedItems[itemIndex].quantity += 1;
//         return updatedItems;
//       } else {
//         return [...prevItems, { ...product, quantity: 1 }];
//       }
//     });
//   };

//   const removeFromCart = (productId) => {
//     setCartItems((prevItems) =>
//       prevItems.filter(item => item.id !== productId)
//     );
//   };

//   const updateQuantity = (productId, quantity) => {
//     setCartItems((prevItems) => {
//       const itemIndex = prevItems.findIndex(item => item.id === productId);
//       if (itemIndex !== -1) {
//         const updatedItems = [...prevItems];
//         updatedItems[itemIndex].quantity = quantity;
//         return updatedItems;
//       }
//       return prevItems;
//     });
//   };

//   const clearCart = () => {
//     setCartItems([]);
//   };

//   return (
//     <CartContext.Provider value={{
//       cartItems,
//       addToCart,
//       removeFromCart,
//       updateQuantity,
//       user,
//       setUser,
//       comment,
//       setComment,
//       selectedAddress,
//       setSelectedAddress,
//       selectedTime,
//       setSelectedTime,
//       clearCart
//     }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

import React, { createContext, useState } from 'react';

export const CartContext = createContext();
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState({});
  const [comment, setComment] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Добавить товар в корзину
const addToCart = (product) => {
  setCartItems((prevItems) => {
    const itemIndex = prevItems.findIndex(item => item.id === product.id);

    if (itemIndex !== -1) {
      const updatedItems = [...prevItems];
      
      // Обновляем количество и проверяем модификаторы
      updatedItems[itemIndex].quantity += 1;
      
      // Если у товара есть модификаторы, обновляем их
      if (product.modifiers && product.modifiers.length > 0) {
        updatedItems[itemIndex].modifiers = [...updatedItems[itemIndex].modifiers, ...product.modifiers];
      }
      
      return updatedItems;
    } else {
      // Добавляем новый товар с модификаторами
      return [
        ...prevItems,
        { ...product, quantity: 1, modifiers: product.modifiers || [] }
      ];
    }
  });
};

  
  const addModifierToProduct = (productId, modifier) => {
    setCartItems((prevItems) => {
      const itemIndex = prevItems.findIndex(item => item.id === productId);
  
      if (itemIndex !== -1) {
        const updatedItems = [...prevItems];
        // Проверяем и добавляем модификатор, если его нет
        updatedItems[itemIndex].modifiers = [
          ...updatedItems[itemIndex].modifiers,
          modifier
        ];
        return updatedItems;
      }
      return prevItems;
    });
  };
  

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter(item => item.id !== productId)
    );
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems((prevItems) => {
      const itemIndex = prevItems.findIndex(item => item.id === productId);
      if (itemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[itemIndex].quantity = quantity;
        return updatedItems;
      }
      return prevItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      addModifierToProduct,  // Экспортируем функцию
      removeFromCart,
      updateQuantity,
      user,
      setUser,
      comment,
      setComment,
      selectedAddress,
      setSelectedAddress,
      selectedTime,
      setSelectedTime,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
