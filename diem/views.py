from django.shortcuts import render
from django.views import View
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.http import HttpResponseRedirect
from . import serializer
from . import models
# Create your views here.


class ViewMonHoc(APIView):

    def get(self, request):
        monhoc = models.MonHoc.objects.all()
        return render(request, 'them_mon_hoc.html', {'monhoc': monhoc})

    def post(self, request):
        data = request.data
        ten = data['ten']
        thuc_hanh = 'on' == data['thuc_hanh']
        tong_chi = int(data['tong_chi'])
        chi_th = 0
        if thuc_hanh:
            chi_th = int(data['chi_th'])
        monHoc = models.MonHoc(
            ten=ten, thuc_hanh=thuc_hanh, tong_chi=tong_chi, chi_th=chi_th)
        monHoc.save()
        return JsonResponse({'ten': ten, 'thuc_hanh': thuc_hanh, 'tong_chi': tong_chi, 'chi_th': chi_th})


class Diem(View):

    def get(self, request):
        monHoc = models.MonHoc.objects.all()
        return render(request, 'index.html', {'row': [i for i in range(1, 11)], 'monHoc': monHoc})


class APIMonHoc(APIView):

    def post(self, request):
        try:
            id_mon_hoc = request.data['id']
            monHoc = models.MonHoc.objects.get(id=id_mon_hoc)
            data = serializer.MonHocSerializer(monHoc).data
            return Response(data, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
