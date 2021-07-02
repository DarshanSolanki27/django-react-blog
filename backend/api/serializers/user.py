from django.contrib.auth.models import User
from django.contrib.auth import password_validation

from rest_framework.serializers import (
    CharField, ModelSerializer, ValidationError)
from rest_framework.validators import UniqueValidator


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']
        extra_kwargs = {
            'username': {
                'max_length': 30,
                'label': 'Username'
            },
        }


class SignupSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']

        extra_kwargs = {
            'username': {
                'required': True,
                'max_length': 30,
                'validators': [
                    UniqueValidator(queryset=User.objects.all()), ],
                'label': 'Username',
            },
            'password': {
                'max_length': 50,
                'style': {
                    'input_type': 'password'
                },
                'write_only': True,
                'label': 'Password',
            }
        }

    def validate_password(self, value):
        try:
            password_validation.validate_password(value)
        except ValidationError as err:
            raise ValidationError(err)
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'], password=validated_data['password'])

        return user


class PasswordUpdateSerializer(ModelSerializer):
    old_password = CharField(
        max_length=50,
        label='Old Password',
        write_only=True,
        style={'input_type': 'password'})
    password = CharField(
        max_length=50,
        label='New Password',
        write_only=True,
        style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['id', 'old_password', 'password']

    def validate_password(self, value):
        try:
            password_validation.validate_password(value)
        except ValidationError as err:
            raise ValidationError(str(err))
        return value

    def validate_old_password(self, password):
        user = self.context['request'].user
        if not user.check_password(password):
            raise ValidationError(
                {'Incorrect Password': 'Old password is incorrect'})
        return password

    def update(self, instance, validated_data):
        instance.set_password(validated_data['password'])
        instance.save()

        return instance
