from django.urls import path

from . import views

app_name = "restaurant"
urlpatterns = [
    path("", views.index, name="index"),
    path("add_product", views.add_product, name="add_product"),
    path("product_list", views.product_list, name="product_list"),
]
