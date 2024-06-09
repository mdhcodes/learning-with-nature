# Create forms from models.

from django import forms
from .models import Resources

# Create a Resources ModelForm.
class CreateResourcesForm(forms.ModelForm):
    # Specify the name of the model to use.
    class Meta:
        model = Resources
        fields = ('lesson', 'notes', 'image', 'doc_upload') #'__all__'
        # Hide fields and style Django forms with built-in widgets.
        # Disable fields
        widgets = {
            # 'id': forms.HiddenInput(), 
            'lesson': forms.HiddenInput(),
            'notes': forms.Textarea(attrs={'class': 'form-control'}),
            # ERROR - AttributeError at /get_edit_form  'ImageField' object has no attribute 'is_hidden'
            # https://stackoverflow.com/questions/55564645/the-object-has-no-attribute-is-hidden-with-django
            # 'image': forms.ImageField(),
            # 'doc_upload': forms.FileField(),

            # https://stackoverflow.com/questions/72465585/how-to-style-a-imagefield-in-django-froms-using-widget
            # https://stackoverflow.com/questions/67137718/image-fields-or-boolean-fields-in-django-forms-widgets
            # 'image': forms.ImageField(
                # widget = forms.FileInput(attrs={'class': 'form-control', 'accept': '.png,.jpeg,.jpg,.bmp'})
                # ),
            # 'doc_upload': forms.FileInput(attrs={'class': 'form-control', 'accept': '.doc,.docx,.pdf'}),
            # 'author': forms.HiddenInput(),
        }