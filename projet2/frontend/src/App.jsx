import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Bot from './components/Bot';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ProtectedRoute from "./components/ProtectedRoute";
import About from './pages/About';
import Appointment from './pages/Appointment';
import Contact from './pages/Contact';
import Doctors from './pages/Doctors';
import Home from './pages/Home';
import Login from './pages/Login';
import MyAppointments from './pages/MyAppointments';
import MyProfile from './pages/MyProfile';
import Paiement from './pages/Paiement';
import Prediction from './pages/Prediction';
import Visteenligne from './pages/visteenligne';

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer/>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/Contact' element={<Contact />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/virtual-visit' element={<Visteenligne />} />
        <Route path='/payment' element={<Paiement />} />
        <Route path='/prediction' element={<ProtectedRoute><Prediction /></ProtectedRoute>} />
        
      </Routes>
      <Bot />
      <Footer />
    </div>
  )
}

export default App;