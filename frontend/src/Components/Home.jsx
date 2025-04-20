// pages/Home.js
import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import FileUpload from './FileUpload'
import AnomalyDashboard from './AnomalyDashboard'
import './font.css'
import Button from 'react-bootstrap/Button';

const Home = () => {
    // const navigate = useNavigate()
    const [showAnalysis, setShowAnalysis] = useState(false)

    const analysis = () => {
        setShowAnalysis(true)
    }

    return (
        <div className="p-6 min-h-screen">
            <h1 className="text-3xl font-bold mb-4 bg-black p-4 text-center bungee-spice-regular">Mini SOC Log Analyzer</h1>
            <div className="w-[75%] mx-auto">
                <FileUpload />
                {/* <button
                    className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => analysis()}
                >
                    Analyze
                </button> */}
                <Button variant="primary" size="lg" onClick={analysis}>
                    Analyze
                </Button>

                {showAnalysis &&
                    <div className='my-4 border-2 border-amber-200 rounded-2xl text-white p-4'>
                        <AnomalyDashboard />
                    </div>
                }

            </div>

        </div>
    )
}

export default Home
