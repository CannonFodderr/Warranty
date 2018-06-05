# Warranty
Warranty registration site with simple user form + admin search and editing capabilities in HEBREW.

Website visitor can register products for warranty
Integrated googles captcha v2 on regitration form

Super Admin can create new admins with permissions.
Admin can search via email, invoice or product serial number
Admin can add/edit/delete user products
Admin can open new lab requests & add additional notes to requests
Admin can upload, view and delete "proof of purchase" image files on edit product page*

*only pjeg, jpg, png, pdf file type allowed up to 1mb. currenty uploading to the node server.


SETUP

Fork & Clone
Setup new mongodb
config env variables for port and dburl.
get new captch key / captch secret.
define upload folder (defaults to '/uploads').
seed new superadmin to db for first time use.



