'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styled from 'styled-components';

const SignupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #a0e5bb 0%, #fad0c4 100%);
  font-family: 'Arial', sans-serif;
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  padding: 1rem;
  margin: 0.5rem 0;
  width: 300px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: 0.3s;

  &:focus {
    border-color: #3da8a3;
  }

  @media (max-width: 600px) {
    width: 250px;
  }
`;

const Button = styled.button`
  padding: 1rem;
  margin: 0.5rem 0;
  width: 300px;
  background-color: #2e8b6c;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background-color: #fad0c4;
  }

  @media (max-width: 600px) {
    width: 250px;
  }
`;

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = () => {
    if (!email || !password) {
      alert('Preencha todos os campos!');
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
    <SignupWrapper>
      <Title>Cadastrar</Title>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleSignup}>Cadastrar</Button>
    </SignupWrapper>
  );
}
