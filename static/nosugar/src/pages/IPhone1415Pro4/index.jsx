



// import { Helmet } from "react-helmet";
// import { Img, Heading, Text } from "../../components";
// import React, { useContext, useEffect, useState } from "react";
// import { useNavigate } from 'react-router-dom';
// import { CartContext } from '../../CartContext';
// import axios from 'axios';
// import '../../styles/ButtonStyles.css';

// export default function IPhone1415Pro4Page() {
//   const navigate = useNavigate();
//   const { cartItems, user, selectedAddress, selectedTime, comment, clearCart } = useContext(CartContext);
//   const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
//   const totalPrice = cartItems.reduce((total, item) => total + parseInt(item.price) * item.quantity, 0);
//   const [balancePoints, setBalancePoints] = useState('');
//   const [error, setError] = useState('');
//   const [finalTotalPrice, setFinalTotalPrice] = useState(totalPrice);
//   const [orderId, setOrderId] = useState(null);
//   window.Telegram.WebApp.ready();
//   const initData = window.Telegram.WebApp.initData || '';
//   const initUserId = JSON.parse(decodeURIComponent(new URLSearchParams(initData).get("user")))?.id || 0;

//   useEffect(() => {
//     const maxAllowedPoints = Math.min(Math.floor(totalPrice * 0.3), user.balance); // 30% от суммы или баланс пользователя
//     if (parseInt(balancePoints) > maxAllowedPoints) {
//       setError(`Максимальное количество баллов: ${maxAllowedPoints}`);
//       setFinalTotalPrice(totalPrice);
//     } else {
//       setError('');
//       setFinalTotalPrice(totalPrice - (parseInt(balancePoints) || 0));
//     }
//   }, [balancePoints, totalPrice, user.balance]);

//   const handlePointsChange = (e) => {
//     const value = e.target.value;
//     if (value === '' || /^\d+$/.test(value)) {
//       setBalancePoints(value);
//     }
//   };
//   const initSBPPayment = async () => {
//     try {
//       const paymentData = {
//         amount: finalTotalPrice,
//         orderId: Date.now(), // Генерация уникального ID заказа
//         userId: initUserId,
//         items: JSON.stringify(cartItems.map(item => ({
//           id: item.id,
//           name: item.name,
//           size: 'XL400г229₽',
//           sizeId: '6e759df7-c4d9-43e5-b43c-65be96642a2b',
//           price: item.price,
//           amount: item.quantity,
//           additional: item.additional || []
//         }))),
//         pickup_time: selectedTime,
//         selectedPointName: selectedAddress,
//         comment: comment,
//         payment_method: 'online',
//         _auth: initData
//       };

//       const response = await axios.post('/api/initTinkoffPayment', paymentData);

//       if (response.data.paymentUrl) {
//         window.location.href = response.data.paymentUrl; // Перенаправление на страницу оплаты
//       } else {
//         setError('Ошибка при инициализации оплаты');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setError('Произошла ошибка при инициализации оплаты');
//     }
//   };

//   const goToPay = async () => {
//     await initSBPPayment();
//   };

