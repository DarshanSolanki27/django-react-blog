# Django imports
from django.contrib.auth.models import User

# Django rest framework impors
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import (
    ListAPIView,
    ListCreateAPIView,
    RetrieveDestroyAPIView,
    UpdateAPIView,
)
from rest_framework.permissions import (
    AllowAny,
    IsAdminUser,
    IsAuthenticated,
)
from rest_framework.status import (
    HTTP_201_CREATED, HTTP_400_BAD_REQUEST)

# Models and Serializers
from .models import BlogPost
from .serializers.blog_post import BlogPostSerializer, UpdateBlogPostSerializer
from .serializers.user import (
    SignupSerializer,
    PasswordUpdateSerializer,
    UserSerializer)


"""
Signup view
"""


class SignupView(APIView):
    serializer_class = SignupSerializer

    def post(self, request, format=None):
        username = request.data.get('username')
        if username is None:
            return Response({'username': 'Username Required'}, status=HTTP_400_BAD_REQUEST)

        password = request.data.get('password')
        if password is None:
            return Response({'password': ['Password Required']}, status=HTTP_400_BAD_REQUEST)

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.create(validated_data=serializer.validated_data)
            user.save()

            return Response(status=HTTP_201_CREATED)

        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


"""
User views
"""


class UserListView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        return (IsAdminUser(),)


class UserRetrieveDeleteView(RetrieveDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "username"

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny(), ]

        return [IsAuthenticated(), ]


class PasswordUpdateView(UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = PasswordUpdateSerializer
    lookup_field = 'username'

    def get_permissions(self):
        return [IsAuthenticated(), ]


"""
Blog post views
"""


class BlogPostListCreateView(ListCreateAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny(), ]

        return [IsAuthenticated(), ]


class BlogPostRetrieveDeleteView(RetrieveDestroyAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    lookup_field = 'slug'

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny(), ]

        return [IsAuthenticated(), ]


class BlogPostUpdateView(UpdateAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = UpdateBlogPostSerializer
    lookup_field = 'slug'

    def get_permissions(self):
        return [IsAuthenticated(), ]


class UserBlogPostListView(ListAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer

    def get_permissions(self):
        return [AllowAny(), ]

    def get_queryset(self):
        return self.queryset.filter(author=self.kwargs['username'])
