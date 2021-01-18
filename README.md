# Online Shop

## Purpose

It's an important skill, that cannot be learned in form
of syntax, to figure out models for an App.

In this exercise I want you to think about and create,
the model for a simple online shop.

## Models

### User (easy)

OFC every shop needs a user/authentication system, besides
the normal fields like name, email, password..

What extra fields would you need for this kind of shop? 
Which information is important to the shop-owner and the customer?

### Item (medium)

A shop would be boring without things to sell.
What would you include in an Item model?
Think about the things you see in online shops that you know.

### Order (hard)

When a customer picks items he adds them into a basket.
Let's say this happens in the frontend... in the end the customer
will place an order, so a list of items and amounts...
Try to create a model for this, including all the important
information that the shop-owner needs to process the order,
and send out the package.

### Extras

You may create extra models that i did not mention here, but this
is not striclty required.

Try to get as far as you can. Try to use a structur that takes one
file per model.

You dont have to create routes, but: it should not thow any errors.

### User Roles

  - User (Customer)
  - Owner
  - Accounting / Finance
  - Logistics

### Processes (will become routes)

#### Order

  1. Basket Case :D (User)
     User creates a list of items that he want to buy,
     reserve the items temporarily, so othe users can see
     a reduced amount of available items.
  2. Order is placed (User)
     User confirms a basket and says he want to buy the
     items in the basket. Item availability will be checked,
     items reserved, address, delivery and payment information
     stored with the order. (Continue shopping)
  3. Payment is confirmed (3rd party, Bank, PayPal, Accounting)
  4. Customer gets Invoice / Order Confirmation
  5. Order Processing / Confection (Logistics, Status: Preparing)
  6. Status: Shipping (Logistics)
  7. Status: Delivered (Logistics)

#### Order is cancelled  

  1. (Optional) Process return delivery (Logistics)
  2. (Optional) Check condition of item (Logistics)
  3. (Optional) Put back into inventory (Logistics)
  4. (Optional) Wire refund (Accounting)
  5. Get customer feedback

### Routes

Assume all CRUD routes for each model.
Important: Think about who will be able to access those routes :D
  - List users: Staff only ...
  - List / Delete / Patch orders: Staff only ...

#### Routes for Orders (business case)

##### POST /order/create {} (User)

##### PATCH /order/modify { items: [item,qty] } (User)
This cannot happen with order status != basket
Responds with a Total (Costs + Shipping + VAT)

##### POST /order/place { paymentMethod, deliveryMethod, address } (User)
Reponds with an Invoice id, confirmation

##### POST /order/payment/confirm { transactionId } (User, Payment Provider, Accounting)
Backend can check transactionId with payment provider and
set payment status to paid.

##### POST /order/approve (Accounting)

##### POST /order/delivery { trackingId, deliveryDate } (Logistics)

##### POST /order/delivery/status { status } (Logistics)
