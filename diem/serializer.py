from .models import MonHoc
from rest_framework import serializers


class MonHocSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonHoc
        fields = '__all__'
