from django.db import models


# Create your models here.
class Customer(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30, null=True)
    address = models.CharField(default="", max_length=500, null=True)
    is_male = models.BooleanField(default=True, null=True)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Product(models.Model):
    CATEGORIES = [
        ("beverage", "beverage"),
        ("meal", "meal"),
        ("appetizer", "appetizer"),
    ]
    category = models.CharField(max_length=10, choices=CATEGORIES, default="beverage")
    name = models.CharField(max_length=30, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=0)

    def __str__(self):
        return self.name


class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    products = models.ManyToManyField(Product, through="ProductsInOrder")
    date = models.DateTimeField()

class ProductsInOrder(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    number = models.IntegerField()

class Purchase(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    date = models.DateTimeField()
    number = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=0)
