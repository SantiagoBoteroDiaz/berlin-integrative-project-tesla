# AutoPark
Automated Parking Management System

AutoPark is an automated parking management system designed to control vehicle entry, parking sessions, payments, and exit authorization using license plate recognition.

The system detects vehicle plates through a camera, automatically registers parking sessions, calculates parking fees based on time, and allows vehicles to exit only within a 15-minute window after payment.

# Key Features

Automatic license plate recognition

Automatic vehicle entry registration

Parking time tracking

Payment processing by license plate

15-minute exit authorization window

Sales reporting

Multiple vehicle types support

Parking session history

Database-level business logic using stored procedures

# System Architecture


# Tech Stack
Backend

Node.js

Express.js

PostgreSQL

Frontend

HTML

TailwindCSS

JavaScript

Computer Vision

Python

OpenCV

License Plate Detection

Database

PostgreSQL

PL/pgSQL Stored Procedures

# Database Design

# The database is fully normalized (3NF) and designed to handle:

vehicle registration

parking sessions

payments

subscription plans

exit authorization

    Main Tables
    vehicle_type
    vehicle
    rate
    plan
    vehicle_plan
    parking_session
    payment
    exit_permission

# Entity Relationship Diagram (ERD)

![alt text](image.png)

Example suggestion:

Core Business Logic
Vehicle Entry

The camera detects the vehicle plate.

The system registers the vehicle if it does not exist.

A parking session is created.

parking_session
status = active
Payment Calculation

The system calculates the parking fee based on:

time parked

hourly rate

vehicle type

total = CEIL(hours_parked) * price_per_hour
Payment Processing

# A stored procedure processes the payment:

process_parking_payment(plate)

This procedure:

Calculates the total price

Registers a payment

Generates an exit permission

Returns payment details

Exit Authorization

Vehicles can exit only if the exit permission is still valid.

NOW() <= valid_until

If valid:

EXIT_ALLOWED

If expired:

PAY_AGAIN
Admin Dashboard

The Admin Dashboard is an implementation layer of the system that provides operational insights and financial monitoring.

It allows administrators to track parking activity and analyze revenue.

Dashboard Features

Hourly parking revenue reports

Subscription revenue reports

Active parking sessions monitoring

Historical payment tracking

Example Metrics
Total hourly parking revenue
Total subscription revenue
Number of vehicles parked
Daily parking activity


Real-time dashboard updates

Online payment integration

Multiple parking locations

Parking occupancy analytics

# Authors

Santiago Botero Diaz
Steven Alexander Patiño Arenas