//   return (
//     <>
//       <Helmet>
//         <title>nosugar</title>
//         <meta name="description" content="Web site created using create-react-app" />
//       </Helmet>
//       <div className="relative flex h-screen w-full flex-col items-center px-4 py-[20px]">
//         <div className="absolute inset-0 bg-cover bg-no-repeat bg-[#6E742F] h-full w-full" style={{zIndex: "-2"}}></div>
//         <div className="absolute inset-0 bg-cover bg-no-repeat opacity-10 bg-[url('/public/images/img_iphone_14_15_pro.png')] h-full w-full" style={{zIndex: "-1"}}></div>
//         <div className="w-full max-w-screen-lg">
//           <div className="flex flex-col items-center">
//             <Heading as="h1">Оплатите заказ</Heading>
//             <div className="mt-[45px] flex flex-col items-center self-stretch">
//               <Heading as="h2">СУММА: {totalPrice} RUB</Heading>
//               <div className="mt-5 flex justify-center self-stretch rounded-[20px] bg-black-900 p-[13px]">
//                 <Img onClick={goToPay} src="images/img_image_2.png" alt="imagettwo" className="h-[47px] w-[68%] rounded-[23px] object-cover" style={{ cursor:'pointer', zIndex:'2' }} />
//               </div>
//               <div className="mt-[29px] flex flex-col items-center" style={{zIndex:'2'}}>
//                 <Text size="text5" as="p" className="!text-light_green-900">
//                 оплатить баллами (макс. {Math.min(Math.floor(totalPrice * 0.3), user.balance)})
//                 </Text>
//                 <input
//                   type="text"
//                   value={balancePoints}
//                   onChange={handlePointsChange}
//                   className="mt-2 px-2 py-1 border rounded"
//                   style={{ textAlign: 'center', color: '#3F451C' }}
//                 />
//                 {error && <Text size="textsm" as="p" className="mt-2 error-message" style={{width:'100%'}}>{error}</Text>}
//               </div>
//               <div className="mt-[11px] flex flex-col items-center gap-6 self-stretch">
//                 <div className="h-px w-full self-stretch bg-light_green-900" />
//                 <Text size="textmd" as="p">
//                   Всего баллов: {user.balance}
//                 </Text>
//               </div>
//             </div>
//             <Heading size="headingmd" as="h3" className="mt-[70px] self-end">
//               Сумма заказа: {finalTotalPrice} RUB
//             </Heading>
//           </div>
//           <div className="flex flex-col items-end justify-end">
//             <Heading as="h2" className="mt-[30px] lg:mr-0 md:mr-0">
//               ИТОГО: {finalTotalPrice} RUB
//             </Heading>
//           </div>
//         </div>
//       </div>
//       <div className="mt-[30px] flex flex-col items-center gap-2.5">
//         <div className="flex w-[19%] justify-center rounded-[20px] bg-green-100 p-[18px] lg:w-full md:w-full" style={{ backgroundColor: '#CEE2B7', color: 'black', display: 'flex', position: 'fixed', bottom: '20px', left: '20px', width: '90%' }}>
//           <div className="flex w-[79%] items-center justify-between gap-5 lg:w-full md:w-full">
//             <Img onClick={() => navigate('/iphone1415pro11')} src="images/img_user.svg" alt="user" className="h-[30px] w-[30px] self-end" style={{ cursor:'pointer'}}/>
//             <Img onClick={() => navigate('/iphone1415pro1')} src="images/img_lock.svg" alt="lock" className="h-[30px] w-[30px] self-end" style={{ cursor:'pointer'}} />
//             <div className="relative h-[34px] w-[16%]">
//               <div className="absolute right-[-7.00px] top-[0.38px] m-auto h-[15px] w-[20px] rounded-[5px] bg-light_green-900">
//                 <Heading size="headingxs" as="h1" className="absolute right-[3.00px] top-[0.00px] m-auto">
//                   {totalItems}
//                 </Heading>
//               </div>
//               <Img onClick={() => navigate('/iphone1415pro2')} src="images/img_cart.svg" alt="cart" className="absolute bottom-[-0.38px] left-[0.00px] m-auto h-[30px] w-[30px]" style={{ cursor:'pointer'}} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// import { Helmet } from "react-helmet";
import { Img, Heading, Text } from "../../components";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../CartContext';
import axios from 'axios';
import '../../styles/ButtonStyles.css';

