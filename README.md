# ReadyToEaT

ReadyToEat is a fullstack web application that enables modern digital management of restaurants and online food orders. It was developed in the context of the Web Programming course at ESTG – Polytechnic of Leiria, applying technologies like Node.js, ExpressJS, MongoDB, and Angular.

The platform simulates a real digital ecosystem for the restaurant industry, where:

* Customers can browse menus, place orders for delivery or dine-in, and manage their profiles.
* Restaurants can manage menus, dishes, orders, and restaurant information.
* Administrators can validate new restaurants, manage platform data, and access graphical dashboards with real-time statistics.

---

## Tech Stack

* Backend: Node.js, ExpressJS, MongoDB, EJS (for admin interface)
* Frontend: Angular
* REST API: Documented with Swagger
* Authentication: JSON Web Tokens (JWT) for Angular, Session Cookies for admin panel
* Styling: Bootstrap 5, Angular Material

---

## Project Structure

* Angular Frontend (Customers): [http://localhost:4200](http://localhost:4200)
* ExpressJS Backend/Admin Panel (Restaurants & Admin): [http://localhost:3000](http://localhost:3000)

---

##  User Roles & Access

The platform includes 3 distinct user profiles:

### 1. Customer

* Access via: [http://localhost:4200](http://localhost:4200)
* Actions: Browse menus, place orders, view order history, edit profile
* Available test accounts:

  * Email: [pedro.rocha@gmail.com](mailto:pedro.rocha@gmail.com) | Password: 123
  * Email: [sofia.almeida@gmail.com](mailto:sofia.almeida@gmail.com) | Password: 123
  * Email: [joaquim.faria@gmail.com](mailto:joaquim.faria@gmail.com) | Password: 123

### 2. Restaurant Manager

* Access via: [http://localhost:3000](http://localhost:3000)
* Actions: Register restaurant, manage menus, dishes, orders, and restaurant details
* Note: New restaurant accounts require admin approval before full access
* Available test accounts:

  * Email: [joao.silva@burgerhub.pt](mailto:joao.silva@burgerhub.pt) | Password: 123
  * Email: [jose.costa@casacastelli.com](mailto:jose.costa@casacastelli.com) | Password: 123

### 3. Administrator

* Access via: [http://localhost:3000](http://localhost:3000)
* Actions: Approve/reject new restaurants, manage platform data, access statistics and dashboards
* Admin account:

  * Email: admin\@admin | Password: admin

---

## Key Features

* Responsive design for all devices
* Secure authentication with JWT and Sessions
* Role-based access control
* Real-time notifications via toasts
* Management of menus, dishes, and restaurants
* Online order system with cart and payment options
* Order cancellation restrictions and penalties for excessive cancellations
* Reviews with optional image upload
* Admin dashboards with charts and analytics
* REST API fully documented with Swagger

---

## Setup Instructions (Development)

1. Clone the repository:
   git clone <repo-url>

2. Install dependencies:

   * For backend:
     cd server
     npm install
   * For frontend:
     cd client
     npm install

3. Start the backend server:
   cd server
   npm start

4. Start the frontend server:
   cd client
   ng serve

The backend will be available at [http://localhost:3000](http://localhost:3000) and the frontend at [http://localhost:4200](http://localhost:4200).

---

## API Documentation

* Swagger UI available at: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## Notes

* Ensure MongoDB is running locally or adjust the database configuration accordingly.
* For testing, you can use the provided accounts or create new ones through the registration forms.
* Some functionalities like image upload store files locally within the project structure.

---

## Authors

ReadyToEat was developed by:

* Bruno José Leite Carvalho
* Diogo Ribeiro da Cunha 
* Tomás Cecílio Nunes 

---

