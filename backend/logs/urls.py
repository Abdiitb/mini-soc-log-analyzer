from django.urls import path
from .views import LogUploadView

urlpatterns = [
    path('upload-log/', LogUploadView.as_view(), name='upload-log'),
]