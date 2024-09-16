// import { Helmet } from "react-helmet";
import { Img, Heading, Button } from "../../components";
import React from "react";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { CartContext } from '../../CartContext';

export default function IPhone1415Pro11Page() {
  const navigate = useNavigate();
  const { user } = useContext(CartContext);
  const [phoneNumber, setPhoneNumber] = useState('');
  const { cartItems, updateQuantity } = useContext(CartContext);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    // Проверяем, что Telegram WebApp SDK доступен
    if (window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();

      const initData = window.Telegram.WebApp.initData || '';

      const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe || {};

      const initUserId = JSON.parse(decodeURIComponent(new URLSearchParams(initData).get("user")))?.id || 0;
      const fetchPhoneNumber = async () => {
        try {
          const response = await axios.post('/api/getPhone', {
            _auth: initData,
            userId: initUserId,
          });
          setPhoneNumber(response.data.phone_number);
        } catch (error) {
        } finally {

        }
      };

      fetchPhoneNumber();

    } else {
      console.error('Telegram WebApp SDK is not available');
    }
  }, []);

  return (
    <>
      {/* <Helmet>
        <title>nosugar</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet> */}
      <div className="relative flex h-screen w-full flex-col items-center px-4 py-[20px]">
        <div className="absolute inset-0 bg-cover bg-no-repeat bg-[#6E742F] h-full w-full" style={{zIndex: "-2"}}></div>
        <div className="absolute inset-0 bg-cover bg-no-repeat opacity-10 bg-[url('/public/images/img_iphone_14_15_pro.png')] h-full w-full" style={{zIndex: "-1"}}></div>
        <div className="flex w-[19%] flex-col items-center gap-8 lg:w-full md:w-full">
          <Heading as="h1">Ваш аккаунт</Heading>
          <div className="self-stretch">
            <div className="flex items-center gap-[18px]">
              <div className="flex flex-col items-center justify-center p-[25px] sm:p-4" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', marginTop: '-40px'}}>
                <div style={{width:'90px', height:'90px', backgroundColor: '#CEE2B7', borderRadius: '50%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginRight: '20px' }}>
                  <Img src="images/img_lock_black_900.svg" alt="lock" className="h-[20px] w-[320px]" style={{ zoom: '2.5' }}/>
                </div>
                <Heading size="headingxl" as="h2" className="mb-[26px] self-end md:text-[22px]">
                  {phoneNumber}
                </Heading>
              </div>
            </div>
            <div className="mt-[-27px] flex flex-col gap-[7px]">
              <Button size="md" className="w-full rounded-[20px] lg:text-[17px] sm:px-4" style={{ backgroundColor: '#CEE2B7', color: 'black' }}>
                МОИ БАЛЛЫ: {user.balance}
              </Button>
              <Button onClick={() => navigate('/iphone1415pro12')} color="light_green_900" size="md" className="w-full rounded-[20px] lg:text-[17px] sm:px-4" style={{ zIndex: '2', cursor: 'pointer'}}>
                МОИ ЗАКАЗЫ
              </Button>
              {/* <Button color="light_green_900" size="md" className="w-full rounded-[20px] lg:text-[17px] sm:px-4">
                ПРОГРАММА ЛОЯЛЬНОСТИ
              </Button> */}
            </div>
          </div>
          <div className="mt-[30px] flex flex-col items-center gap-2.5">
            {/* <Button size="sm" shape="round" className="min-w-[84px] lg:text-[13px]" style={{ backgroundColor: '#CEE2B7', color: 'black' }}>
              Выйти
            </Button> */}
            <div className="flex w-[19%] justify-center rounded-[20px] bg-green-100 p-[18px] lg:w-full md:w-full" style={{ backgroundColor: '#CEE2B7', color: 'black', display: 'flex', position: 'fixed', bottom: '20px', left: '20px', width: '90%' }}>
              <div className="flex w-[79%] items-center justify-between gap-5 lg:w-full md:w-full">
                <Img onClick={() => navigate('/iphone1415pro11')} src="images/Person_fill.svg" alt="user" className="h-[30px] w-[30px] self-end" style={{ cursor:'pointer'}}/>
                <Img onClick={() => navigate('/iphone1415pro1')} src="images/img_lock.svg" alt="lock" className="h-[30px] w-[30px] self-end" style={{ cursor:'pointer'}} />
                <div className="relative h-[34px] w-[16%]">
                  <div className="absolute right-[-7.00px] top-[0.38px] m-auto h-[15px] w-[20px] rounded-[5px] bg-light_green-900">
                    <Heading size="headingxs" as="h1" className="absolute right-[3.00px] top-[0.00px] m-auto">
                      {totalItems}
                    </Heading>
                  </div>
                  <Img onClick={() => navigate('/iphone1415pro2')} src="images/shopping-basket_unfill.svg" alt="cart" className="absolute bottom-[-0.38px] left-[0.00px] m-auto h-[30px] w-[30px]" style={{ cursor:'pointer'}} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
