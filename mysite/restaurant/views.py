from django.shortcuts import render, redirect
from django.urls import reverse
from django.http import HttpResponse, HttpResponseRedirect

from .forms import ProductForm
from .models import Product


# Create your views here.
def index(request):
    return render(request, "restaurant/index.html")


def add_product(request):
    error_message = ""
    if request.method == "POST":
        try:
            print(request.POST)
            category = request.POST["category"]
            name = request.POST["name"]
            price = request.POST["price"]
            try:
                product = Product.objects.get(name=name)
            except:
                product = None
            if product:
                raise KeyError("duplicate product")
            new_product = Product(category=category, name=name, price=price)
            new_product.save()
            return redirect(reverse("restaurant:index"))
        except KeyError:
            error_message = "محصول تکراری است."
        except:
            error_message = "لطفا مقادیر را درست وارد کنید."

    return render(request, "restaurant/addproduct.html", context = {"error_message": error_message})


def product_list(request):
    appetizers = Product.objects.all().filter(category="appetizer")
    beverages = Product.objects.all().filter(category="beverage")
    meals = Product.objects.all().filter(category="meal")
    context = {
        "appetizers": appetizers,
        "beverages": beverages,
        "meals": meals,
    }
    return render(request, "restaurant/productlist.html", context)