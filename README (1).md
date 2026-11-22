# 🍔 QuickBite – Canteen Pre-Order & Pickup Queue System

A responsive, web-based canteen pre-order and pickup queue system. Students can browse the menu, pre-order food, pick a pickup slot and track their order. Canteen staff can manage the menu and move orders through the queue.

🔗 **Live Demo:** _add your GitHub Pages link here_

## ✨ Features

- **Responsive web interface** – works on mobile, tablet and desktop
- **Structured forms** – add, update and delete menu items (Admin Panel); place orders with name, roll number and pickup slot
- **Search, filtering and categories** – search food, filter by category (Meals, Snacks, Drinks, Desserts), sort by price or name; search orders by token, name or roll number
- **Status / progress tracking** – Placed → Preparing → Ready → Picked, shown as a board with progress and a "Now Serving" display
- **Dashboard** – total orders, revenue, orders in queue, ready orders, orders by status and top selling items
- **Input validation** – clear success and error messages for all forms (empty fields, invalid name or roll number, invalid price or stock, duplicate items, stock limits)
- **Animations and colour theme** – animated gradient header, card hover effects, toast messages and an automatic dark mode

## 🛠️ Tech Stack

| Technology | Use |
|---|---|
| HTML5 | Page structure |
| CSS3 | Styling, animations, responsive layout |
| JavaScript (Vanilla) | Logic, validation, dashboard |
| localStorage | Saving data in the browser |

## 📁 Project Structure

```
├── index.html    # Page structure
├── style.css     # Styling and animations
├── script.js     # Application logic
└── README.md     # Project documentation
```

## 🚀 How to Run

1. Download or clone this repository
2. Keep `index.html`, `style.css` and `script.js` in the same folder
3. Open `index.html` in any browser

No installation or server needed.

## 📖 How to Use

1. **Menu** – search or filter food and click **Add +**
2. **Cart** – enter your name and roll number, choose a pickup slot and click **Place Order**. You will get a token such as `T101`
3. **Queue** – staff move the order forward using the button on each card (Start Cooking → Mark Ready → Handed Over). Ready tokens appear in **Now Serving**
4. **Admin** – add, edit or delete menu items and change stock with the + / − buttons
5. **Dashboard** – view summary and statistics

## ⚠️ Note

Data is stored in the browser's localStorage, so it stays after refresh but is not shared between devices. A backend and database can be added in future to make it multi-user.

## 🔮 Future Improvements

- Login for students and admin
- Backend and database (Node.js / Firebase)
- Online payment
- Order notifications (SMS / email)

## 👨‍💻 Author

**Your Name** – _Your Roll No / Course_
