# Sales CRM System

A full-stack Customer Relationship Management (CRM) system explicitly designed for cold-calling campaigns, sales script management, and lead tracking. 

Built with modern technologies to assure high performance, strict type safety, and real-time responsiveness.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) 
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat&logo=Prisma&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?&style=flat&logo=redis&logoColor=white)

---

## 🇷🇺 Описание проекта (Russian)

Полнофункциональная система управления взаимоотношениями с клиентами (CRM), разработанная специально для кампаний холодных звонков, управления скриптами продаж и отслеживания лидов.

### 🌟 Ключевые особенности
* **Панель управления (Dashboard):** Мощная аналитика с метриками успеха, конверсией, графиками звонков и визуализацией данных.
* **База клиентов:** Управление контактами, отслеживание истории звонков и подробные профили компаний с поддержкой импорта.
* **Управление проектами:** Группировка клиентов по кампаниям звонков и назначение им менеджеров.
* **Конструктор скриптов и шаблонов возражений:** Интегрированный справочник для операторов во время разговора.
* **Ролевая система:** Аутентификация и авторизация на базе JWT токенов.

### 🚀 Технологический стек
* **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Recharts.
* **Backend:** Node.js, Express, TypeScript, Prisma ORM, PostgreSQL.
* **Инфраструктура:** Docker & Docker Compose, Redis (для очередей и кэширования), BullMQ.

### ⚙️ Установка и запуск (Локально)
1. Склонируйте репозиторий: `git clone <repo-url>`
2. Перейдите в папку backend: `cd backend_Call-CRM`
3. Установите зависимости: `pnpm install`
4. Поднимите базу данных PostgreSQL и Redis в Docker: `docker-compose up -d`
5. Запустите миграции Prisma: `npx prisma db push`
6. Запустите backend-сервер: `pnpm dev` (запустится на порту 3001)
7. В другом терминале перейдите в frontend: `cd CRM_Frontend`
8. Установите зависимости и запустите: `npm install && npm run dev`

### 📞 Контакты
* **Телефон:** +79282152964
* **Email:** danielnunda@gmail.com / regildaniel2019@gmail.com

---

## 🇬🇧 Project Description (English)

A comprehensive Customer Relationship Management (CRM) built from the ground up to empower sales teams, organize cold calling campaigns, and keep track of leads and scripts effectively.

### 🌟 Core Features
* **Insightful Dashboard:** High-level metrics, conversion rates, call activity timelines, and interactive charts.
* **Client Management:** Track contacts, historical call records, and company profiles with bulk import capabilities.
* **Project Organization:** Group leads dynamically by call campaigns and assign operators.
* **Sales Scripts & Objection Handling:** Integrated reference tools that operators can read during live calls.
* **Role-based Authentication:** Secure JWT-based authentication flows.

### 🚀 Tech Stack
* **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Recharts.
* **Backend:** Node.js, Express, TypeScript, Prisma ORM, PostgreSQL.
* **Infrastructure:** Docker & Docker Compose, Redis (Queue/Cache), BullMQ.

### ⚙️ Setup & Installation (Local Development)
1. Clone the repository: `git clone <repo-url>`
2. Navigate to the backend directory: `cd backend_Call-CRM`
3. Install dependencies: `pnpm install`
4. Spin up the PostgreSQL database and Redis via Docker: `docker-compose up -d`
5. Run database migrations: `npx prisma db push`
6. Start the backend server: `pnpm dev` (Runs on port 3001)
7. Open a new terminal and navigate to the frontend: `cd CRM_Frontend`
8. Install packages and start the dev server: `npm install && npm run dev`

### 📞 Contact
* **Phone:** +79282152964
* **Email:** danielnunda@gmail.com / regildaniel2019@gmail.com

---

