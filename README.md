# Mini Log SOC Analyzer

## Overview

The **Mini Log SOC Analyzer** is a web-based application designed for analyzing and categorizing log data, specifically from Apache web servers. It provides an intuitive and interactive interface to upload log files, parse the contents, and display the logs in a meaningful manner by categorizing them into different levels of severity such as **Info**, **Warning**, and **Critical**.

The project aims to offer a simple yet effective way to monitor log data for unusual patterns and gain insights into web server activities. It helps users identify potential anomalies based on specific patterns in status codes, IP addresses, and other log attributes.

## Features

- **Log File Upload**: Users can upload Apache log files for analysis.
- **Log Parsing**: The application parses log data to extract essential information such as IP addresses, timestamps, request statuses, etc.
- **Anomaly Categorization**: Logs are categorized based on the status code into **Info**, **Warning**, and **Critical**:
  - **Info**: HTTP status 200 (Successful requests)
  - **Warning**: HTTP status 3xx (Redirections)
  - **Critical**: HTTP status 4xx and 5xx (Client and Server Errors)
- **Anomaly Detection**: The app can detect and categorize anomalies based on repeated patterns and outliers.
- **Interactive Dashboard**: The categorized logs are displayed in an interactive, user-friendly interface with different sections for Info, Warning, and Critical logs.
- **Real-time Updates**: Users can upload new log files and instantly see categorized and analyzed results.

## Technologies Used

- **Frontend**:
  - ReactJS for the user interface.
  - Bootstrap for styling and responsive design.
  - Axios for making HTTP requests.
  - Chart.js for visualizing log data and anomaly trends.

- **Backend**:
  - Django (Python-based framework) for handling API requests and file uploads.
  - Django REST Framework for building the API.
  - Custom Python scripts for parsing and analyzing Apache log data.
  
- **Deployment**:
  - Docker for containerizing the application to ensure smooth deployment.
  - Docker Compose to manage multi-container applications (e.g., frontend and backend).

- **Other Tools**:
  - Git for version control.
  - Apache web server logs as the input source for analysis.

## Getting Started

### Prerequisites

1. **Docker**: Make sure Docker is installed on your machine.
2. **Docker Compose**: For running the application with multiple services.
3. **Python 3.x** and **Node.js** (for local development):
   - Install Python for backend dependencies.
   - Install Node.js and npm for frontend dependencies.

### Installation

#### 1. Clone the repository:

```bash
git clone https://github.com/yourusername/mini-soc-analyzer.git
cd mini-soc-analyzer
```

#### 2. Set up the backend (Django):

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows, use 'venv\Scripts\activate'
pip install -r backend/requirements.txt
python manage.py migrate
```

#### 3. Set up the frontend (React):

```bash
cd frontend
npm install
npm run dev
```

### Running the Application with Docker

```bash
docker-compose up --build
```

### Access the Application

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:8000`

## How It Works

1. **File Upload**: User uploads an Apache log file.
2. **Log Parsing**: Backend parses log lines using regex.
3. **Log Categorization**: Based on HTTP status codes.
4. **Data Display**: UI shows logs grouped as Info, Warning, and Critical.
5. **Anomaly Detection**: Detects suspicious patterns such as repeated requests or error spikes.

## Use Cases

- **Web Server Monitoring**
- **Anomaly Detection**
- **Incident Investigation**

## Challenges Faced & Solutions

- Efficient log parsing handled using regex in Python.
- Real-time UI updates using React state management and Axios.
- Enhanced anomaly detection using IP-based error grouping.

## Future Improvements

- Integrate ML-based anomaly detection.
- Add real-time log streaming.
- Implement alert/notification system.
