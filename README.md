# Database Schema Constructor
![DBSC](/resources/dbsc.gif)

## Description
The Database Schema Constructor is a web application for visually creating and manipulating database schemas. It allows users to add tables, define attributes, and set constraints like `NOT NULL`, `UNIQUE`, `PRIMARY KEY`, and `AUTO_INCREMENT`. Features include SQL query generation and download, draggable tables for layout flexibility, and responsive design. Schemas can be persisted in local storage for future sessions.

## Features
- **Visual Database Design**: Add, edit, and remove tables and attributes.
- **Attribute Constraints**: Direct UI definition of attribute constraints.
- **SQL Generation**: Generate SQL queries for the schema.
- **Download SQL**: Download the schema as an SQL file.
- **Draggable Tables**: Reorganize tables on the screen on larger screens.
- **Responsive Design**: Ensures usability across devices.
- **Local Storage**: Schema persistence across sessions.

## Getting Started

### Prerequisites
Before you begin, ensure you have the latest version of Node.js and npm installed on your system.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ahmad-masud/Database-Schema-Constructor
   ```
2. Navigate to the project directory:
   ```bash
   cd ahmad-masud.github.io
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
   This command runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
   
## Usage
- **Creating a Table**: Use the "Add Table" button.
- **Editing**: Use edit icons for tables or attributes.
- **Downloading SQL**: Use the "Download SQL" button.
- **Clearing Schema**: Use the "Delete Database" button.

## Contributing
Contributions are welcome. Please fork the project, create your feature branch, commit your changes, push to the branch, and open a pull request.

## License
Distributed under the MIT License. See [MIT License](LICENSE) for more information.