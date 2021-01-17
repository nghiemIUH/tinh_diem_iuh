from django.shortcuts import render
from django.http import JsonResponse
from django.views import View
from . import models
# Create your views here.


class ViewMonHoc(View):

    def get(self, request):
        monhoc = models.MonHoc.objects.all()
        return render(request, 'them_mon_hoc.html', {'monhoc': monhoc})


class Diem(View):

    def get(self, request):
        return render(request, 'index.html', {'row': [i for i in range(1, 11)]})

    def post(self, request):
        data = request.POST
        diem_he_10 = [0]*10
        diem_he_4 = [0]*10
        tong_chi = [0]*10
        diemTK = []
        diemTH = []
        i = 1
        try:
            for i in range(1, 11):
                try:
                    tin_chi = int(data[f'tin-chi-{i}'])
                except:
                    continue
                tong_chi[i] = tin_chi
                for j in range(1, 6):
                    try:
                        diemTK.append(float(data[f'tk{j}-{i}']))
                    except:
                        pass
                trung_binh_tk = sum(diemTK)/len(diemTK)
                gk = float(data[f'gk-{i}'])
                ck = float(data[f'ck-{i}'])
                trung_binh_lt = round(trung_binh_tk*0.2+gk*0.3 + ck*0.5, 1)
                for j in range(1, 4):
                    try:
                        diemTH.append(float(data[f'th{j}-{i}']))
                    except:
                        print(f'error TH index {j}')

                if(len(diemTH) > 0):
                    chi_th = 1
                    # if tin_chi == 3:
                    #     chi_th = 1
                    # if tin_chi == 4:
                    #     chi_th = 2
                    trung_binh_th = sum(diemTH)/len(diemTH)
                    trung_binh_lt = round((chi_th*trung_binh_th+trung_binh_lt *
                                           (tin_chi-chi_th))/tin_chi, 1)

                diem_he_10[i] = trung_binh_lt
                if trung_binh_lt >= 9:
                    diem_he_4[i] = 4
                elif trung_binh_lt >= 8.5:
                    diem_he_4[i] = 3.8
                elif trung_binh_lt >= 8:
                    diem_he_4[i] = 3.5
                elif trung_binh_lt >= 7:
                    diem_he_4[i] = 3
                elif trung_binh_lt >= 6:
                    diem_he_4[i] = 2.5
                elif trung_binh_lt >= 5.5:
                    diem_he_4[i] = 2
                elif trung_binh_lt >= 5:
                    diem_he_4[i] = 1.5
                elif trung_binh_lt >= 4:
                    diem_he_4[i] = 1
                else:
                    diem_he_4[i] = 0

                tb_10 = round(sum([tong_chi[i]*diem_he_10[i]
                                   for i in range(len(tong_chi))])/sum(tong_chi), 1)
                tb_4 = round(sum([tong_chi[i]*diem_he_4[i]
                                  for i in range(len(tong_chi))])/sum(tong_chi), 1)

            return JsonResponse({'he10': diem_he_10, 'he4': diem_he_4, 'tb_10': tb_10, 'tb_4': tb_4})
        except:

            return JsonResponse({'error': i}, status=400)
