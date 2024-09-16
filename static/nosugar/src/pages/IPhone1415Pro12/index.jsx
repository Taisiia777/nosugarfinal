



// import { Helmet } from "react-helmet";
import { Img, Heading, Button } from "../../components";
import IPhone1415Pro12Row from "../../components/IPhone1415Pro12Row";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { CartContext } from '../../CartContext';

export default function IPhone1415Pro12Page() {
  const { cartItems, updateQuantity } = useContext(CartContext);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        window.Telegram.WebApp.ready();
        const initData = window.Telegram.WebApp.initData || '';
        const initUserId = JSON.parse(decodeURIComponent(new URLSearchParams(initData).get("user")))?.id || 0;
        const response = await axios.post('/api/get_orders_by_user', {
          _auth: initData,
            userId: initUserId,
        });
        if (response.data.ok) {
          // alert(JSON.stringify(response.data))
          setOrders(response.data.orders);
        } else {
          setError(response.data.err);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('ru-RU', options);
  };
  const handleShowQrClick = (orderId) => {
    navigate(`/IPhone1415Pro13?orderId=${orderId}`);
  };
  const renderOrdersInRows = () => {
    const reversedOrders = [...orders].reverse(); // Создание нового массива с реверсивным порядком элементов
    const rows = [];
    for (let i = 0; i < reversedOrders.length; i += 2) {
      rows.push(
        <div key={i} className="flex gap-[13px] self-stretch md:flex-row">
          <IPhone1415Pro12Row
            key={reversedOrders[i].id}
            orderdate={`Заказ ${reversedOrders[i].pickup_time}`}
            restaurantaddress={reversedOrders[i].dot}
            deliverytime={reversedOrders[i].pickup_time}
            showbutton={reversedOrders[i].paid ? "Получено" : "Ожидается"}
            price={`${reversedOrders[i].summ} RUB`}
            className="bg-light_green-900"
            onShowQr={() => handleShowQrClick(reversedOrders[i].id)}
          />
          {reversedOrders[i + 1] && (
            <IPhone1415Pro12Row
              key={reversedOrders[i + 1].id}
              orderdate={`Заказ ${reversedOrders[i + 1].pickup_time}`}
              restaurantaddress={reversedOrders[i + 1].dot}
              deliverytime={reversedOrders[i + 1].pickup_time}
              showbutton={reversedOrders[i + 1].paid ? "Получено" : "Ожидается"}
              price={`${reversedOrders[i + 1].summ} RUB`}
              className="bg-light_green-900"
              onShowQr={() => handleShowQrClick(reversedOrders[i + 1].id)}
            />
          )}
        </div>
      );
    }
    return rows;
  };
  return (
    <>
      {/* <Helmet>
        <title>nosugar</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet> */}
      <div className="relative flex h-screen w-full flex-col items-center px-4 py-[20px]" style={{ height: '100%', maxHeight:'100vh'}}>
        <div className="absolute inset-0 bg-cover bg-no-repeat bg-[#6E742F] h-full w-full" style={{zIndex: "-2"}}></div>
        <div className="absolute inset-0 bg-cover bg-no-repeat opacity-10 bg-[url('/public/images/img_iphone_14_15_pro.png')] h-full w-full" style={{zIndex: "-1"}}></div>
        <Heading as="h1" className="mt-[5px]">
          Мои заказы
        </Heading>
        <div className="flex w-[19%] flex-col items-center lg:w-full md:w-full" style={{ overflow: 'auto', minHeight: '70vh', maxHeight: '70vh'}}>
          {loading && <p>Загрузка...</p>}
          {error && <p>Ошибка: {error}</p>}
          {!loading && !error && renderOrdersInRows()}
        </div>
        <Button  onClick={() => navigate('/iphone1415pro11')} size="sm" shape="round" className="mt-[280px] min-w-[83px] lg:text-[13px]" style={{ backgroundColor: '#CEE2B7', color: 'black', zIndex:'2' }}>
          Назад
        </Button>
        {/* <div className="flex w-[19%] justify-center rounded-[20px] bg-green-100 p-[18px] lg:w-full md:w-full" style={{ backgroundColor: '#CEE2B7', color: 'black', display: 'flex', position: 'fixed', bottom: '20px', left: '20px', width: '90%' }}>
          <div className="flex w-[79%] items-center justify-between gap-5 lg:w-full md:w-full">
            <Img src="images/img_user.svg" alt="user" className="h-[30px] w-[30px] self-end" />
            <Img src="images/img_lock.svg" alt="lock" className="h-[30px] w-[30px] self-end" />
            <div className="relative h-[34px] w-[16%]">
              <div className="absolute right-[-7.00px] top-[0.38px] m-auto h-[15px] w-[20px] rounded-[5px] bg-light_green-900">
                <Heading size="headingxs" as="h1" className="absolute right-[3.00px] top-[0.00px] m-auto">
                  999
                </Heading>
              </div>
              <Img src="images/img_cart.svg" alt="cart" className="absolute bottom-[-0.38px] left-[0.00px] m-auto h-[30px] w-[30px]" />
            </div>
          </div>
        </div> */}
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
