import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoyaltyCardPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    gender: 1,
    phone: '',
    birthday: '',
    code: '',
    referrerId: 0
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('/api/create_card', form);
      if (response.data.ok) {
        alert('Card created successfully');
        navigate('/iphone1415pro9');
      } else {
        alert('Failed to create card');
      }
    } catch (error) {
      console.error('Error creating card:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login_card', { code: form.code });
      if (response.data.ok) {
        // alert('Login successful');
        navigate('/iphone1415pro1');
      } else {
        alert('Failed to login');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="loyalty-card-page">
      <h1>Лояльность</h1>
      <div>
        <input type="text" name="firstName" placeholder="Имя" onChange={handleChange} />
        <input type="text" name="middleName" placeholder="Отчество" onChange={handleChange} />
        <input type="text" name="lastName" placeholder="Фамилия" onChange={handleChange} />
        <input type="text" name="gender" placeholder="Пол" onChange={handleChange} />
        <input type="text" name="phone" placeholder="Телефон" onChange={handleChange} />
        <input type="text" name="birthday" placeholder="День рождения" onChange={handleChange} />
        <input type="text" name="code" placeholder="Код" onChange={handleChange} />
        <input type="text" name="referrerId" placeholder="Реферер ID" onChange={handleChange} />
        <button onClick={handleRegister}>Зарегистрироваться</button>
        <button onClick={handleLogin}>Вход по карте</button>
      </div>
    </div>
  );
}
