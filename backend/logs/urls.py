from django.urls import path
from .views import LogUploadView, AnomalyDetectionView

urlpatterns = [
    path('upload-log/', LogUploadView.as_view(), name='upload-log'),
    path('detect-anomalies/', AnomalyDetectionView.as_view(), name='detect-anomalies'),
]