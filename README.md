# Warranty
Warranty registration site with simple user form + admin search and editing capabilities in HEBREW.
### Visitor
Website visitor can register products for warranty

Integrated googles captcha v2 on regitration form

### Admin
Super Admin can create new admins with permissions.

Admin can search via email, invoice or product serial number

Admin can add/edit/delete user products

Admin can open new lab requests & add additional notes to requests

Admin can upload, view and delete "proof of purchase" image files on edit product page*

*only pjeg, jpg, png, pdf file type allowed up to 1mb. currenty uploading to the node server.

### Admin Labs
Lab forms available for each customer

Lab show customer details, Lab updates and payment status

Lab check "paid in advance" or "not paid"

Lab can add parts and repair costs

Sum total cost is calculated with check cost, parts & repair costs

Lab can update form status

Lab can add extra months of warranty when a form is closed

Once created a lab form will track the time passed since created and display with color codeing.

Closed lab forms will display the warranty time left until warranty is void.

# SETUP

1. Fork & Clone

2. Setup new mongodb

3. config env variables for port and dburl.

4. get new captch key / captch secret.

5. define upload folder (defaults to '/uploads').




