from django import forms


class ProductForm(forms.Form):
    name = forms.CharField(max_length=30, widget=forms.TextInput(attrs={"placeholder": "چلو گوشت",}))
    price = forms.DecimalField(
        max_digits=10, decimal_places=0, widget=forms.NumberInput(attrs={"placeholder": "100000"})
    )
