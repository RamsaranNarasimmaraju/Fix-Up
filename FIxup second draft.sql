-- Creating the database
CREATE DATABASE FixupDb
USE FixupDb


-- Roles table
CREATE TABLE roles (
    RoleId INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL UNIQUE
)
create table Login(
UserName nvarchar(20),
UserPassword nvarchar(50)
)
select*from roles

-- Inserting roles
INSERT INTO roles (RoleName) VALUES ('Admin'), ('User'), ('Support Engineer')

-- Users table


create TABLE users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    UserName NVARCHAR(20) UNIQUE NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE CHECK (Email LIKE '%_@__%.__%'),
    userPassword NVARCHAR(70) NOT NULL,
    RoleId INT FOREIGN KEY REFERENCES roles(RoleId),
    DateCreated DATETIME DEFAULT GETDATE(),
    CONSTRAINT min_pass CHECK (
        userPassword LIKE '%[A-Z]%' AND 
        userPassword LIKE '%[a-z]%' AND 
        userPassword LIKE '%[0-9]%' AND 
        (userPassword LIKE '%!%' OR 
         userPassword LIKE '%@%' OR 
         userPassword LIKE '%#%' OR 
         userPassword LIKE '%$%' OR 
         userPassword LIKE '%^%' OR 
         userPassword LIKE '%&%' OR 
         userPassword LIKE '%*%' OR 
         userPassword LIKE '%()%' OR 
         userPassword LIKE '%<>%' OR 
         userPassword LIKE '%?%' OR 
         userPassword LIKE '%[]%' OR 
         userPassword LIKE '%{}%' OR 
         userPassword LIKE '%|%' OR 
         userPassword LIKE '%/%' OR 
         userPassword LIKE '%~%') AND 
        LEN(userPassword) >= 8
    ),
    CONSTRAINT Name_length CHECK (LEN(UserName) BETWEEN 8 AND 20)
)

-- Inserting user data

INSERT INTO users (UserName, Email, userPassword, RoleId) VALUES 
('RamSaranraju', 'ramsaran0168@gmail.com', 'Ramsaran$12345', 2),
('Dineshkarthik', 'Dinesh01684@gmail.com', 'Dinesh$12345', 2),
('RamAdmin', 'ramsarannaras@gmail.com', 'RamAdmin@1', 1),
('SupportEngineer', 'support@example.com', 'Support$123', 3);
select*from users

Select*from Issues
-- Ticket details table
ALTER TABLE Tickets
ADD FileUpload VARBINARY(MAX) NULL;

CREATE TABLE Tickets (
    TicketId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT FOREIGN KEY REFERENCES users(UserId),
    IssueType NVARCHAR(50) NOT NULL CHECK (IssueType IN ('Server', 'Product', 'Payment', 'Refund')),
    Description NVARCHAR(MAX) NOT NULL, 
	CreatedDate DATETIME DEFAULT GETDATE(),
	TStatus NVARCHAR(50) DEFAULT 'open' CHECK (TStatus IN ('open', 'InProgress', 'closed')),
    ResolvedDate DATETIME NULL,
);
insert into Tickets(UserId,IssueType,Description) values(2,'Product','Product deliverd is damaged')
select *from 

-- Create Trigger for AssignedTo constraint
select*from Issues

-- Issues table
truncate table Issues
CREATE TABLE Issues (
    IssueID INT IDENTITY(1,1) PRIMARY KEY,
    IssueCategory NVARCHAR(100) NOT NULL
)
select *from Solutions
drop table solutions
-- Solutions table
CREATe TABLE Solutions (
    SolutionID INT IDENTITY(1,1) PRIMARY KEY,
    IssueID INT FOREIGN KEY REFERENCES Issues(IssueID),
    Solution NVARCHAR(MAX) NOT NULL
)

-- Inserting predefined issues and solutions
INSERT INTO Issues (IssueCategory) VALUES ('Wrong product delivered');
INSERT INTO Solutions (IssueID, Solution) VALUES (1, 'Follow the steps to resolve this issue: 1. Go to ticket section 2. Select Product 3. Enter the Bill number in issued bill and report the issue and submit. Your product will be exchanged or you can raise for refund');



-- Feedback table
CREATE TABLE Feedback (
    FeedbackId INT IDENTITY(1,1) PRIMARY KEY,
    TicketID INT FOREIGN KEY REFERENCES Tickets(TicketId),
    Rating INT CHECK (Rating BETWEEN 1 AND 5) not null,
    comments NVARCHAR(MAX) NULL,
    submitteddate DATETIME DEFAULT GETDATE()
)
insert into Feedback(TicketID,Rating)  values(1,4)
insert into Feedback(TicketID,Rating)  values(1,5)

-- Refund table
drop table Refunds
CREATE TABLE Refunds (
    RefundId INT IDENTITY(1,1) PRIMARY KEY,
    TicketId INT FOREIGN KEY REFERENCES Tickets(TicketId),
    Refund_Amount DECIMAL(10,2) NOT NULL,
    Refundstatus NVARCHAR(50) DEFAULT 'pending' CHECK (Refundstatus IN ('pending', 'Approved', 'Rejected')),
    ProcessedDate DATETIME DEFAULT GETDATE()
)
alter VIEW Dashboard AS
SELECT
    COUNT(DISTINCT T.TicketId) AS TotalTicketsRaised,
    COUNT(DISTINCT CASE WHEN T.TStatus = 'closed' THEN T.TicketId END) AS TotalTicketsSolved,
    AVG(CAST(F.Rating AS FLOAT)) AS AverageRating
FROM
    Tickets T
LEFT JOIN
    Feedback F ON T.TicketId = F.TicketId;

	create table CustomIssue
	(
	CustomID int primary key identity(1,1),
	CutomIssue nvarchar(100) not null,
	CustomSolution nvarchar(100),
	Userid int foreign key references users(UserId)
	)

	insert into CustomIssue(CutomIssue,Userid) values('I have issues with my software',1)

	select*from users
	truncate table users
	select*from CustomIssue
	select*from Solutions
	select*from Tickets
	truncate table customIssue