from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework import status
from .serializers import LogFileSerializer
from .anomaly_detector import detect_anomalies
from .models import LogFile
import re
from collections import defaultdict
from datetime import datetime, timedelta

# Apache log regex
LOG_PATTERN = re.compile(
    r'(?P<ip>\S+) \S+ \S+ \[(?P<datetime>[^\]]+)\] '
    r'"(?P<method>\S+)? (?P<path>.*?) (?P<protocol>HTTP/\d\.\d)?" '
    r'(?P<status>\d{3}) \S+'
)

# Suspicious patterns
SUSPICIOUS_PATHS = ['/admin', '/login', '/wp-admin']
SUSPICIOUS_METHODS = ['DELETE', 'PUT', 'TRACE', 'OPTIONS']
NORMAL_HOURS = range(6, 24)  # 6 AM to 11:59 PM

def parse_apache_time(timestr):
    return datetime.strptime(timestr, "%d/%b/%Y:%H:%M:%S %z")

def categorize_status(status_code):
    code = int(status_code)
    if 100 <= code < 400:
        return "INFO"
    elif 400 <= code < 500:
        return "WARNING"
    else:
        return "CRITICAL"

def categorize_status(status_code):
    code = int(status_code)
    if 100 <= code < 400:
        return "INFO"
    elif 400 <= code < 500:
        return "WARNING"
    else:
        return "CRITICAL"

def detect_anomalies(log_path):
    anomalies = []

    with open(log_path, 'r') as file:
        for line in file:
            match = LOG_PATTERN.match(line)
            if match:
                data = match.groupdict()
                data['severity'] = categorize_status(data['status'])

                # if data['severity'] in ['CRITICAL']:
                anomalies.append(data)
                
    return anomalies

# def detect_anomalies_by_reason(log_path):
#     anomalies = []
#     ip_timestamps = defaultdict(list)
#     ip_errors = defaultdict(int)

#     with open(log_path, 'r') as file:
#         for line in file:
#             match = LOG_PATTERN.match(line)
#             if match:
#                 data = match.groupdict()
#                 data['severity'] = categorize_status(data['status'])

#                 # Convert time string
#                 try:
#                     dt = parse_apache_time(data['datetime'])
#                 except:
#                     continue

#                 ip = data['ip']
#                 status_code = int(data['status'])
#                 method = data['method']
#                 path = data['path'].lower()

#                 # 1. Requests from same IP in short time
#                 ip_timestamps[ip].append(dt)

#                 # 2. Repeated 4xx/5xx errors from same IP
#                 if status_code >= 400:
#                     ip_errors[ip] += 1

#                 # 3. Suspicious paths
#                 if any(path.startswith(s) for s in SUSPICIOUS_PATHS):
#                     data['anomaly_reason'] = "Suspicious path access"
#                     anomalies.append(data)
#                     continue

#                 # 4. Too many 404s
#                 if status_code == 404:
#                     data['anomaly_reason'] = "Request to non-existent page"
#                     anomalies.append(data)
#                     continue

#                 # 5. Unusual request methods
#                 if method in SUSPICIOUS_METHODS:
#                     data['anomaly_reason'] = f"Suspicious HTTP method: {method}"
#                     anomalies.append(data)
#                     continue

#                 # 6. Request outside normal hours
#                 if dt.hour not in NORMAL_HOURS:
#                     data['anomaly_reason'] = "Request outside normal hours"
#                     anomalies.append(data)
#                     continue

#     # 7. Add brute-force detection (e.g., > 20 requests in 1 min)
#     # for ip, timestamps in ip_timestamps.items():
#     #     timestamps.sort()
#     #     for i in range(len(timestamps) - 20):
#     #         if timestamps[i+20] - timestamps[i] < timedelta(minutes=1):
#     #             anomalies.append({
#     #                 "ip": ip,
#     #                 "anomaly_reason": "Too many requests in short time (possible DoS/Brute-force)",
#     #                 "count": 21,
#     #                 "first_request": timestamps[i].isoformat(),
#     #                 "last_request": timestamps[i+20].isoformat()
#     #             })
#     #             break  # report once per IP

#     # 8. Repeated 4xx/5xx errors from IP
#     for ip, count in ip_errors.items():
#         if count > 10:
#             anomalies.append({
#                 "ip": ip,
#                 "anomaly_reason": f"{count} repeated 4xx/5xx errors (possible malicious activity)"
#             })


#     return anomalies

