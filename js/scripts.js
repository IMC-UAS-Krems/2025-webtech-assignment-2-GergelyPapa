
// Cart list

const cart = []



// Webshop Items List

const webshopItems = [

  { 
    id: 1,
    name: "Bread",
    category: "Food",
    price: 12.00,
    img: "img/item01.jpg",
    desc: "Freshly baked bread, perfect for everyday meals and sandwiches."
  },
  { 
    id: 2,
    name: "Apple",
    category: "Fruit",
    price: 18.00,
    img: "img/item02.jpg",
    desc: "Crisp and juicy apples, ideal for a healthy snack or dessert."
  },
  { 
    id: 3,
    name: "Onion",
    category: "Vegetables",
    price: 25.00,
    img: "img/item03.jpg",
    desc: "Fresh onions that add rich flavor to soups, sauces, and main dishes."
  },
  { 
    id: 4,
    name: "Eggs",
    category: "Food",
    price: 15.00,
    img: "img/item04.jpg",
    desc: "Farm fresh eggs, great for breakfast, baking, or cooking."
  },
  { 
    id: 5,
    name: "Milk",
    category: "Food",
    price: 14.00,
    img: "img/item05.jpg",
    desc: "Fresh milk, perfect for drinking, coffee, cereals, or cooking."
  },
{ 
  id: 6,
  name: "Water",
  category: "Drink",
  price: 4.50,
  img: "img/item06.jpg",
  desc: "Refreshing bottled water, perfect for staying hydrated throughout the day."
},
{ 
  id: 7,
  name: "Chocolate",
  category: "Food",
  price: 9.90,
  img: "img/item07.jpg",
  desc: "Smooth and rich chocolate bar, ideal for a sweet treat or dessert."
},
{ 
  id: 8,
  name: "Watermelon",
  category: "Fruit",
  price: 6.80,
  img: "img/item08.jpg",
  desc: "Fresh and juicy watermelon, perfect for hot days and healthy snacks."
},
{ 
  id: 9,
  name: "Banana",
  category: "Fruit",
  price: 3.20,
  img: "img/item09.jpg",
  desc: "Ripe bananas, great for breakfast, smoothies, or quick energy."
},
{ 
  id: 10,
  name: "Meat",
  category: "Food",
  price: 22.50,
  img: "img/item10.jpg",
  desc: "High-quality fresh meat, suitable for cooking hearty meals."
}

  
]



// Render webshop cards (Bootstrap grid)

const grid = document.getElementById("itemsGrid")

for (let i = 0; i < webshopItems.length; i++) {
  const item = webshopItems[i]

  const col = document.createElement("div")
  col.className = "col-12 col-md-6 col-lg-4"

  col.innerHTML = `
    <div class="card h-100 shadow-sm border-0">
      <img src="${item.img}" id="cardItemImg" class="card-img-top" alt="${item.name}">
      <div class="card-body d-flex flex-column">
        <div class="d-flex justify-content-between align-items-start gap-2">
          <h5 class="card-title mb-1">${item.name}</h5>
          <span class="badge text-bg-light border" id="cardItemCategory">${item.category}</span>
        </div>
        <p class="card-text text-secondary">${item.desc}</p>

        <div class="mt-auto d-flex justify-content-between align-items-center">
          <span class="fw-semibold">€${item.price.toFixed(2)}</span>
          <button class="btn btn-outline-success btn-sm" data-id="${item.id}">
            Add
          </button>
        </div>
      </div>
    </div>
  `

  grid.appendChild(col)
}



// Add to cart 

document.addEventListener("click", (e) => {
  if (!e.target.matches("button[data-id]")) return

  const id = parseInt(e.target.dataset.id)
  const item = webshopItems.find(i => i.id === id)
  const cartItem = cart.find(i => i.id === id)

  if (cartItem) {
    cartItem.qty++
  } else {
    cart.push({
      ...item,
      qty: 1
    })
  }

  updateCartCount()
  console.log(cart)
})



// Cart quantity badge update

function updateCartCount() {
  let totalQty = 0

  for (let i = 0; i < cart.length; i++) {
    totalQty += cart[i].qty
  }

  document.getElementById("cartCount").innerText = totalQty
}



// Popup Open / Close (Cart modal)

function openCart() {
  renderCart()
  document.getElementById("cartModal").classList.add("show")
  document.getElementById("cartModal").style.display = "block"
}

function closeCart() {
  document.getElementById("cartModal").classList.remove("show")
  document.getElementById("cartModal").style.display = "none"
}



// Helper functions for totals

function getTotalQuantity() {
  let totalQty = 0
  for (let i = 0; i < cart.length; i++) {
    totalQty += cart[i].qty
  }
  return totalQty
}

function getSubtotal() {
  let subtotal = 0
  for (let i = 0; i < cart.length; i++) {
    subtotal += cart[i].price * cart[i].qty
  }
  return subtotal
}

function getDiscount(subtotal) {
  // 25% discount if total quantity is 3 or more
  return getTotalQuantity() >= 3 ? subtotal * 0.25 : 0
}



// Insert items into the Popup Window

