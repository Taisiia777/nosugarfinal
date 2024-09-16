
// import { Button, Heading } from "../../components";
// import React from "react";
// import { useNavigate } from 'react-router-dom';
// import '../../styles/ButtonStyles.css'; 

// export default function IPhone1415Pro8Page() {
//   const navigate = useNavigate();

//   return (
//     <>

//       <div className="relative flex h-screen w-full flex-col items-center px-14 py-[0px] bg-[#6E742F]">
//         <div className="absolute inset-0 bg-cover bg-no-repeat opacity-10 bg-[url('/public/images/img_iphone_14_15_pro.png')] z-0"></div>

//         <Heading size="heading2xl" as="h1" className="mt-[42px] md:text-3xl sm:text-[28px]">
//           ВХОД:
//         </Heading>
//         <Heading as="h2" className="mt-5">
//           Программа лояльности
//         </Heading>
//         <div className="flex w-[19%] flex-col gap-[7px] lg:w-full md:w-full" style={{marginTop: '20px'}}>
//           <Button 
//             onClick={() => navigate('/iphone1415pro9')} 
//             size="md" 
//             style={{ backgroundColor: '#CEE2B7', color: 'black', zIndex: '2' }} 
//             className="w-[100%] rounded-[20px] lg:text-[17px] sm:px-4 button-hover-animation"
//           >
//             У МЕНЯ УЖЕ ЕСТЬ КАРТА
//           </Button>
//           <Button 
//             onClick={() => navigate('/iphone1415pro10')} 
//             color="light_green_900" 
//             style={{ zIndex: '2' }} 
//             size="md" 
//             className="w-[100%] rounded-[20px] lg:text-[17px] sm:px-4 button-hover-animation"
//           >
//             ЗАРЕГИСТРИРОВАТЬСЯ
//           </Button>
//         </div>
//         <Button 
//           size="sm" 
//           onClick={() => navigate('/iphone1415pro1')}  
//           style={{ backgroundColor: '#CEE2B7', color: 'black', height: '40px', zIndex: '2' }} 
//           shape="round" 
//           className="mt-[20px] min-w-[129px] lg:text-[13px] button-hover-animation"
//         >
//           Пропустить
//         </Button>
//       </div>
//     </>
//   );
// }

import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, Heading } from "../../components";
import axios from 'axios';
import { CartContext } from '../../CartContext';
import '../../styles/ButtonStyles.css'; 

export default function IPhone1415Pro8Page() {
  const navigate = useNavigate();
  const { setUser } = useContext(CartContext);  // Контекст для хранения данных пользователя
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверка наличия Telegram WebApp SDK
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();

      const initData = window.Telegram.WebApp.initData || '';
      const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe || {};
      const initUserId = JSON.parse(decodeURIComponent(new URLSearchParams(initData).get("user")))?.id || 0;

      const fetchPhoneNumberAndCardData = async () => {
        try {
          // Запрос для получения номера телефона
          const phoneResponse = await axios.post('/api/getPhone', {
            _auth: initData,
            userId: initUserId,
          });

          const phoneNumber = phoneResponse.data.phone_number;

          // Если телефон получен, делаем запрос для получения данных карты
          if (phoneNumber) {
            const cardResponse = await axios.post('/api/login_card', { phone: phoneNumber });

            // Проверяем наличие данных карты
            if (cardResponse.data.ok) {
              // Сохраняем данные карты в контекст
              setUser(cardResponse.data.data);
              // Перенаправляем пользователя на указанный маршрут
              navigate('/iphone1415pro1');
            } else {
              console.error('Карта не найдена');
              setLoading(false);  // Останавливаем загрузку, если карта не найдена
            }
          }
        } catch (error) {
          console.error('Ошибка при получении данных:', error);
          setLoading(false);  // Останавливаем загрузку в случае ошибки
        }
      };

      fetchPhoneNumberAndCardData();
    } else {
      console.error('Telegram WebApp SDK is not доступен');
      setLoading(false);  // Останавливаем загрузку, если SDK не доступен
    }
  }, [navigate, setUser]);

  if (loading) {
    return (
      <div className="relative flex h-screen w-full flex-col items-center justify-center bg-[#6E742F]">
        <Heading size="heading2xl" as="h1" className="text-white">
          Загрузка...
        </Heading>
      </div>
    );
  }

  return (
    <>
      {/* Основной контент страницы */}
      <div className="relative flex h-screen w-full flex-col items-center px-14 py-[0px] bg-[#6E742F]">
        <div className="absolute inset-0 bg-cover bg-no-repeat opacity-10 bg-[url('/public/images/img_iphone_14_15_pro.png')] z-0"></div>

        <Heading size="heading2xl" as="h1" className="mt-[42px] md:text-3xl sm:text-[28px]">
          ВХОД:
        </Heading>
        <Heading as="h2" className="mt-5">
          Программа лояльности
        </Heading>
        <div className="flex w-[19%] flex-col gap-[7px] lg:w-full md:w-full" style={{marginTop: '20px'}}>
          <Button 
            onClick={() => navigate('/iphone1415pro9')} 
            size="md" 
            style={{ backgroundColor: '#CEE2B7', color: 'black', zIndex: '2' }} 
            className="w-[100%] rounded-[20px] lg:text-[17px] sm:px-4 button-hover-animation"
          >
            У МЕНЯ УЖЕ ЕСТЬ КАРТА
          </Button>
          <Button 
            onClick={() => navigate('/iphone1415pro10')} 
            color="light_green_900" 
            style={{ zIndex: '2' }} 
            size="md" 
            className="w-[100%] rounded-[20px] lg:text-[17px] sm:px-4 button-hover-animation"
          >
            ЗАРЕГИСТРИРОВАТЬСЯ
          </Button>
        </div>
        <Button 
          size="sm" 
          onClick={() => navigate('/iphone1415pro1')}  
          style={{ backgroundColor: '#CEE2B7', color: 'black', height: '40px', zIndex: '2' }} 
          shape="round" 
          className="mt-[20px] min-w-[129px] lg:text-[13px] button-hover-animation"
        >
          Пропустить
        </Button>
      </div>
    </>
  );
}
