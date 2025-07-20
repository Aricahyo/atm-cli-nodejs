[Read this in Indonesian / Baca dalam Bahasa Indonesia](README-ID.md)
# ATM Simulation Project (Command-Line Interface)

This is an assignment project from the Digital Skill Fair 41.0 by Dibimbing.id. It's a command-line interface (CLI) simulation of an ATM built with Node.js and a MySQL database.

## Key Features
- Interactive registration for new accounts.
- Secure user login with masked PIN input.
- Interactive transaction menu available after login.
- Check Balance.
- Deposit Funds.
- Withdraw Funds with balance validation.
- Inter-account transfers using database transactions to ensure data integrity.

## Tech Stack
- **Backend:** Node.js
- **Database:** MySQL
- **Libraries:**
  - `commander.js` for CLI command management.
  - `inquirer.js` for creating interactive prompts and menus.
  - `mysql2` for connecting to the MySQL database.
  - `dotenv` for environment variable management.

## Installation and Usage

1.  **Clone this repository:**
    ```bash
    git clone [https://github.com/Aricahyo/atm-cli-nodejs.git](https://github.com/Aricahyo/atm-cli-nodejs.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd atm-cli-nodejs
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Database Setup:**
    - Ensure you have MySQL Server installed and running.
    - Execute the `database.sql` script to create the necessary database and tables.
5.  **Environment Configuration:**
    - Create a `.env` file in the project root.
    - Fill it out according to the following format:
      ```
      DB_HOST=localhost
      DB_USER=root
      DB_PASSWORD=your_password
      DB_DATABASE=atm_db
      ```
6.  **Run the Application:**
    - To see all available commands:
      ```bash
      node atm.js --help
      ```
    - To register a new account:
      ```bash
      node atm.js register
      ```
    - To log in:
      ```bash
      node atm.js login
      ```