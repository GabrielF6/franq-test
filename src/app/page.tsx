"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './login.module.css';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (!email || !password || typeof window === 'undefined') {
      alert('Preencha todos os campos!');
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

    const user = storedUsers.find((u: { email: string }) => u.email === email);

    if (user) {
      if (user.password === password) {
        localStorage.setItem('user', JSON.stringify({ email }));
        localStorage.setItem('lastLogin', Date.now().toString());
        router.push('/dashboard');
      } else {
        alert('Senha incorreta!');
      }
    } else {
      alert('Usuário não encontrado. Por favor, cadastre-se.');
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <h1 className={styles.title}>Login</h1>
      <input
        className={`${styles.input} ${styles.inputMobile}`}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className={`${styles.input} ${styles.inputMobile}`}
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className={`${styles.button} ${styles.buttonMobile}`} onClick={handleLogin}>
        Entrar
      </button>
      <button className={styles.buttonLink} onClick={() => router.push('/signup')}>
        Cadastrar
      </button>
    </div>
  );
}
