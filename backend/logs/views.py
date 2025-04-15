from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework import status
from .serializers import LogFileSerializer
from .anomaly_detector import detect_anomalies
from .models import LogFile

class LogUploadView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, format=None):
        serializer = LogFileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "File uploaded successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AnomalyDetectionView(APIView):
    def get(self, request):
        # For now, pick the latest uploaded log file
        latest_log = LogFile.objects.last()
        if not latest_log:
            return Response({"error": "No log file found."}, status=status.HTTP_404_NOT_FOUND)

        log_path = latest_log.file.path
        suspicious_lines = detect_anomalies(log_path)

        return Response({
            "suspicious_entries": suspicious_lines,
            "count": len(suspicious_lines)
        }, status=status.HTTP_200_OK)