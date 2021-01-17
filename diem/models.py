from django.db import models

# Create your models here.


class MonHoc(models.Model):
    ten = models.CharField(max_length=200, unique=True)
    thuc_hanh = models.BooleanField(default=False)
    tong_chi = models.IntegerField()
    chi_th = models.IntegerField(default=0, blank=True)
