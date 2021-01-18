from django.urls import path
from . import views
urlpatterns = [
    path('', views.Diem.as_view(), name='diem'),
    path('mon-hoc/', views.ViewMonHoc.as_view(), name='monhoc'),
    path('get-mon-hoc/', views.APIMonHoc.as_view())
]
