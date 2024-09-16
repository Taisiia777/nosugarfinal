
// import React from 'react';
// import PropTypes from 'prop-types';
// import { Button } from "../../components";
// import { useNavigate } from 'react-router-dom';

// const PopUp = ({ onClose, children }) => {
//   const navigate = useNavigate(); // Используем hook useNavigate для навигации

//   return (
//     <div className="popup-overlay">
//       <div className="popup-container">
//         <div className="popup-header">
//           <h2 className="popup-title">Добавки</h2>
//           <Button className="popup-close" onClick={onClose}>
//             &times;
//           </Button>
//         </div>
//         <div className="popup-content">
//           {children}
//         </div>
//         <div className="popup-footer">
//           <Button 
//             className="bg-green-100 text-white rounded-full lg:text-[12px] px-2 py-2 mt-4 mx-auto"
//             onClick={() => navigate('/iphone1415pro2')}
//           >
//             Пропустить
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// PopUp.propTypes = {
//   onClose: PropTypes.func.isRequired,
//   children: PropTypes.node.isRequired,
// };

// export default PopUp;
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from "../../components";

const PopUp = ({ onClose, onSkip, children }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2 className="popup-title">Добавки</h2>
          <Button className="popup-close" onClick={onClose}>
            &times;
          </Button>
        </div>
        <div className="popup-content">
          {children}
        </div>
        <div className="popup-footer">
          <Button 
            className="bg-green-100 text-white rounded-full lg:text-[12px] px-2 py-2 mt-4 mx-auto"
            onClick={onSkip} // Изменяем обработчик на onSkip
          >
            Пропустить
          </Button>
        </div>
      </div>
    </div>
  );
};

PopUp.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired, // Добавляем onSkip как обязательный пропс
  children: PropTypes.node.isRequired,
};

export default PopUp;
