# Alarm Clock Application User Guide

## Overview
This document provides instructions for using the Alarm Clock application developed by Aniket Singla. The application allows users to set, manage, and delete alarms based on specific times and days of the week.

### Running the Application
- Start the application by running: node alarmClock.js

Upon running the application, you will be presented with the following menu options:

- **1:** Display Current Time
- **2:** Add New Alarm
- **3:** Delete Existing Alarm
- **4:** List All Alarms
- **5:** Exit Application

### Adding a New Alarm

To add a new alarm:

1. Choose option **2** from the menu.
2. Enter the alarm time in 24-hour format (HH:MM:SS) when prompted.
3. Select the day of the week for the alarm by entering the corresponding index (0 for Sunday, 1 for Monday, and so on).

### Deleting an Alarm

To delete an existing alarm:

1. Choose option **3** from the menu.
2. Follow the prompts to select the index of the alarm you wish to delete.

### Listing All Alarms

To view a list of all currently set alarms:

- Choose option **4** from the menu.

### Exiting the Application

To exit the application:

- Choose option **5** from the menu.

## Additional Features

- **Snooze Option:** When an alarm rings, you can choose to snooze it or delete it immediately.
- **Error Handling:** The application handles invalid inputs gracefully and prompts the user to retry.

## Notes

- Each alarm set will ring at the specified time on the chosen day of the week.
- Maximum snooze attempts for each alarm are limited to 3 times.
- The application interface is text-based and runs in the command line environment.