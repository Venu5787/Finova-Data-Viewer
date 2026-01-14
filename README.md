# Finova Data Viewer — Project Report

Summary of contents and quick steps

- Steps taken:
  1. Create a short report README with client-server explanations and diagram.
  2. Provide a diagram file at `diagrams/diagram.svg`.
  3. Add placeholders for screenshots; please replace with real screenshots.

**1. Client–Server Model**

- **What is a client?**
  A client is the software (usually running in a browser or mobile app) that a user interacts with. It displays the UI and sends requests to the server.

- **What is a server?**
  A server is the program (running on a remote or local machine) that receives requests from clients, processes them (business logic), optionally reads/writes a database, and returns responses.

- **How do they communicate?**
  Clients and servers communicate over a network using requests and responses (commonly HTTP/HTTPS). The client makes a request (e.g., GET/POST) and the server responds with data (often JSON, HTML, or files).

- **What happens internally when a user clicks “Search” in the UI?**
  1. The frontend captures the click and reads the search input.
  2. It sends a request (e.g., HTTP POST/GET) to the server API endpoint with the search parameters.
  3. The server receives the request, validates parameters, and executes search logic.
  4. The server queries the database for matching records.
  5. The database returns results to the server.
  6. The server formats the results (e.g., JSON) and returns an HTTP response.
  7. The client receives the response, parses it, and updates the UI to show results.

**2. How Full-Stack Applications Work (simple words)**

- **Frontend:** The part users interact with (web pages, forms, buttons). It runs in the browser and handles presentation and user events.

- **Backend:** The server-side code that implements business rules, processes requests, performs authentication, and coordinates data access.

- **Database:** A storage system (like PostgreSQL, MySQL, MongoDB) where persistent data is kept. The backend queries and updates the database.

- **APIs (concept):** An API is an agreed way for the frontend and backend to exchange data (endpoints with request/response formats). It defines what requests are accepted and what responses look like.

- **How they talk:** The frontend calls API endpoints on the backend (HTTP requests). The backend uses a database driver or ORM to query the database. Results flow back to the frontend via the API.

**3. Diagram**

The diagram file is included at `diagrams/diagram.svg`. It shows the client, server, database and data flow.

![Architecture Diagram](diagrams/diagram.svg)

**4. Screenshots**

Below are placeholders for required screenshots. Please open `Index.html` in your browser, take the screenshots, and replace the placeholder files:

- UI screenshot placeholder: `screenshots/ui_screenshot.png`
- Git commands screenshot placeholder: `screenshots/git_commands.png`





