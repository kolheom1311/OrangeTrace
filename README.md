<p align="center">
  <a href="https://orange-trace.vercel.app" target="_blank">
    <img src="public/mail-logo.png" width="200" alt="OrangeTrace Logo">
  </a>
</p>

# OrangeTrace 🍊

OrangeTrace is a modern, full-stack web application built with Next.js and Firebase, designed to bring transparency to the agricultural supply chain. It connects farmers, aggregators, and buyers, providing a seamless platform for tracking produce from farm to table.

## ✨ Key Features

-   **Multi-Role System:** Dedicated dashboards and functionalities for **Farmers**, **Buyers**, and **Aggregators**.
-   **Product Marketplace:** Farmers can list their produce, and buyers can browse and purchase fresh goods.
-   **E-commerce Functionality:** A complete shopping experience with a cart, checkout, and order management.
-   **Payment Integration:** Secure payments handled via **Razorpay**.
-   **Real-time Order Tracking:** Users can track the status and location of their orders.
-   **QR Code Integration:** Scan QR codes on products to trace their origin and journey through the supply chain.
-   **Freshness Checker:** An innovative tool to help assess the freshness of produce.
-   **Secure Authentication:** Robust user registration, login, and session management using Firebase Authentication.
-   **Analytics Dashboard:** Visual representation of sales, orders, and other key metrics.

## 🚀 Tech Stack

-   **Framework:** [Next.js (13.5+)](https://nextjs.org/) (with App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Backend & Database:** [Firebase](https://firebase.google.com/) (Firestore, Firebase Authentication, Firebase Storage)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
-   **Payment Gateway:** [Razorpay](https://razorpay.com/)
-   **Deployment:** Recommended on [Vercel](https://vercel.com/)

## 👨‍💻 Team Members

| Name | Role/Contribution | Work Done | Key Technologies | Project Focus | Notes |
|------|------------------|----------|----------------|--------------|-------|
| [Om Kolhe](https://orange-trace.vercel.app/about#cto) | CTO | Platform architecture ownership, designed multi-role system boundaries, defined Firestore collection schema, structured QR traceability pipeline, set scalability standards | Next.js, TypeScript, Firebase, Razorpay, System Design | AI supply-chain traceability, reliability, system scalability | Design documentation and data contracts pending |
| [Mohit Patil](https://orange-trace.vercel.app/about#ceo) | CEO | Backend engineering leadership, implemented Firebase Authentication (login, registration, email verification, sessions), built marketplace backend, integrated Razorpay payments, structured real-time order tracking, defined analytics data flow, supervised ML pipeline integration | Node.js, Express, Firebase (Firestore, Storage, Auth), Python, OpenCV, CNN | Secure e-commerce, orange classification & freshness analysis, AI model integration | Backend roadmap and analytics spec to be documented |
| Kshitij Sadegaonkar | Logo Designer | Created brand logo, color identity, and visual design direction for product recognition | Adobe Illustrator, Figma | Brand Identity & Visual Assets | UI branding guideline draft to be added |



## 🛠️ Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18.x or later)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   A Firebase project.
-   A Razorpay account for API keys.

### 1. Clone the Repository

```bash
git clone https://github.com/kolheom1311/OrangeTrace.git
cd orangetrace
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of the project and add the following environment variables. You can get these values from your Firebase project settings and Razorpay dashboard.

```env
# Firebase Public Config
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK (Service Account)
# 1. Generate a private key JSON file in your Firebase project settings.
# 2. Copy the contents of the JSON file and place them in /confidential/firebase-admin.json
# Ensure this file is listed in .gitignore and NEVER committed to version control.

# Razorpay API Keys
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Other
NEXT_PUBLIC_BASE_URL=http://localhost:3000 # Or Production/Deployment Link.
```
- Download the Firebase admin JSON file.
- Rename the file to `firebase-admin.json`.
- Move it to the `confidential` folder.


### 4. Run the Development Server

```bash
npm run dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000).

## 📁 Project Structure

-   `app/`: Contains all the routes and pages of the application, following the Next.js App Router structure.
-   `components/`: Shared React components used throughout the application (e.g., UI elements, layout).
-   `lib/`: Core logic, utility functions, and Firebase configuration/actions.
-   `contexts/`: React contexts for managing global state (e.g., Auth, Theme).
-   `public/`: Static assets like images and fonts.
-   `email-templates/`: HTML templates for transactional emails.
-   `hooks/`: Custom React hooks.
-   `types/`: TypeScript type definitions.

## 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License.
