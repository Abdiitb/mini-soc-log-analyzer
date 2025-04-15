// import { useState, useEffect } from 'react';
import React from 'react';
// import './App.css';
// import FileUpload from './Components/FileUpload.jsx';
import Home from './Components/Home';
import AnomalyDashboard from './Components/AnomalyDashboard';
import { Route, Routes } from 'react-router-dom';
// import AnomalyDashboard from './Components/AnomalyDashboard.jsx';

function App() {

  return (
    <>
      {/* <h1 className='bg-gray-800 text-white p-4'>Mini SOC Log Analyzer</h1>
      <FileUpload /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<AnomalyDashboard />} />
      </Routes>
      {/* <AnomalyDashboard /> */}
    </>
  )
}

export default App
