'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = () => {
    if (email && password) {
      localStorage.setItem('user', JSON.stringify({ email }));
      const now = Date.now();
        localStorage.setItem('lastLogin', now.toString());
      router.push('/dashboard');
    } else {
      alert('Preencha todos os campos!');
    }
  };

  return (
    <div>
      <h1>Cadastro</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignup}>Cadastrar</button>
    </div>
  );
}
