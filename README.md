
# E‑commerce Product Management System
A TypeScript-based inventory management application built for the TypeScript & Advanced JavaScript SBA.
This project interacts with the DummyJSON Products API and provides a functional UI for browsing, sorting, filtering, and managing product data.

---

## 📦 Project Overview
This application demonstrates TypeScript fundamentals, OOP principles, asynchronous programming, error handling, and API integration.
It includes a responsive UI built with HTML, TailwindCSS, and DaisyUI.

The system allows users to:

- View products in a dynamic table
- Search by text or product ID
- Filter by category
- Sort by fields such as price, title, or category
- Add, update, and delete products locally
- Interact with modals for editing and creating products

---

## 🧱 Folder Structure

```bash
src/
├── models/
│ └── Product.ts
├── services/
│ └── apiService.ts
├── utils/
│ ├── discountCalculator.ts
│ ├── errorHandler.ts
│ └── taxCalculator.ts
└── index.ts
```


---

## 🛠️ Technologies Used
- **TypeScript**
- **JavaScript (ES6+)**
- **HTML5**
- **TailwindCSS + DaisyUI**
- **DummyJSON API**
- **OOP Principles**
- **Async/Await & Promises**
- **vite**

---

## 🚀 Features

### Product Management
- Dynamic table rendering
- Local CRUD operations
- Modal-based editing and creation
- Internal state tracking (`productsList`, `targetID`, `lastID`)

### API Integration
- Fetch full inventory
- Fetch categories
- Sort products
- Filter by category
- Search by text or ID
- Graceful error handling with custom error classes

### UI/UX
- Responsive table layout
- DaisyUI components
- Clean modal interactions
- Real-time search
- Category sidebar

---

## 📥 Installation & Setup

```bash
git clone https://github.com/chadgarc/SBA6-E-Commerce-System.git
cd e-commerce-system/dev
pnpm install
pnpm dev
```

You can also open the prohect with vite or using the index inside docs, or just open [GitHub Pages](https://chadgarc.github.io/SBA6-E-Commerce-System/)

## 🧪 Testing
- All API functions tested via console logs and UI interactions
- Error handling validated with invalid IDs and failed requests
- DOM interactions tested across add/update/delete flows

## 📝 Reflection (300 words)
I implemented this project by combining TypeScript’s type safety with object‑oriented programming to create a structured and predictable system. The core of the application is theProduct  class, which models each item returned from the DummyJSON API. Adapting parts of my previous SBA code from JavaScript to TypeScript required careful attention to types, especially when working with DOM elements such as inputs, dialogs, and table rows. Explicit typing made the UI logic more reliable and easier to debug.

One of the biggest challenges was managing the DOM for a table-based interface. I had never built a dynamic table before, so I had to rethink how updates, deletions, and re-renders should work. Delegating events to the table and extracting IDs usingclosest('tr'). Another challenge was simulating updates and deletions, since the DummyJSON API does not persist changes. I solved this by maintaining an internal product list that mirrors the table state. I avoided using localStorage because filtering or searching would reset the UI anyway.

Asynchronous operations were easier than expected. At first, ```fetch```  ```async```/```await``` felt confusing, but reviewing the DummyJSON documentation and practicing with smaller examples helped me understand how Promises resolve. I created dedicated service functions for fetching inventory, categories, sorting, and searching, each wrapped in ```try```/```catch```  blocks. My custom error classes allowed me to handle failures gracefully without breaking the UI.

Overall, this project strengthened my understanding of TypeScript, OOP, and asynchronous programming. It also helped me design a clean, responsive UI using DaisyUI and Tailwind, focusing on usability and clarity. Despite challenges, I’m proud of the final result and how much more confident I feel working with TypeScript and APIs.