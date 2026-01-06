import { StrictMode } from 'react'
import { ClerkProvider } from "@clerk/clerk-react";
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import Header from './Utils/header.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
console.log(PUBLISHABLE_KEY);

createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} >
    <BrowserRouter>
          <Header />
          <main className='min-h-screen'>
            <App />
          </main>
    </BrowserRouter>
  </ClerkProvider>,
)