function renderCart() {
  const cartBody = document.getElementById("cartBody")
  cartBody.innerHTML = ""

  if (cart.length === 0) {
    cartBody.innerHTML = "<p class='text-muted'>Your cart is empty.</p>"
    return
  }

  for (let i = 0; i < cart.length; i++) {
    const item = cart[i]

    cartBody.innerHTML += `
      <div class="d-flex justify-content-between align-items-center border-bottom py-2">
        <div>
          <strong>${item.name}</strong><br>
          <small>€${item.price.toFixed(2)}</small>
        </div>

        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${item.id}, 1)">+</button>
        </div>

        <div class="fw-semibold">
          €${(item.price * item.qty).toFixed(2)}
        </div>

        <button class="btn btn-sm btn-outline-danger" onclick="removeItem(${item.id})">✕</button>
      </div>
    `
  }

  const t = getTotals()

  cartBody.innerHTML += `
    <div class="pt-3">
      <div class="d-flex justify-content-between">
        <span>Subtotal</span>
        <span>€${t.subtotal.toFixed(2)}</span>
      </div>

      ${t.discount > 0 ? `
      <div class="d-flex justify-content-between text-success">
        <span>Discount (25%)</span>
        <span>-€${t.discount.toFixed(2)}</span>
      </div>` : ""}

      <div class="d-flex justify-content-between">
        <span>Tax (20%)</span>
        <span>€${t.tax.toFixed(2)}</span>
      </div>

      <hr>
      <div class="d-flex justify-content-between fw-bold">
        <span>Total</span>
        <span>€${t.total.toFixed(2)}</span>
      </div>
    </div>
  `
}



// Checkout

function openCheckout() {
  closeCart()
  document.getElementById("checkoutModal").classList.add("show")
  document.getElementById("checkoutModal").style.display = "block"
}

function closeCheckout() {
  document.getElementById("checkoutModal").classList.remove("show")
  document.getElementById("checkoutModal").style.display = "none"
}

function submitCheckout() {
  const form = document.getElementById("checkoutForm")
  if (!form.checkValidity()) {
    form.reportValidity()
    return
  }

  const itemsSnapshot = cart.map(x => ({ ...x }))
  const t = getTotals()

  closeCheckout()

  renderConfirmation(itemsSnapshot, t)
  openConfirmation()

  cart.length = 0
  updateCartCount()
  renderCart()
}


// Cart item add/remove/delete


function changeQty(id, amount) {
  const item = cart.find(i => i.id === id)
  if (!item) return

  item.qty += amount

  if (item.qty <= 0) {
    removeItem(id)
    return
  }

  updateCartCount()
  renderCart()
}


function removeItem(id) {
  const index = cart.findIndex(i => i.id === id)
  if (index !== -1) {
    cart.splice(index, 1)
  }

  updateCartCount()
  renderCart()
}

// Calculate Tax
const TAX_RATE = 0.20

function getTotalQuantity() {
  let totalQty = 0
  for (let i = 0; i < cart.length; i++) totalQty += cart[i].qty
  return totalQty
}

function getSubtotal() {
  let subtotal = 0
  for (let i = 0; i < cart.length; i++) subtotal += cart[i].price * cart[i].qty
  return subtotal
}

function getDiscount(subtotal) {
  return getTotalQuantity() >= 3 ? subtotal * 0.25 : 0
}

function getTotals() {
  const subtotal = getSubtotal()
  const discount = getDiscount(subtotal)
  const discounted = subtotal - discount
  const tax = discounted * TAX_RATE
  const total = discounted + tax
  return { subtotal, discount, discounted, tax, total }
}



// Confirmation Window


function openConfirmation() {
  document.getElementById("confirmationModal").classList.add("show")
  document.getElementById("confirmationModal").style.display = "block"
}

function closeConfirmation() {
  document.getElementById("confirmationModal").classList.remove("show")
  document.getElementById("confirmationModal").style.display = "none"
}

function renderConfirmation(itemsSnapshot, t) {
  let itemsHtml = ""
  for (let i = 0; i < itemsSnapshot.length; i++) {
    const item = itemsSnapshot[i]
    itemsHtml += `
      <div class="d-flex justify-content-between border-bottom py-2">
        <div>
          <strong>${item.name}</strong><br>
          <small>€${item.price.toFixed(2)} × ${item.qty}</small>
        </div>
        <div class="fw-semibold">€${(item.price * item.qty).toFixed(2)}</div>
      </div>
    `
  }
  document.getElementById("confItems").innerHTML = itemsHtml

  document.getElementById("confTotals").innerHTML = `
    <div class="d-flex justify-content-between"><span>Subtotal</span><span>€${t.subtotal.toFixed(2)}</span></div>
    ${t.discount > 0 ? `<div class="d-flex justify-content-between text-success"><span>Discount (25%)</span><span>-€${t.discount.toFixed(2)}</span></div>` : ""}
    <div class="d-flex justify-content-between"><span>Tax (20%)</span><span>€${t.tax.toFixed(2)}</span></div>
    <hr>
    <div class="d-flex justify-content-between fw-bold"><span>Total</span><span>€${t.total.toFixed(2)}</span></div>
  `
}
