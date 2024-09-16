



import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../../CartContext';
import '../../styles/ButtonStyles.css';  
import { Img, Heading, Button } from "../../components";
import CategoryItem from '../../components/CategoryItem'; // Импортируем компонент категории

export default function IPhone1415Pro11Page() {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { cartItems } = useContext(CartContext);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const [menuData, setMenuData] = useState([]); // Инициализация состояния
  const [loading, setLoading] = useState(true); // Состояние для прелоудера

  useEffect(() => {
    if (window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      const initData = window.Telegram.WebApp.initData || '';
      const initUserId = JSON.parse(decodeURIComponent(new URLSearchParams(initData).get("user")))?.id || 0;
      const fetchMenu = async () => {
        try {
          const cachedData = localStorage.getItem('menuData11234567');
          if (cachedData) {
            setMenuData(JSON.parse(cachedData));
            setLoading(false); // Отключаем прелоудер
          } else {
            const response = await axios.post('/api/getMenu', {
              _auth: initData,
              userId: initUserId,
            });
            setMenuData(response.data.itemCategories); // Установка данных из ответа сервера
            localStorage.setItem('menuData11234567', JSON.stringify(response.data.itemCategories));
            setLoading(false); // Отключаем прелоудер
          }
        } catch (error) {
          console.error(error);
          setLoading(false); // Отключаем прелоудер при ошибке
        }
      };
      
      fetchMenu();
    } else {
      console.error('Telegram WebApp SDK is not available');
      setLoading(false); // Отключаем прелоудер при отсутствии SDK
    }
  }, []);


  // const handleAddToCart = (product) => {
  //   const itemToAdd = {
  //     id: product.itemId,
  //     name: product.name,
  //     price: product.itemSizes[0].prices[0].price,
  //     image: product.itemSizes[0].buttonImageUrl,
  //     quantity: 1,
  //     modifiers: product.modifiers ? [product.modifiers] : [] // Добавляем модификатор, если он есть
  //   };

  //   addToCart(itemToAdd);
  // };
  // const handleAddToCart = (product) => {
  //   // Безопасная проверка наличия данных перед доступом
  //   alert(JSON.stringify(product))
  //   const itemSize = product.itemSizes?.[0];
  //   const price = itemSize?.prices?.[0]?.price || 0; // Если массив пуст или нет цены, установить 0
  //   const imageUrl = itemSize?.buttonImageUrl || ''; // Если нет изображения, установить пустую строку
    
  //   const itemToAdd = {
  //     id: product.itemId,
  //     name: product.name,
  //     price: price,
  //     image: imageUrl,
  //     quantity: 1,
  //     modifiers: product.modifiers ? [product.modifiers] : [] // Добавляем модификатор, если он есть
  //   };
  
  //   addToCart(itemToAdd);
  // };
  const handleAddToCart = (product) => {
    // Безопасная проверка наличия данных перед доступом
    const itemSize = product.itemSizes?.[0];

    // Устанавливаем значения по умолчанию, если данные отсутствуют
    const price = product.price || itemSize?.prices?.[0]?.price || 0;  // Цена или 0, если цена отсутствует
    const imageUrl = product.imageUrl || itemSize?.buttonImageUrl || 'default-image-url.png';  // Устанавливаем картинку или дефолтную
    const id = product.id || product.itemId || 'default-id';  // Уникальный идентификатор или дефолтный
    const name = product.name || 'Без названия';  // Название товара или "Без названия"
    const quantity = product.quantity || 1;  // Количество, по умолчанию 1

    // Формируем объект для добавления в корзину
    const itemToAdd = {
      id: id,
      name: name,
      price: price,
      image: imageUrl,
      quantity: quantity,
      modifiers: product.modifiers ? [product.modifiers] : []  // Добавляем модификатор, если он есть
    };

    addToCart(itemToAdd);  // Добавляем товар в корзину
};

  return (
    <>

      <div className="relative flex h-screen w-full flex-col items-center px-4 py-[20px]">
        <div className="absolute inset-0 bg-cover bg-no-repeat bg-[#6E742F] h-full w-full" style={{zIndex: "-2"}}></div>
        <div className="absolute inset-0 bg-cover bg-no-repeat opacity-10 bg-[url('/public/images/img_iphone_14_15_pro.png')] h-full w-full" style={{zIndex: "-1"}}></div>
        <div className="relative z-10 w-full max-w-screen-lg h-[82vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="preloader">
                <svg className="cart" role="img" aria-label="Shopping cart line animation" viewBox="0 0 128 128" width="128px" height="128px" xmlns="http://www.w3.org/2000/svg">
                  <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8">
                    <g className="cart__track" stroke="hsla(0,10%,10%,0.1)">
                      <polyline points="4,4 21,4 26,22 124,22 112,64 35,64 39,80 106,80" />
                      <circle cx="43" cy="111" r="13" />
                      <circle cx="102" cy="111" r="13" />
                    </g>
                    <g className="cart__lines" stroke="currentColor">
                      <polyline className="cart__top" points="4,4 21,4 26,22 124,22 112,64 35,64 39,80 106,80" stroke-dasharray="338 338" stroke-dashoffset="-338" />
                      <g className="cart__wheel1" transform="rotate(-90,43,111)">
                        <circle className="cart__wheel-stroke" cx="43" cy="111" r="13" stroke-dasharray="81.68 81.68" stroke-dashoffset="81.68" />
                      </g>
                      <g className="cart__wheel2" transform="rotate(90,102,111)">
                        <circle className="cart__wheel-stroke" cx="102" cy="111" r="13" stroke-dasharray="81.68 81.68" stroke-dashoffset="81.68" />
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
            </div>
          ) : (
            <div className="category-list">
              {menuData.map((category, index) => (
                <CategoryItem key={index} category={category} data={menuData} handleAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </div>
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
