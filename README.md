# COS730 Software Engineering Assignment: Enhanced Email System with Automation

This assignment involved enhancing a legacy system by adding automated functionalities. The chosen system was Yahoo Mail. However, due to the lack of open-source code, a basic clone of Yahoo Mail was implemented, replicating core functionalities to serve as a foundation for the automated components.

The implemented functionalities are:

  * **Automatic Translation:** This feature addresses the challenge of receiving emails in foreign languages. Incoming emails are processed, translating the subject and body content into English for storage within the PostgreSQL database. Upon retrieval, emails are translated back to the user's preferred language (set during signup and modifiable in settings). English was chosen for internal storage due to its widespread use for machine translation tasks.
  * **Priority Email Organiser:** To combat information overload, this feature prioritises urgent emails. Sentiment analysis is performed on the subject and body of incoming emails to identify keywords indicative of urgency. Emails classified as urgent are automatically saved to a dedicated "Urgent" folder, allowing users to focus on the most pressing messages first.

By incorporating these automated features, this enhanced email system offers improved user experience and potentially serves as a valuable reference for implementing similar functionalities in modern email systems.

