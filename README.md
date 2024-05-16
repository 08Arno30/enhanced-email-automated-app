<div align="center">
<img width="400px" src="https://github.com/08Arno30/enhanced-email-automated-app/blob/main/client/public/logo.png" />
 
# COS730 Software Engineering Assignment: Enhanced Email System with Automation
![deploy](https://github.com/08Arno30/automated-app/actions/workflows/pages.yaml/badge.svg) 
![build](https://github.com/08Arno30/automated-app/actions/workflows/build.yaml/badge.svg) 
[![codecov](https://codecov.io/gh/08Arno30/automated-app/graph/badge.svg?token=NW9F8JWX6C)](https://codecov.io/gh/08Arno30/automated-app) 
<a href="https://enhanced-email-automated-app-frontend.onrender.com" target="_blank" style="text-decoration:none">  <img src="https://custom-icon-badges.demolab.com/badge/Visit%20Live%20Site-410093?logo=mail&logoColor=white" /></a>
</div>

This assignment involved enhancing a legacy system by adding automated functionalities. The chosen system was Yahoo Mail. However, due to the lack of open-source code, a basic clone of Yahoo Mail was implemented, replicating core functionalities to serve as a foundation for the automated components.

The implemented functionalities are:

  * **Automatic Translation:** This feature addresses the challenge of receiving emails in foreign languages. Incoming emails are processed, translating the subject and body content into English for storage within the MongoDB database. Upon retrieval, emails are translated back to the user's preferred language (set during signup and modifiable in settings). English was chosen for internal storage due to its widespread use for machine translation tasks.
  * **Priority Email Organiser:** To combat information overload, this feature prioritises urgent emails. Text Classification via [Levity.ai](https://levity.ai/) is performed on the subject and body of incoming emails to identify keywords indicative of urgency. Emails classified as urgent are automatically saved to a dedicated "Urgent" folder, allowing users to focus on the most pressing messages first.

By incorporating these automated features, this enhanced email system offers improved user experience and potentially serves as a valuable reference for implementing similar functionalities in modern email systems.

[GitHub Wiki](https://github.com/08Arno30/enhanced-email-automated-app/wiki)

[View Project Management Board](https://petalite-cress-3d0.notion.site/COS730-Assignment-2-bf827da4dfc3491788a7ca1ab811c256?pvs=4)
