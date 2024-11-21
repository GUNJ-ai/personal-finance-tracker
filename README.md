# Personal Finance Tracker  

## **Introduction**  
Personal Finance Tracker is a web-based application designed to help users manage their income, expenses, and savings efficiently. This application provides a user-friendly dashboard to track transactions and analyze financial activities through various features like categorization, secure data storage, and RESTful API integration.  

The application is built using AWS cloud-native services to ensure scalability, security, and high availability.  

---

## **Features**  
- **User Authentication**: Secure login and signup using AWS Cognito.  
- **Transaction Management**: Add, edit, and delete income or expense transactions.  
- **Data Storage**: Transactions are stored in Amazon DynamoDB for high performance and availability.  
- **CSV Export**: Users can export their transaction history as a CSV file.  
- **Interactive Dashboard**: Visualize financial activities (planned for future).  

---

## **Technologies Used**  
- **Frontend**:  
  - HTML  
  - JavaScript  
  - CSS  

- **Backend**:  
  - **AWS Lambda**: Serverless backend functions to handle CRUD operations.  
  - **Amazon API Gateway**: RESTful APIs for communication between frontend and backend.  
  - **Amazon DynamoDB**: NoSQL database to store user transactions.  

- **Authentication**:  
  - AWS Cognito for secure user authentication and session management.  

---

## **How It Works**  
1. **Login/Signup**:  
   - Users authenticate themselves via AWS Cognito.  

2. **Transaction Management**:  
   - Users can add new transactions with details like date, amount, description, and type (income/expense).  
   - Edit or delete existing transactions.  

3. **CSV Export**:  
   - Download all transactions in a CSV format for offline analysis.  

4. **Integration with AWS**:  
   - All data is securely stored in DynamoDB.  
   - API Gateway provides endpoints to communicate between the frontend and backend.  

---

## **Repository Structure**  
```plaintext
├── index.html         # Dashboard page after user login  
├── index2.html        # Login/Signup page for user authentication  
├── script.js          # Main JavaScript file managing frontend interactions and AWS integration  
├── README.md          # Project documentation  
