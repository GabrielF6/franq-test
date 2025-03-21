'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import './signup.css'; // Importando o CSS

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPassword = (password: string) => {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  const handleSignup = () => {
    setEmailError('');
    setPasswordError('');

    if (!email || !password) {
      alert('Preencha todos os campos!');
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError('Digite um e-mail válido (ex: usuario@email.com)');
      return;
    }

    if (!isValidPassword(password)) {
      setPasswordError('A senha deve ter pelo menos 8 caracteres, incluindo letras, números e um caractere especial.');
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

    if (storedUsers.some((user: { email: string }) => user.email === email)) {
      alert('Este e-mail já está cadastrado! Faça login.');
      return;
    }

    const newUser = { email, password };
    localStorage.setItem('users', JSON.stringify([...storedUsers, newUser]));

    alert('Cadastro realizado com sucesso! Faça login.');
    router.push('/');
  };

  return (
    <div className="signup-wrapper">
      <h1 className="title">Cadastrar</h1>
      <input
        type="email"
        className="input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {emailError && <p className="error-text">{emailError}</p>}

      <input
        type="password"
        className="input"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {passwordError && <p className="error-text">{passwordError}</p>}

      <button className="button" onClick={handleSignup}>Cadastrar</button>
      <button className="button" onClick={() => router.push('/')}>Voltar para Login</button>
    </div>
  );
}