export default function IPhone1415Pro4Page() {
  const navigate = useNavigate();
  const { cartItems, user, selectedAddress, selectedTime, comment, clearCart } = useContext(CartContext);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  // const totalPrice = cartItems.reduce((total, item) => total + parseInt(item.price) * item.quantity, 0);
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
  const [balancePoints, setBalancePoints] = useState('0');
  const [error, setError] = useState('');
  const [finalTotalPrice, setFinalTotalPrice] = useState(totalPrice);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [orderId, setOrderId] = useState(null);
  window.Telegram.WebApp.ready();
  const initData = window.Telegram.WebApp.initData || '';
  const initUserId = JSON.parse(decodeURIComponent(new URLSearchParams(initData).get("user")))?.id || 0;



  useEffect(() => {
    // Проверка максимального допустимого количества баллов
    const maxAllowedPoints = Math.min(Math.floor(totalPrice * 0.3), isNaN(user.balance) ? 0 : user.balance); // 30% от суммы или баланс пользователя
    
    // Проверка на NaN и установка значения на 0
    const parsedBalancePoints = isNaN(parseInt(balancePoints)) ? 0 : parseInt(balancePoints);

    if (parsedBalancePoints > maxAllowedPoints) {
      setError(`Максимальное количество баллов: ${maxAllowedPoints}`);
      setFinalTotalPrice(totalPrice);
      setIsButtonDisabled(true);
    } else if (parsedBalancePoints < 0) {
      setError('Некорректное количество баллов');
      setIsButtonDisabled(true);
    } else {
      setError('');
      setFinalTotalPrice(totalPrice - parsedBalancePoints);
      setIsButtonDisabled(false);
    }
}, [balancePoints, totalPrice, user.balance]);

const handlePointsChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      // Проверка на NaN и установка значения на 0, если ввод некорректный
      setBalancePoints(isNaN(parseInt(value)) ? '0' : value);
    }
};


  const initSBPPayment = async () => {
    console.log(JSON.stringify(cartItems[0]))
    try {
      const paymentData = {
        amount: finalTotalPrice,
        orderId: Date.now(), // Генерация уникального ID заказа
        userId: initUserId,
        items: JSON.stringify(cartItems.map(item => ({
          id: item.id,
          name: item.name,
          size: '',
          sizeId: '',
          price: item.price,
          amount: item.quantity,
          additional: item.modifiers || []
        }))),
        pickup_time: selectedTime,
        selectedPointName: selectedAddress,
        comment: comment,
        payment_method: 'CASH',
        _auth: initData
      };

      const response = await axios.post('/api/initTinkoffPayment', paymentData);

      // if (response.data.paymentUrl) {
      //   window.location.href = response.data.paymentUrl; // Перенаправление на страницу оплаты
      // } else {
      //   setError('Ошибка при инициализации оплаты');
      // }
      // if (response.data.paymentUrl) {
      //   const newWindow = window.open(response.data.paymentUrl, '_blank', 'noopener,noreferrer');
      //   if (newWindow) {
      //     newWindow.opener = null; // Отключить взаимодействие Telegram с новой вкладкой
      //   } else {
      //     setError('Ошибка при открытии новой вкладки');
      //   }
      // } else {
      //   setError('Ошибка при инициализации оплаты');
      // }
      if (response.data.paymentUrl) {
        // const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const userAgent = navigator.userAgent;

        // Проверяем, Android ли это
        const isAndroid = /Android/i.test(userAgent);
        const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
  
        if (isAndroid) {
          // Открыть в новой вкладке (Android)
          const newWindow = window.open(response.data.paymentUrl, '_blank', 'noopener,noreferrer');
          if (newWindow) {
            newWindow.opener = null; // Отключить взаимодействие Telegram с новой вкладкой
          } else {
            setError('Ошибка при открытии новой вкладки');
          }
        } else if (isIOS || !isAndroid) {
          // Перенаправить в том же окне для iPhone, ноутбуков, компьютеров и других устройств
          window.location.href = response.data.paymentUrl;
        }
      } else {
        setError('Ошибка при инициализации оплаты');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Произошла ошибка при инициализации оплаты');
    }
  };

  const goToPay = async () => {
    if (!isButtonDisabled) {
      await initSBPPayment();
    }
  };

  return (
    <>
      {/* <Helmet>
        <title>nosugar</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet> */}
      <div className="relative flex h-screen w-full flex-col items-center px-4 py-[20px]">
        <div className="absolute inset-0 bg-cover bg-no-repeat bg-[#6E742F] h-full w-full" style={{zIndex: "-2"}}></div>
        <div className="absolute inset-0 bg-cover bg-no-repeat opacity-10 bg-[url('/public/images/img_iphone_14_15_pro.png')] h-full w-full" style={{zIndex: "-1"}}></div>
                {/* Кнопка со стрелочкой */}
                <button 
          onClick={() => navigate('/iphone1415pro3')} 
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-transparent focus:outline-none"
        >
          <img src="https://www.svgrepo.com/show/486232/left-arrow-backup-2.svg" alt="Back" style={{ width: '24px', height: '24px', filter: 'invert(1)' }} />
          
        </button>

        <div className="w-full max-w-screen-lg">
          <div className="flex flex-col items-center">
            <Heading as="h1">Оплатите заказ</Heading>
            <div className="mt-[45px] flex flex-col items-center self-stretch">
              <Heading as="h2">СУММА: {totalPrice} RUB</Heading>
              <div 
                className="mt-5 flex justify-center self-stretch rounded-[20px] bg-black-900 p-[13px]"
                style={{
                  opacity: isButtonDisabled ? 0.5 : 1,
                  pointerEvents: isButtonDisabled ? 'none' : 'auto',
                  cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
                }}
              >
                <Img onClick={goToPay} src="images/img_image_2.png" alt="imagettwo" className="h-[47px] w-[68%] rounded-[23px] object-cover" style={{ zIndex:'2' }} />
              </div>
              <div className="mt-[29px] flex flex-col items-center" style={{zIndex:'2'}}>
                <Text size="text5" as="p" className="!text-light_green-900">
                  оплатить баллами (макс. {Math.min(Math.floor(totalPrice * 0.3), isNaN(user.balance) ? 0 : user.balance)})
                </Text>
                <input
                  type="text"
                  value={balancePoints}
                  onChange={handlePointsChange}
                  className="mt-2 px-2 py-1 border rounded"
                  style={{ textAlign: 'center', color: '#3F451C' }}
                />
                {error && <Text size="textsm" as="p" className="mt-2 error-message" style={{width:'100%'}}>{error}</Text>}
              </div>
              <div className="mt-[11px] flex flex-col items-center gap-6 self-stretch">
                <div className="h-px w-full self-stretch bg-light_green-900" />
                <Text size="textmd" as="p">
                  Всего баллов: {user.balance}
                </Text>
              </div>
            </div>
            <Heading size="headingmd" as="h3" className="mt-[70px] self-end">
              Сумма заказа: {finalTotalPrice} RUB
            </Heading>
          </div>
          <div className="flex flex-col items-end justify-end">
            <Heading as="h2" className="mt-[30px] lg:mr-0 md:mr-0">
              ИТОГО: {finalTotalPrice} RUB
            </Heading>
          </div>
        </div>
        <Heading size="headingxxs" as="h3" className="mt-[20px]">
        При отмене заказа деньги к возврату не подлежат!
        </Heading>
      </div>
      <div className="mt-[30px] flex flex-col items-center gap-2.5">
        <div className="flex w-[19%] justify-center rounded-[20px] bg-green-100 p-[18px] lg:w-full md:w-full" style={{ backgroundColor: '#CEE2B7', color: 'black', display: 'flex', position: 'fixed', bottom: '20px', left: '20px', width: '90%' }}>
          <div className="flex w-[79%] items-center justify-between gap-5 lg:w-full md:w-full">
            <Img onClick={() => navigate('/iphone1415pro11')} src="images/img_user.svg" alt="user" className="h-[30px] w-[30px] self-end" style={{ cursor:'pointer'}}/>
            <Img onClick={() => navigate('/iphone1415pro1')} src="images/img_lock.svg" alt="lock" className="h-[30px] w-[30px] self-end" style={{ cursor:'pointer'}} />
            <div className="relative h-[34px] w-[16%]">
              <div className="absolute right-[-7.00px] top-[0.38px] m-auto h-[15px] w-[20px] rounded-[5px] bg-light_green-900">
                <Heading size="headingxs" as="h1" className="absolute right-[3.00px] top-[0.00px] m-auto">
                  {totalItems}
                </Heading>
              </div>
              <Img onClick={() => navigate('/iphone1415pro2')} src="images/img_cart.svg" alt="cart" className="absolute bottom-[-0.38px] left-[0.00px] m-auto h-[30px] w-[30px]" style={{ cursor:'pointer'}} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}




