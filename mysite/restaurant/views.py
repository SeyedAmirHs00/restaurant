from django.shortcuts import render, redirect, get_object_or_404
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
            return redirect(reverse("restaurant:product_list"))
        except KeyError:
            error_message = "محصول تکراری است."
        except:
            error_message = "لطفا مقادیر را درست وارد کنید."

    return render(
        request, "restaurant/addproduct.html", context={"error_message": error_message}
    )


def product_list(request):
    error_message = ""
    if request.method == "POST":
        try:
            id = request.POST["id"]
            category = request.POST["category"]
            name = request.POST["name"]
            price = request.POST["price"]
            product = get_object_or_404(Product, id=id)
            if "delete" in request.POST:
                product.delete()
            else:
                product.category = category
                product.name = name
                product.price = price
                product.save()
            return redirect(reverse("restaurant:product_list"))
        except Exception as e:
            print(e)
            error_message = "لطفا مقادیر را درست وارد کنید."

    appetizers = Product.objects.all().filter(category="appetizer")
    beverages = Product.objects.all().filter(category="beverage")
    meals = Product.objects.all().filter(category="meal")
    context = {
        "appetizers": appetizers,
        "beverages": beverages,
        "meals": meals,
        "error_message": error_message,
    }
    return render(request, "restaurant/productlist.html", context)
