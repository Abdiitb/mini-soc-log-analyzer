// pages/Home.js
import React from 'react'
import { useNavigate } from 'react-router-dom'
import FileUpload from './FileUpload'

const Home = () => {
    const navigate = useNavigate()

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Mini SOC Log Analyzer</h1>
            <FileUpload />
            <button
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => navigate('/dashboard')}
            >
                Go to Log Dashboard
            </button>
        </div>
    )
}

export default Home
