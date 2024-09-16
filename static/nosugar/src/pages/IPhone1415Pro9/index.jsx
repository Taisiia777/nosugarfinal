// // import { Helmet } from "react-helmet";
// import { Button, Heading } from "../../components";
// import React, { useState, useContext } from "react";
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { CartContext } from '../../CartContext';
// import '../../styles/ButtonStyles.css';  

// export default function IPhone1415Pro9Page() {
//   const navigate = useNavigate();
//   const [cardNumber, setCardNumber] = useState('');
//   const [error, setError] = useState(null);
//   const { setUser } = useContext(CartContext);

//   const handleCardNumberChange = (e) => {
//     setCardNumber(e.target.value);
//   };

//   const handleLogin = async () => {
//     try {
//       const response = await axios.post('/api/login_card', { phone: cardNumber });

//       // Проверяем статус ответа
//       if (response.data.ok) {
//         // alert('Login successful');
//         setUser(response.data.data);
//         navigate('/iphone1415pro1');
//       } else {
//         setError('Карта не найдена!');
//       }
//     } catch (error) {
//       setError('Ошибка при входе');
//       alert('Error logging in:', JSON.stringify(error));
//     }
//   };

//   return (
//     <>

//       <div className="relative flex h-screen w-full flex-col items-center px-14 py-[0px] bg-[#6E742F]">
//         <div className="absolute inset-0 bg-cover bg-no-repeat opacity-10 bg-[url('/public/images/img_iphone_14_15_pro.png')] z-0"></div>
//                 {/* Кнопка со стрелочкой */}
//                 <button 
//           onClick={() => navigate('/iphone1415pro2')} 
//           className="absolute top-4 left-4 z-10 p-2 rounded-full bg-transparent focus:outline-none"
//         >
//           <img src="https://www.svgrepo.com/show/486232/left-arrow-backup-2.svg" alt="Back" style={{ width: '24px', height: '24px', filter: 'invert(1)' }} />
          
//         </button>

//         <div className="relative flex flex-col items-center z-10">
//           <Heading size="heading2xl" as="h1" className="mt-10 md:text-3xl sm:text-[28px] text-white">
//             ВХОД:
//           </Heading>
//           <Heading as="h2" className="mt-5 text-white">
//             Введите номеру телефона:
//           </Heading>
//           <input
//             type="text"
//             placeholder="+7**********"
//             className={`mt-[39px] p-2 bg-transparent text-center placeholder-[#3F451C] input-hover-animation ${error ? 'input-error' : ''}`}
//             style={{
//               position: 'relative',
//               width: '90vw',
//               maxWidth: '90%',
//               height: '50px',
//               borderBottom: '2px solid #3F451C',
//             }}
//             value={cardNumber}
//             onChange={handleCardNumberChange}
//           />
//           {error && <p className="error-message">{error}</p>}
//           <Button
//             size="sm"
//             shape="round"
//             className="mb-5 mt-[55px] min-w-[82px] lg:text-[13px] bg-[#CEE2B7] text-black button-hover-animation"
//             style={{ backgroundColor: '#CEE2B7', color: 'black' }}
//             onClick={handleLogin}
//           >
//             Войти
//           </Button>
//         </div>
//       </div>
//     </>
//   );
// }
import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../../CartContext';
import { Button, Heading } from "../../components";
import '../../styles/ButtonStyles.css';  

export default function IPhone1415Pro9Page() {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('+7');
  const [error, setError] = useState(null);
  const { setUser } = useContext(CartContext);

  const handleCardNumberChange = (e) => {
    const input = e.target.value;

    // Если пользователь пытается удалить +7, это предотвратит его удаление
    if (input.startsWith('+7')) {
      setCardNumber(input);
    } else {
      setCardNumber('+7');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login_card', { phone: cardNumber });

      // Проверяем статус ответа
      if (response.data.ok) {
        setUser(response.data.data);
        navigate('/iphone1415pro1');
      } else {
        setError('Карта не найдена!');
      }
    } catch (error) {
      setError('Ошибка при входе');
      alert('Error logging in:', JSON.stringify(error));
    }
  };

  return (
    <>
      <div className="relative flex h-screen w-full flex-col items-center px-14 py-[0px] bg-[#6E742F]">
        <div className="absolute inset-0 bg-cover bg-no-repeat opacity-10 bg-[url('/public/images/img_iphone_14_15_pro.png')] z-0"></div>

        {/* Кнопка со стрелочкой */}
        <button 
          onClick={() => {navigate('/iphone1415pro8'); console.log("kkkk")}} 
          className="absolute top-4 left-4 z-20 p-2 rounded-full bg-transparent focus:outline-none"
        >
          <img src="https://www.svgrepo.com/show/486232/left-arrow-backup-2.svg" alt="Back" style={{ width: '24px', height: '24px', filter: 'invert(1)'}} />
        </button>

        <div className="relative flex flex-col items-center z-10">
          <Heading size="heading2xl" as="h1" className="mt-10 md:text-3xl sm:text-[28px] text-white">
            ВХОД:
          </Heading>
          <Heading as="h2" className="mt-5 text-white">
            Введите номер телефона:
          </Heading>
          <input
            type="text"
            placeholder="+7**********"
            className={`mt-[39px] p-2 bg-transparent text-center placeholder-[#3F451C] input-hover-animation ${error ? 'input-error' : ''}`}
            style={{
              position: 'relative',
              width: '90vw',
              maxWidth: '90%',
              height: '50px',
              borderBottom: '2px solid #3F451C',
            }}
            value={cardNumber}
            onChange={handleCardNumberChange}
          />
          {error && <p className="error-message">{error}</p>}
          <Button
            size="sm"
            shape="round"
            className="mb-5 mt-[55px] min-w-[82px] lg:text-[13px] bg-[#CEE2B7] text-black button-hover-animation"
            style={{ backgroundColor: '#CEE2B7', color: 'black' }}
            onClick={handleLogin}
          >
            Войти
          </Button>
        </div>
      </div>
    </>
  );
}
