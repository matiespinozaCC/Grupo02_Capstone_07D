from django.shortcuts import render
from django.http import HttpResponse
import firebase
# Create your views here.


 firebaseConfig = {
  apiKey: "AIzaSyBkb-EcRxHOmeaiwv32RvpbiBqhZmnz7RQ",
  authDomain: "planaway-440ba.firebaseapp.com",
  projectId: "planaway-440ba",
  storageBucket: "planaway-440ba.appspot.com",
  messagingSenderId: "1013793686325",
  appId: "1:1013793686325:web:10059ff420ec912f37427c"
}


TEMPLATE_DIRS = (
    'os.path.join(BASE_DIR, "templates"),'
)

def index(request):
    return render(request, "index.html")

def login(request):
    return render(request, "login.html")
