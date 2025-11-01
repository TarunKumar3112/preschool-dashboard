````markdown
# 🌈 Thailand Preschool Dashboard

A smart and modern preschool management system built with **React + Firebase + Google Sheets + Chart.js**, featuring dashboards for **Teachers**, **Parents**, and an integrated **n8n Chatbot Assistant** 🤖

---

## 🚀 Features

### 👩‍🏫 Teacher Dashboard
- Upload & manage student **marks**
- Record **attendance**, **moods**, and **notes**
- Visualize **class performance trends**
- Monitor **average attendance** & **class insights**

### 👨‍👩‍👧 Parent Dashboard
- Secure login for each parent
- View child’s:
  - 📅 **Attendance Calendar**
  - 😊 **Mood & Teacher Notes**
  - 📊 **Performance Charts (Marks Overview)**
- Data synced directly from **Google Sheets**

### 💬 Chatbot Assistant (via n8n)
- Appears on all pages (bottom-right 💬)
- Answers FAQs like:
  - “How’s my child’s attendance?”
  - “Who is the class teacher?”
  - “Show my child’s marks”
- Fully connected with your **n8n webhook**

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-------------|
| 🖥️ Frontend | React + Vite |
| 🔐 Auth | Firebase Authentication |
| 🗄️ Database | Firestore (Firebase) |
| 📈 Charts | Chart.js |
| 📋 Data Sync | Google Sheets (CSV fetch) |
| 🤖 Automation | n8n Webhooks |
| ☁️ Deployment | Vercel / Netlify |

---

## 🛠️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/TarunKumar3112/preschool-dashboard.git
cd preschool-dashboard
````

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Firebase

Create a file `src/firebase.js` and add your Firebase config:

```js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

---

### 4️⃣ Run the Project

```bash
npm run dev
```

Then open 👉 [http://localhost:5173](http://localhost:5173)

---

## 💬 Chatbot Setup (n8n)

1. In your **n8n** workspace, create a workflow:

   * **Webhook Trigger (POST)**
   * **OpenAI / Set Node** (generate replies)
   * **Respond to Webhook Node** with:

     ```json
     { "reply": "Hi! I'm your preschool assistant 🤖" }
     ```

2. Copy your webhook URL and paste it inside:

   ```js
   const N8N_WEBHOOK_URL = "https://myaidesigntools.app.n8n.cloud/webhook/10e67eae-ddb5-4955-80ba-d1632f71d9e9";
   ```

3. Save & Activate your workflow.

---

## 🧑‍🤝‍🧑 Collaboration Guide

### 👤 For Your Friend:

```bash
git clone https://github.com/TarunKumar3112/preschool-dashboard.git
cd preschool-dashboard
npm install
npm run dev
```

### 🪄 Make Updates:

```bash
git checkout -b feature-branch
# make your changes
git add .
git commit -m "Added new feature"
git push origin feature-branch
```

### 🔁 Send Back to You:

* Open the repo on GitHub
* Click **Compare & Pull Request**
* Add details & click **Create Pull Request**

---

## 🌍 Deployment

### 🚀 Deploy on Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Import your repo
3. Click **Deploy**
4. Get a live URL like:

   ```
   https://preschool-dashboard.vercel.app
   ```

### 🌐 Deploy on Netlify (Optional)

* Run `npm run build`
* Drag & drop the `/dist` folder into [Netlify Drop](https://app.netlify.com/drop)

---

## 🧠 Folder Structure

```
preschool-dashboard/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Chatbot.jsx
│   │   ├── LoginForm.jsx
│   │   ├── ParentDashboard.jsx
│   │   └── TeacherDashboard.jsx
│   ├── firebase.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
└── vite.config.js

---

## 💖 Credits

Built with ❤️ by [**Tarun Kumar**](https://github.com/TarunKumar3112)
for **Thailand Preschool** — empowering education through creativity 🧸

---

## 🧾 License

Open-source project — free to use and modify for educational purposes.

```
```
