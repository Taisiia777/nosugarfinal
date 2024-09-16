// import { Helmet } from "react-helmet";
import { Button, Heading, Img } from "../../components";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import QRCode from "qrcode.react";
import { useNavigate } from 'react-router-dom';

export default function IPhone1415Pro13Page() {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get('orderId');
    if (orderId) {
      setOrderId(orderId);
    }
  }, [location]);

  return (
    <>
      {/* <Helmet>
        <title>nosugar</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet> */}
      <div className="relative flex h-screen w-full flex-col items-center px-4 py-[15px] bg-[#6E742F]">
        <div className="absolute inset-0 bg-cover bg-no-repeat opacity-10 bg-[url('/public/images/img_iphone_14_15_pro.png')] z-0"></div>
        <Heading size="heading2xl" as="h1" className="mt-2 md:text-3xl sm:text-[28px]">
          Заказ от {orderId ? `#${orderId}` : 'Loading...'}
        </Heading>
        {orderId && (
          <QRCode
            value={orderId}
            size={316}
            className="mt-[22px] rounded-[40px]"
          />
        )}
        <Heading as="h2" className="mt-[23px]">
          Для получения заказа
          <br />
          покажите QR-код выше на кассе
        </Heading>
        <Heading as="h2" className="mt-[20px] !text-white_a700_7f">
          Номер заказа: #{orderId}
        </Heading>
        <Button onClick={() => navigate('/iphone1415pro12')} size="sm" shape="round" className="mt-[20px] min-w-[83px] lg:text-[13px]" style={{ backgroundColor: '#CEE2B7', color: 'black', zIndex:'2'}}>
          Назад
        </Button>
      </div>
    </>
  );
}
