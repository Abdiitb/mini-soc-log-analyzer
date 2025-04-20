from django.urls import path
from .views import LogUploadView, FilterLogsByStatusCodeView, CategorizeAnomaliesByReasonView

urlpatterns = [
    path('upload-log/', LogUploadView.as_view(), name='upload-log'),
    path('filter-logs-by-status/', FilterLogsByStatusCodeView.as_view(), name='detect-anomalies'),
    path('filter-logs-by-reason/', CategorizeAnomaliesByReasonView.as_view(), name='detect-anomalies'),
]