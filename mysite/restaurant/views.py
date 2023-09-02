from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.http import HttpResponse, HttpResponseRedirect
from django.utils import timezone

import jdatetime
import datetime

import re

from .models import *


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
            if id == "":
                product = Product(category=category, name=name, price=price)
                product.save()
            else:
                product = get_object_or_404(Product, id=id)
                if "delete" in request.POST:
                    product.delete()
                else:
                    product.category = category
                    product.name = name
                    product.price = price
                    product.save()
            return redirect(reverse("restaurant:product_list"))
        except Exception:
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


def add_order(request):
    error_message = ""
    if request.method == "POST":
        try:
            number_of_products = 0
            pat1 = re.compile("^product(\d*)-id$")
            for key in request.POST:
                if request.POST[key] == "":
                    raise Exception("nothing should be empty.")
                if pat1.match(key):
                    number_of_products += 1
            customer_id = request.POST["customer_id"]
            customer = Customer.objects.get(id=customer_id)
            cur_datetime = datetime.datetime.now()
            order = Order(customer=customer, date=cur_datetime)
            order.save()
            for i in range(number_of_products):
                id = request.POST[f"product{i}-id"]
                product = Product.objects.get(id=id)
                number = request.POST[f"product{i}-number"]
                ProductsInOrder.objects.create(
                    order=order, product=product, number=number
                )
            return redirect(reverse("restaurant:add_order"))
        except Exception as e:
            error_message = "لطفا مقادیر را درست وارد کنید."

    persons = Customer.objects.all()
    appetizers = Product.objects.all().filter(category="appetizer")
    beverages = Product.objects.all().filter(category="beverage")
    meals = Product.objects.all().filter(category="meal")
    context = {
        "appetizers": appetizers,
        "beverages": beverages,
        "meals": meals,
        "persons": persons,
        "error_message": error_message,
    }
    return render(request, "restaurant/addorder.html", context)


def add_person(request):
    return redirect(reverse("restaurant:index"))


def order_list(request):
    from_date = datetime.datetime.min + datetime.timedelta(1)
    print(from_date)
    to_date = datetime.datetime.now()
    if request.method == "POST":
        try:
            jfrom_date = jdatetime.datetime.strptime(
                request.POST["from_date"], r"%Y/%m/%d %H:%M:%S"
            )
            jto_date = jdatetime.datetime.strptime(
                request.POST["to_date"], r"%Y/%m/%d %H:%M:%S"
            )
            from_date = jfrom_date.togregorian()
            to_date = jto_date.togregorian()
        except:
            pass
    orders = (
        Order.objects.filter(date__lte=to_date)
        .filter(date__gte=from_date)
        .order_by("-date")
    )

    output_orders = []
    total_sum = 0
    for order in orders:
        products_in_order = ProductsInOrder.objects.filter(order=order)
        order_sum = 0
        for product_in_order in products_in_order:
            order_sum += product_in_order.product.price * product_in_order.number
        total_sum += order_sum
        persian_date = jdatetime.datetime.fromgregorian(datetime=order.date).strftime(
            r"%Y-%m-%d %H:%M:%S"
        )
        output_orders.append(
            [
                order.id,
                f"{order.customer.first_name} {order.customer.last_name}",
                persian_date,
                order_sum,
            ]
        )
    context = {"output_orders": output_orders, "total_sum": total_sum}
    return render(request, "restaurant/orderlist.html", context)


def show_order(request, id):
    error_message = ""
    order = Order.objects.get(id=id)
    if request.method == "POST":
        try:
            number_of_products = 0
            pat1 = re.compile("^product(\d*)-id$")
            for key in request.POST:
                if request.POST[key] == "":
                    raise Exception("nothing should be empty.")
                if pat1.match(key):
                    number_of_products += 1
            customer_id = request.POST["customer_id"]
            customer = Customer.objects.get(id=customer_id)

            order.customer = customer
            order_datetime = jdatetime.datetime.strptime(
                request.POST["date"], r"%Y/%m/%d %H:%M:%S"
            ).togregorian()
            for product_in_order in ProductsInOrder.objects.filter(order=order):
                product_in_order.delete()
            order.date = order_datetime
            order.save()
            for i in range(number_of_products):
                product_id = request.POST[f"product{i}-id"]
                product = Product.objects.get(id=product_id)
                number = request.POST[f"product{i}-number"]
                ProductsInOrder.objects.create(
                    order=order, product=product, number=number
                )
            return redirect(reverse("restaurant:show_order", kwargs={"id": id}))
        except Exception as e:
            error_message = "لطفا مقادیر را درست وارد کنید."
    products_in_order = ProductsInOrder.objects.filter(order=order)
    ouptput_products = []
    for product_in_order in products_in_order:
        product = product_in_order.product
        number = product_in_order.number
        ouptput_products.append((product, number, product.price * number))

    customer = order.customer
    persons = Customer.objects.all()
    appetizers = Product.objects.all().filter(category="appetizer")
    beverages = Product.objects.all().filter(category="beverage")
    meals = Product.objects.all().filter(category="meal")
    context = {
        "appetizers": appetizers,
        "beverages": beverages,
        "meals": meals,
        "persons": persons,
        "error_message": error_message,
        "order": order,
        "customer": customer,
        "customer_full_name": customer.first_name + " " + customer.last_name,
        "order_persian_date": jdatetime.datetime.fromgregorian(
            datetime=order.date
        ).strftime(f"%Y/%m/%d %H:%M:%S"),
        "output_products": ouptput_products,
    }
    return render(request, "restaurant/showorder.html", context)
