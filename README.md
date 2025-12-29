![Website](https://img.shields.io/website?up_message=online&url=https%3A%2F%2Fdirectchat.vercel.app)
![GitHub last commit](https://img.shields.io/github/last-commit/BenjaOliva/Direct-Chat-Web?label=Ultimo%20Commit)

# <img src="public/apple-icon.png" alt="Direct Chat Icon" width="65" height="65" style="vertical-align: middle; margin-right: 10px;" /> Direct Chat

Direct Chat is a modern, privacy-focused web application designed to initiate WhatsApp conversations immediately without the need to save phone numbers to your contacts first. It features a robust contact management system, custom message templates, and seamless import/export capabilities.

---

## 📑 Index

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [User Flows](#-user-flows)
  - [Sending a Message](#1-sending-a-message)
  - [Managing Saved Contacts](#2-managing-saved-contacts)
  - [Importing & Exporting Data](#3-importing--exporting-data)
- [Installation & Setup](#-installation--setup)

---

## 🚀 Features

### Core Functionality

- **Direct Messaging**: Open WhatsApp chats instantly by entering a phone number and an optional message.
- **Platform Handling**: Automatically detects if you are on Mobile or Desktop.
  - **Desktop**: Choose between **WhatsApp Web** or **WhatsApp Desktop App**.
  - **Mobile**: redirects directly to the app.
- **Country Code Detection**: Automatically detects your country for smarter phone input handling (defaulting to user IP location).

### Contact Management

- **Save Contacts**: Store frequently used numbers locally in your browser.
- **Duplicate Detection**: Smart validation prevents saving duplicate contacts (matching Phone + Country Code).
- **Search**: Instantly filter through your saved contacts list.
- **Edit & Delete**: Manage your list with ease, including an **"Undo"** option for accidental deletions.

### Message Templates

- **Suggested Messages**: Use predefined templates for common greetings or questions.
- **Customization**: Create, edit, and delete your own message templates.
- **Reset Ability**: Easily restore default message suggestions if needed.

### Data Portability

- **Import**: specific Excel (`.xlsx`) or CSV files to bulk add contacts. features smart duplicate skipping.
- **Export**: Download your entire contact list as an Excel file.

### UI/UX

- **Responsive Design**:
  - **Desktop**: Split-view layout (Form on the left, Data on the right).
  - **Mobile**: Optimized layout with **Drawers** for accessing Contacts and Messages.
- **Theming**: Full **Dark Mode** & **Light Mode** support.
- **Internationalization**: Fully translated into **English** and **Spanish**, persisting user preference.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Font**: [Inter](https://fonts.google.com/specimen/Inter) (via `next/font`)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Persistence**: `localStorage` (Client-side only architecture)
- **File Handling**: `xlsx` (SheetJS)
- **Toast Notifications**: `sonner`

---

## 🔄 User Flows

### 1. Sending a Message

1.  Select the **Country Code**.
2.  Enter the **Phone Number**.
3.  (Optional) Enter a **Message** or select one from the "Suggested Messages" panel.
4.  Click **"Open WhatsApp"**.
5.  _Result_: The app seamlessly redirects you to the active WhatsApp session.

### 2. Managing Saved Contacts

1.  Enter a Name and Phone Number in the main form.
2.  Click the **Save** button.
    - _Result_: Contact is saved to the local list.
    - _Validation_: If the contact exists, an error toast appears.
3.  **To Delete**: Click the trash icon next to a contact. A toast appears with an **"Undo"** button to reverse the action if clicked immediately.

### 3. Importing & Exporting Data

- **Export**: Click the **Download** icon in the Contacts panel to get a `.xlsx` file of all your saved contacts.
- **Import**:
  1.  Click the **Upload** icon.
  2.  Use the provided template or your own file (Requires headers: `Name`, `Phone`, `CountryCode`).
  3.  Drag and drop the file.
  4.  _Result_: New contacts are added; duplicates are automatically skipped and a summary toast is shown.

---

## 📦 Installation & Setup

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/direct-chat-app.git
    cd direct-chat-app
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Run the development server**:

    ```bash
    npm run dev
    ```

4.  **Open the app**:
    Visit `http://localhost:3000` in your browser.

---

_Verified mobile-responsive and accessible._
