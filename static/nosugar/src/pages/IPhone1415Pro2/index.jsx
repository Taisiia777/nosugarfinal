

import React, { useContext } from "react";
// import { Helmet } from "react-helmet";
import { Img, Heading, Button, Text } from "../../components";
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../CartContext';
import '../../styles/ButtonStyles.css';

export default function IPhone1415Pro2Page() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, comment, setComment } = useContext(CartContext);

  const handleIncrement = (productId) => {
    const item = cartItems.find(item => item.id === productId);
    if (item) {
      updateQuantity(productId, item.quantity + 1);
    }
  };

  // const handleDecrement = (productId) => {
  //   const item = cartItems.find(item => item.id === productId);
  //   if (item && item.quantity > 1) {
  //     updateQuantity(productId, item.quantity - 1);
  //   }
  // };
  const handleDecrement = (productId) => {
    const item = cartItems.find(item => item.id === productId);
    if (item) {
      if (item.quantity === 1) {
        removeFromCart(productId);  // Если количество 1, удаляем товар из корзины
      } else {
        updateQuantity(productId, item.quantity - 1);  // Иначе уменьшаем количество
      }
    }
  };
  const handleUpdateComment = (e) => {
    setComment(e.target.value);
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  // const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  // const totalPrice = cartItems.reduce((total, item) => {
  //   // Добавляем цену модификаторов к основной цене
  //   const modifierTotal = item.modifiers?.reduce((modTotal, modifier) => {
  //     const modifierPrice = modifier[0].prices?.[0]?.price || 0; // Получаем цену модификатора
  //     return modTotal + modifierPrice;
  //   }, 0) || 0;
  
  //   return total + (item.price + modifierTotal) * item.quantity;
  // }, 0);
  const totalPrice = cartItems.reduce((total, item) => {
    // Добавляем цену модификаторов к основной цене
    const modifierTotal = item.modifiers?.reduce((modTotal, modifierGroup) => {
      // Считаем цену каждого модификатора в группе
      const groupTotal = modifierGroup.reduce((groupModTotal, modifier) => {
        const modifierPrice = modifier.prices?.[0]?.price || 0;
        return groupModTotal + modifierPrice;
      }, 0);
      return modTotal + groupTotal;
    }, 0) || 0;
  
    return total + (item.price + modifierTotal) * item.quantity;
  }, 0);
  
  return (
    <>
      {/* <Helmet>
        <title>nosugar</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet> */}
      <div className="relative flex h-screen w-full flex-col items-center px-4 py-[20px]">
        <div className="absolute inset-0 bg-cover bg-no-repeat bg-[#6E742F] h-full w-full" style={{zIndex: "-2"}}></div>
        <div className="absolute inset-0 bg-cover bg-no-repeat opacity-10 bg-[url('/public/images/img_iphone_14_15_pro.png')] h-full w-full" style={{zIndex: "-1"}}></div>
        <div className="flex w-full flex-col items-center justify-center">
          <Heading as="h1" className="text-white">Корзина</Heading>
        </div>
        <div className="mt-[20px] flex flex-col gap-[7px] w-full max-w-screen-lg overflow-y-auto h-[200px]">
        {/* {cartItems.map((item, index) => (
            <div key={"list" + index} className="flex flex-1 rounded-[20px] bg-[#3F451C] p-[15px] text-white" style={{height: '100px'}}>
              <div className="flex items-center w-full">
                <Img src={item.image} alt={item.name} className="h-[60px] w-[60px] object-cover mb-2" />
                <div className="flex flex-col items-start justify-between ml-4">
                  <Text as="p" className="mb-2">{item.name}</Text>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center justify-center gap-2">
                      <Button className="h-[24px] w-[24px] rounded-full bg-[#CEE2B7] text-black flex items-center justify-center button-hover-animation" style={{ backgroundColor: '#CEE2B7', color: 'black',zIndex:'3' }} onClick={() => handleIncrement(item.id)}>
                        +
                      </Button>
                      <Button className="h-[24px] w-[24px] text-white flex items-center justify-center" style={{ background: 'none', color: 'white' }}>
                        {item.quantity} шт.
                      </Button>
                      <Button className="h-[24px] w-[24px] rounded-full bg-[#CEE2B7] text-black flex items-center justify-center button-hover-animation" style={{ backgroundColor: '#CEE2B7', color: 'black',zIndex:'3' }} onClick={() => handleDecrement(item.id)}>
                        -
                      </Button>
                    </div>
                    <Heading size="headingxs" as="h3" className="ml-4">
                      {item.price} ₽
                    </Heading>
                  </div>
                </div>
              </div>
            </div>
          ))} */}
               {cartItems.map((item, index) => (
          <div key={"list" + index} className="flex flex-1 rounded-[20px] bg-[#3F451C] p-[15px] text-white" style={{height: 'auto'}}>
            <div className="flex items-center w-full">
              <Img src={item.image} alt={item.name} className="h-[60px] w-[60px] object-cover mb-2" />
              <div className="flex flex-col items-start justify-between ml-4">
                <Text as="p" className="mb-2">{item.name}</Text>
                
                {/* Отображаем модификаторы, если они есть */}
                {/* {item.modifiers?.length > 0 && (
                  <div className="flex flex-col text-sm text-gray-400">
                    {item.modifiers.map((modifier, modIndex) => (
                      <div key={modIndex} className="flex justify-between w-full">
                        <div className="flex gap-2">
  <Text as="p">{modifier[0]?.name}</Text>
  <Text as="p">{modifier[0]?.prices?.[0]?.price || 0} ₽</Text>
</div>

                      </div>
                    ))}
                  </div>
                )} */}
                {item.modifiers?.length > 0 && (
  <div className="flex flex-col text-sm text-gray-400">
    {item.modifiers.map((modifierGroup, modGroupIndex) => (
      <div key={modGroupIndex}>
        {modifierGroup.map((modifier, modIndex) => (
          <div key={modIndex} className="flex gap-2">
            <Text as="p">{modifier.name}</Text>
            <Text as="p">{modifier.prices?.[0]?.price || 0} ₽</Text>
          </div>
        ))}
      </div>
    ))}
  </div>
)}

                <div className="flex items-center justify-between w-full mt-2">
                  <div className="flex items-center justify-center gap-2">
                    <Button className="h-[24px] w-[24px] rounded-full bg-[#CEE2B7] text-black flex items-center justify-center button-hover-animation" style={{ backgroundColor: '#CEE2B7', color: 'black',zIndex:'3' }} onClick={() => handleIncrement(item.id)}>
                      +
                    </Button>
                    <Button className="h-[24px] w-[24px] text-white flex items-center justify-center" style={{ background: 'none', color: 'white' }}>
                      {item.quantity} шт.
                    </Button>
                    <Button className="h-[24px] w-[24px] rounded-full bg-[#CEE2B7] text-black flex items-center justify-center button-hover-animation" style={{ backgroundColor: '#CEE2B7', color: 'black',zIndex:'3' }} onClick={() => handleDecrement(item.id)}>
                      -
                    </Button>
                  </div>
                  <Heading size="headingxs" as="h3" className="ml-4">
                    {item.price} ₽
                  </Heading>
                </div>
              </div>
            </div>
          </div>
        ))}

        </div>
        <input
          type="text"
          placeholder="Введите комментарий"
          value={comment}
          onChange={handleUpdateComment}
          className="input-comment"
        />
        <div className="flex w-full justify-end mt-4">
          <Heading as="h2" className="text-[#CEE2B7]">
            ИТОГО: {totalPrice} RUB
          </Heading>
        </div>
        <Button size="sm" shape="round" className="min-w-[84px] lg:text-[13px] button-hover-animation" onClick={() => navigate('/iphone1415pro3')} style={{ backgroundColor: '#CEE2B7', color: 'black',zIndex:'3', marginTop:'30px' }}>
          Время самовывоза
        </Button>
      </div>
      
      <div className="flex w-[19%] justify-center rounded-[20px] bg-green-100 p-[18px] lg:w-full md:w-full" style={{ backgroundColor: '#CEE2B7', color: 'black', display: 'flex', position: 'fixed', bottom: '20px', left: '20px', width: '90%' }}>
        <div className="flex w-[79%] items-center justify-between gap-5 lg:w-full md:w-full">
          <Img onClick={() => navigate('/iphone1415pro11')} src="images/img_user.svg" alt="user" className="h-[30px] w-[30px] self-end img-hover-user" style={{ cursor:'pointer'}}/>
          <Img onClick={() => navigate('/iphone1415pro1')} src="images/Home_fill.svg" alt="home" className="h-[30px] w-[30px] self-end img-hover-home" style={{ cursor:'pointer'}} />
          <div className="relative h-[34px] w-[16%]">
            <div className="absolute right-[-7.00px] top-[0.38px] m-auto h-[15px] w-[20px] rounded-[5px] bg-light_green-900">
              <Heading size="headingxs" as="h1" className="absolute right-[3.00px] top-[0.00px] m-auto">
                {totalItems}
              </Heading>
            </div>
            <Img onClick={() => navigate('/iphone1415pro2')} src="images/shopping-basket_unfill.svg" alt="cart" className="absolute bottom-[-0.38px] left-[0.00px] m-auto h-[30px] w-[30px] img-hover-cart" style={{ cursor:'pointer'}} />
          </div>
        </div>
      </div>
    </>
  );
}