def detect_anomalies_by_reason(log_path):
    anomalies = []
    ip_timestamps = defaultdict(list)
    ip_errors = defaultdict(int)
    ip_logdata = defaultdict(list)  # Keep all logs per IP to reuse for brute-force/anomalies

    with open(log_path, 'r') as file:
        for line in file:
            match = LOG_PATTERN.match(line)
            if match:
                data = match.groupdict()
                data['severity'] = categorize_status(data['status'])
                # print(type(data['datetime']))

                try:
                    dt = parse_apache_time(data['datetime'])
                    data['datetime'] = dt.isoformat()
                    print(data['datetime'])
                except Exception as e:
                    data['datetime'] = None

                ip = data['ip']
                status_code = int(data['status'])
                method = data['method']
                path = data['path'].lower()
                protocol = data['protocol']

                # Track timestamps for brute-force detection
                ip_timestamps[ip].append(dt)

                # Save full log data for later use
                ip_logdata[ip].append({
                    'ip': ip,
                    'datetime': dt.isoformat(),
                    'method': method,
                    'path': path,
                    'protocol': protocol,
                    'status': status_code
                })

                base_data = {
                    'ip': ip,
                    'datetime': data['datetime'],
                    'method': method,
                    'path': path,
                    'protocol': protocol,
                    'status': status_code,
                    'severity': data['severity']
                }

                # 1. Suspicious paths
                if any(path.startswith(s) for s in SUSPICIOUS_PATHS):
                    base_data['anomaly_reason'] = "Suspicious path access"
                    anomalies.append(base_data)
                    continue

                # 2. Too many 404s
                if status_code == 404:
                    base_data['anomaly_reason'] = "Request to non-existent page"
                    anomalies.append(base_data)
                    continue

                # 3. Suspicious HTTP methods
                if method in SUSPICIOUS_METHODS:
                    base_data['anomaly_reason'] = f"Suspicious HTTP method: {method}"
                    anomalies.append(base_data)
                    continue

                # 4. Request outside normal hours
                if dt.hour not in NORMAL_HOURS:
                    base_data['anomaly_reason'] = "Request outside normal hours"
                    anomalies.append(base_data)
                    continue

                # 5. Track 4xx/5xx errors
                if status_code >= 400:
                    ip_errors[ip] += 1

    # 6. Brute-force detection (> 20 reqs in 1 min)
    for ip, timestamps in ip_timestamps.items():
        timestamps.sort()
        for i in range(len(timestamps) - 20):
            if timestamps[i + 20] - timestamps[i] < timedelta(minutes=1):
                anomalies.append({
                    'ip': ip,
                    'datetime': timestamps[i].isoformat(),
                    'method': "N/A",
                    'path': "N/A",
                    'protocol': "N/A",
                    'status': "N/A",
                    'anomaly_reason': "Too many requests in short time (possible DoS/Brute-force)"
                })
                break

    # 7. Repeated 4xx/5xx errors
    for ip, count in ip_errors.items():
        if count > 10:
            anomalies.append({
                'ip': ip,
                'datetime': "N/A",
                'method': "N/A",
                'path': "N/A",
                'protocol': "N/A",
                'status': "N/A",
                'anomaly_reason': f"{count} repeated 4xx/5xx errors (possible malicious activity)"
            })

    return anomalies

class FilterLogsByStatusCodeView(APIView):
    def get(self, request):
        # For now, pick the latest uploaded log file
        latest_log = LogFile.objects.last()
        if not latest_log:
            return Response({"error": "No log file found."}, status=status.HTTP_404_NOT_FOUND)

        log_path = latest_log.file.path
        suspicious_lines = detect_anomalies(log_path)

        # Initialize categories for info, warning, and critical
        info_logs = []
        warning_logs = []
        critical_logs = []

        # Loop through detected anomalies and categorize by status code
        for anomaly in suspicious_lines:
            status_code = anomaly.get("status")
            # log_entry = {
            #     "ip": anomaly.get("ip"),
            #     "status": anomaly.get("status"),
            #     "date_time": anomaly.get("datetime")
            # }

            # Categorize based on status code
            if status_code == 200:
                info_logs.append(anomaly)
            elif status_code.startswith("3"):  # Any 3xx status code
                warning_logs.append(anomaly)
            elif status_code.startswith("4") or status_code.startswith("5"):  # 4xx and 5xx
                critical_logs.append(anomaly)

        # Prepare the response
        return Response({
            "info": info_logs,
            "warning": warning_logs,
            "critical": critical_logs
        }, status=status.HTTP_200_OK)

class CategorizeAnomaliesByReasonView(APIView):
    def get(self, request):
        # For now, pick the latest uploaded log file
        latest_log = LogFile.objects.last()
        if not latest_log:
            return Response({"error": "No log file found."}, status=status.HTTP_404_NOT_FOUND)

        log_path = latest_log.file.path
        suspicious_lines = detect_anomalies_by_reason(log_path)

        # Categorize anomalies by reason
        categorized_anomalies_by_reason = {}

        for anomaly in suspicious_lines:
            anomaly_reason = anomaly.get("anomaly_reason", "Unknown")
            anomaly_object = {
                "ip": anomaly.get("ip"),
                "status": anomaly.get("status"),
                "date_time": anomaly.get("date_time"),
                "severity": anomaly.get("severity")
            }

            # Add to the category of anomaly_reason
            if anomaly_reason not in categorized_anomalies_by_reason:
                categorized_anomalies_by_reason[anomaly_reason] = []

            categorized_anomalies_by_reason[anomaly_reason].append(anomaly_object)

        return Response(categorized_anomalies_by_reason, status=status.HTTP_200_OK)

# class AnomalyDetectionView(APIView):
#     def get(self, request):
#         # Get latest uploaded log file
#         latest_log = LogFile.objects.last()
#         if not latest_log:
#             return Response({"error": "No log file found."}, status=status.HTTP_404_NOT_FOUND)

#         log_path = latest_log.file.path
#         suspicious_lines = detect_anomalies(log_path)

#         return Response({
#             "suspicious_entries": suspicious_lines,
#             "count": len(suspicious_lines)
#         }, status=status.HTTP_200_OK)

class LogUploadView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, format=None):
        serializer = LogFileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "File uploaded successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)