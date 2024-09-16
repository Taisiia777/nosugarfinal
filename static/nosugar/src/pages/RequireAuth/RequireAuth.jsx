import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RequireAuth = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post('/api/checkIsAuth', {
          userId: window.Telegram.WebApp.initDataUnsafe.user.id,
          _auth: window.Telegram.WebApp.initData
        });
        if (!response.data.isAuth) {
          alert("Вам нужно зарегистрироваться")
        } else {
            navigate('/iphone1415pro8');
        }
      } catch (error) {
        console.error("Authorization check failed:", error);
        alert(JSON.stringify(error))
        alert("Вам нужно зарегистрироваться")

      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <div></div>;
  }

  return <>{children}</>;
};

export default RequireAuth;
