
import React, { useContext, useState, useEffect } from "react";
// import { Helmet } from "react-helmet";
import { Button, Heading, Img } from "../../components";
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../CartContext';
import '../../styles/ButtonStyles.css';

const dropDownOptions = [
  { label: "Грузинский вал 11с4", value: "Грузинский вал 11с4" }
];

export default function IPhone1415Pro3Page() {
  const navigate = useNavigate();
  const { cartItems, setSelectedAddress, setSelectedTime } = useContext(CartContext);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const [address, setAddress] = useState('Грузинский вал 11с4');
  const [hourOptions, setHourOptions] = useState([]);
  const [minuteOptions, setMinuteOptions] = useState([]);
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');

  // useEffect(() => {
  //   const now = new Date();
  //   const currentHour = now.getHours();
  //   const currentMinute = now.getMinutes();
  
  //   // Формирование списка доступных часов
  //   const hours = Array.from({ length: 24 - currentHour }, (_, i) => ({
  //     label: (currentHour + i).toString().padStart(2, '0'),
  //     value: (currentHour + i).toString().padStart(2, '0')
  //   }));
  //   setHourOptions(hours);
  
  //   // Формирование списка минут с шагом в 15 минут, включая 00
  //   const minutes = Array.from({ length: 4 }, (_, i) => {
  //     const minuteValue = i * 15;
  //     if (hour === currentHour.toString().padStart(2, '0') && minuteValue <= currentMinute) {
  //       return null;
  //     }
  //     return {
  //       label: minuteValue.toString().padStart(2, '0'),
  //       value: minuteValue.toString().padStart(2, '0')
  //     };
  //   }).filter(option => option !== null);
  
  //   // Включаем 00 в возможные опции
  //   if (hour !== currentHour.toString().padStart(2, '0') || currentMinute < 0) {
  //     minutes.unshift({
  //       label: '00',
  //       value: '00'
  //     });
  //   }
  
  //   setMinuteOptions(minutes);
  
  //   // Устанавливаем время по умолчанию
  //   if (!hour) setHour(currentHour.toString().padStart(2, '0'));
  //   if (!minute) {
  //     const nextMinute = Math.ceil(currentMinute / 15) * 15;
  //     setMinute(nextMinute < 60 ? nextMinute.toString().padStart(2, '0') : '00');
  //   }
  // }, [hour]);



  // useEffect(() => {
  //   const now = new Date();
  //   const currentHour = now.getHours();
  //   const currentMinute = now.getMinutes();
    
  //   // Формирование списка доступных часов
  //   const hours = Array.from({ length: 24 - currentHour }, (_, i) => ({
  //     label: (currentHour + i).toString().padStart(2, '0'),
  //     value: (currentHour + i).toString().padStart(2, '0')
  //   }));
  //   setHourOptions(hours);
  
  //   // Определение минимального времени в будущем (текущее время + 16 минут)
  //   const minFutureTime = new Date(now.getTime() + 16 * 60000);
  //   const minFutureHour = minFutureTime.getHours();
  //   const minFutureMinute = minFutureTime.getMinutes();
  
  //   // Формирование списка минут с шагом в 15 минут
  //   const minutes = Array.from({ length: 4 }, (_, i) => {
  //     const minuteValue = i * 15;
  //     if (
  //       (hour === currentHour.toString().padStart(2, '0') && minuteValue <= currentMinute) ||
  //       (hour === minFutureHour.toString().padStart(2, '0') && minuteValue < minFutureMinute)
  //     ) {
  //       return null;
  //     }
  //     return {
  //       label: minuteValue.toString().padStart(2, '0'),
  //       value: minuteValue.toString().padStart(2, '0')
  //     };
  //   }).filter(option => option !== null);
  
  //   setMinuteOptions(minutes);
  
  //   // Устанавливаем время по умолчанию
  //   if (!hour) setHour(currentHour.toString().padStart(2, '0'));
  //   if (!minute) {
  //     const nextMinute = Math.ceil(currentMinute / 15) * 15;
  //     setMinute(nextMinute < 60 ? nextMinute.toString().padStart(2, '0') : '00');
  //   }
  // }, [hour]);
  

  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentDay = now.getDay(); // Получаем день недели (0 - воскресенье, 6 - суббота)
  
    // Проверяем, является ли день выходным
    const isWeekend = currentDay === 0 || currentDay === 6;
  
    // Формирование списка доступных часов в зависимости от типа дня
    const maxHour = isWeekend ? 21 : 20;
    const startHour = isWeekend ? 10 : 9;
  
    // Формирование списка доступных часов
    const hours = Array.from({ length: maxHour - startHour + 1 }, (_, i) => {
      const hourValue = startHour + i;
      if (hourValue < currentHour || (hourValue === currentHour && currentMinute >= 40)) {
        // Если текущее время уже прошло или скоро закончится (например, меньше 40 минут на текущий час), пропускаем
        return null;
      }
      return {
        label: hourValue.toString().padStart(2, '0'),
        value: hourValue.toString().padStart(2, '0')
      };
    }).filter(option => option !== null);
  
    // Если нет доступных часов, очищаем селектор
    if (hours.length === 0) {
      setHourOptions([]);
      setMinuteOptions([]);
      return; // Прекращаем выполнение эффекта
    }
  
    setHourOptions(hours);
  
    // Определение минимального времени в будущем (текущее время + 16 минут)
    const minFutureTime = new Date(now.getTime() + 16 * 60000);
    const minFutureHour = minFutureTime.getHours();
    const minFutureMinute = minFutureTime.getMinutes();
  
    // Формирование списка минут с шагом в 15 минут
    const minutes = Array.from({ length: 4 }, (_, i) => {
      const minuteValue = i * 15;
      if (
        (hour === currentHour.toString().padStart(2, '0') && minuteValue <= currentMinute) ||
        (hour === minFutureHour.toString().padStart(2, '0') && minuteValue < minFutureMinute)
      ) {
        return null;
      }
      return {
        label: minuteValue.toString().padStart(2, '0'),
        value: minuteValue.toString().padStart(2, '0')
      };
    }).filter(option => option !== null);
  
    setMinuteOptions(minutes);
  
    // Устанавливаем время по умолчанию
    if (!hour) setHour(currentHour.toString().padStart(2, '0'));
    if (!minute) {
      const nextMinute = Math.ceil(currentMinute / 15) * 15;
      setMinute(nextMinute < 60 ? nextMinute.toString().padStart(2, '0') : '00');
    }
  }, [hour]);
  
  

  const handleProceedToPayment = () => {
    setSelectedAddress(address);
    setSelectedTime(`${hour}:${minute}`);
    navigate('/iphone1415pro4');
  };

  return (
    <>
      <div className="relative flex h-screen w-full flex-col items-center px-4 py-[15px] bg-[#6E742F]">
        <div className="absolute inset-0 bg-cover bg-no-repeat opacity-10 bg-[url('/public/images/img_iphone_14_15_pro.png')] z-0 h-full w-full"></div>
        
        {/* Кнопка со стрелочкой */}
        <button 
          onClick={() => navigate('/iphone1415pro2')} 
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-transparent focus:outline-none"
        >
          <img src="https://www.svgrepo.com/show/486232/left-arrow-backup-2.svg" alt="Back" style={{ width: '24px', height: '24px', filter: 'invert(1)' }} />
          
        </button>

        <div className="flex w-full flex-col items-center lg:w-full md:w-full">
          <Heading as="h1" className="text-white">Выберите ресторан</Heading>
          <div className="relative mt-4 w-full max-w-md custom-select-container">
            <select className="custom-select" value={address} onChange={(e) => setAddress(e.target.value)}>
              <option className="custom-option" value="" disabled>ул. Адресованная 18</option>
              {dropDownOptions.map(option => (
                <option key={option.value} className="custom-option" value={option.value}>{option.label}</option>
              ))}
            </select>
            <div className="custom-select-icon">
              <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <Heading as="h2" className="mt-8 text-white">Выберите время заказа</Heading>
          <div className="mt-4 flex items-center">
            <select className="w-20 px-4 py-2 mx-2 rounded-[20px] bg-[#3F451C] text-white placeholder-white focus:outline-none custom-select" style={{ fontSize: '36px', fontWeight: 'bold', lineHeight: '49.18px', textAlign: 'center'}} value={hour} onChange={(e) => setHour(e.target.value)}>
              {hourOptions.map(option => (
                <option key={option.value} className="custom-option" value={option.value}>{option.label}</option>
              ))}
            </select>
            <Heading size="heading2xl" as="h2" className="text-white">:</Heading>
            <select className="w-20 px-4 py-2 mx-2 rounded-[20px] bg-[#3F451C] text-white placeholder-white focus:outline-none custom-select" style={{ fontSize: '36px', fontWeight: 'bold', lineHeight: '49.18px', textAlign: 'center'}} value={minute} onChange={(e) => setMinute(e.target.value)}>
              {minuteOptions.map(option => (
                <option key={option.value} className="custom-option" value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <Button size="sm" shape="round"  disabled={hourOptions.length === 0 || minuteOptions.length === 0} onClick={handleProceedToPayment} className="mt-[120px] min-w-[175px] bg-[#CEE2B7] text-black" style={{ backgroundColor: '#CEE2B7', color: 'black', zIndex:'3',   opacity: hourOptions.length === 0 || minuteOptions.length === 0 ? 0.5 : 1, cursor: hourOptions.length === 0 || minuteOptions.length === 0 ? 'not-allowed' : 'pointer',  }}>
            Перейти к оплате
          </Button>
        </div>
      </div>
      <div className="flex w-[19%] justify-center rounded-[20px] bg-green-100 p-[18px] lg:w-full md:w-full" style={{ backgroundColor: '#CEE2B7', color: 'black', display: 'flex', position: 'fixed', bottom: '20px', left: '20px', width: '90%' }}>
         <div className="flex w-[79%] items-center justify-between gap-5 lg:w-full md:w-full">
           <Img onClick={() => navigate('/iphone1415pro11')} src="images/img_user.svg" alt="user" className="h-[30px] w-[30px] self-end" />
           <Img onClick={() => navigate('/iphone1415pro1')} src="images/img_lock.svg" alt="lock" className="h-[30px] w-[30px] self-end" />
           <div className="relative h-[34px] w-[16%]">
             <div className="absolute right-[-7.00px] top-[0.38px] m-auto h-[15px] w-[20px] rounded-[5px] bg-light_green-900">
               <Heading size="headingxs" as="h1" className="absolute right-[3.00px] top-[0.00px] m-auto">
                 {totalItems}
               </Heading>
             </div>
             <Img onClick={() => navigate('/iphone1415pro2')} src="images/img_cart.svg" alt="cart" className="absolute bottom-[-0.38px] left-[0.00px] m-auto h-[30px] w-[30px]" />
          </div>
         </div>
       </div>
    </>
  );
}
