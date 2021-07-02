from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

from .views import (
    BlogPostListCreateView,
    BlogPostRetrieveDeleteView,
    BlogPostUpdateView,
    PasswordUpdateView,
    SignupView,
    UserBlogPostListView,
    UserListView,
    UserRetrieveDeleteView,
)


urlpatterns = [
    # Signup view
    path('signup', SignupView.as_view()),

    # Token views
    path('token/obtain', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),

    # Blog post views
    path('p', BlogPostListCreateView.as_view()),
    path('p/<slug:slug>', BlogPostRetrieveDeleteView.as_view()),
    path('p/<slug:slug>/edit', BlogPostUpdateView.as_view()),

    # User views
    path('u', UserListView.as_view()),
    path('<str:username>/p', UserBlogPostListView.as_view()),
    path('<str:username>/change-password', PasswordUpdateView.as_view()),
    path('<str:username>', UserRetrieveDeleteView.as_view()),

]
