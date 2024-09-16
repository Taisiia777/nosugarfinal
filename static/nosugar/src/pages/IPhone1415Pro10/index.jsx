// import { Helmet } from "react-helmet";
import { Button, Heading } from "../../components";
import React from "react";
import { useNavigate } from 'react-router-dom';
import '../../styles/ButtonStyles.css';  

export default function IPhone1415Pro8Page() {
  const navigate = useNavigate();

  return (
    <>
      {/* <Helmet>
        <title>nosugar</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet> */}
      <div className="relative flex h-screen w-full flex-col items-center px-14 py-[0px] bg-[#6E742F]">
      <div className="absolute inset-0 bg-cover bg-no-repeat opacity-10 bg-[url('/public/images/img_iphone_14_15_pro.png')] z-0"></div>

        <Heading size="heading2xl" as="h1" className="mt-[42px] md:text-3xl sm:text-[28px]">
          Регистрация:
        </Heading>
        <div className="flex w-[19%] flex-col gap-[7px] lg:w-full md:w-full" style={{marginTop: '20px'}}>
          <Button href="https://registration.lo.cards/?hash=f9d3RWkbXpaazNmr" size="md" style={{ backgroundColor: '#CEE2B7', color: 'black', zIndex: '2' }} className="w-[100%] rounded-[20px] lg:text-[17px] sm:px-4 button-hover-animation">
          СТАНДАРТНАЯ РЕГИСТРАЦИЯ
         </Button>
         {/* <Button 
  onClick={() => navigate('/iphone1415pro8')} 
  style={{ zIndex: '2', padding: '0', position: 'relative', backgroundColor: '#000' }} 
  size="md" 
  className="w-[100%] h-[100px] rounded-[20px] lg:text-[17px] sm:px-4 overflow-hidden button-hover-animation"
>
  <img 
    src="images/img_image_2.png" 
    alt="imagettwo" 
    className="absolute inset-0 h-full w-full object-contain" 
  />
</Button>
          <Button onClick={() => navigate('/iphone1415pro8')} color="light_green_900" style={{ zIndex: '2' }} size="md" className="w-[100%] rounded-[20px] lg:text-[17px] sm:px-4 button-hover-animation">
            ДИАБЕТ
          </Button> */}
        </div>
        </div>
 
    </>
  );
}
