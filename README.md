Psoriasis Health Tracker

TO-DO:
- Security
  - Improve security for users' medical data
  - Change Firebase/MongoDB keys and make sure they're not pushed to Github
- Backend
  - Change schemas to allow users to upload more data (remember to change the frontend too)
    - Allow users to change their settings
    - Allow users to upload account data, that's then displayed on the account page
- Frontend
  - checkin.js
    - Add image previews when uploading Lesion images
    - Make it so there isn't just a blank page after the checkin is submitted
    - Change the loadRoutines function so the Hormone date displays as a normal date instead of showing exact time (there's an example in content_default.js)
    - Change the periodToday function so it changes the color of the "period today" button when clicked
    - Test that loadRoutines works for the Routines section, letting users see past inputted routines
    - Allow users to add Diet notes and Medication data to database
    - (optional) Fetch Weather/Medication data from database and display it in the Checkin (modify the loadRoutines function)
    - (optional) Upload more than just the current city for the Weather section
    - (optional) Add Sun Exposure intensity
    - (optional) Change the way PASI score is displayed for Lesion so it isn't as large
  - content_dashboard.js
    - Finish this page so it uses data from database
  - single_checkin.js
    - Finish this page so it displays the fetched user data
  - account.js (optional)
    - Add this page (to components and App.js)
- Other
  - (optional) Delete unused pages
  - Publish to Github pages

Overview

Women with psoriasis often face challenges in self-managing their condition and effectively communicating their symptoms, triggers, and treatment progress to healthcare providers. This project aims to develop a user-friendly tracking tool designed specifically to help women document key aspects of their psoriasis diagnosis, empowering them to advocate for better healthcare and optimize treatment outcomes.

Problem Statement

How can women with psoriasis accurately capture and track key information about their diagnosis, including symptoms, triggers, and treatment schedules, to enhance patient advocacy and optimize health outcomes?

The Challenge

-Inconsistent tracking and documentation make it difficult for patients to communicate effectively with healthcare providers.
-A lack of comprehensive tracking solutions tailored specifically for psoriasis.
-Inadequate patient education on gender-specific psoriasis symptoms.
-Limited availability of tracking apps with preferred features and aesthetics.

Why This Matters

-Psoriasis is a systemic disease linked to serious comorbidities such as cardiovascular disease, arthritis, and depression. Effective tracking solutions can:
-Improve treatment adherence.
-Enable better symptom management.
-Enhance communication with healthcare professionals.
-Lead to more personalized and effective care plans.
-Improve quality of life and reduce healthcare costs.

Key Features

-Comprehensive Symptom Tracking: Log daily symptoms, flare-ups, and severity levels.
-Trigger Identification: Identify environmental, dietary, or lifestyle factors that exacerbate psoriasis.
-Medication & Treatment Scheduling: Set reminders and track adherence to prescribed treatments.
-Personalized Insights & Reports: Generate visual data trends for better communication with healthcare providers.
-Educational Resources: Provide information on gender-specific differences in psoriasis symptoms and treatment responses.

User Needs

-A specialized tracking tool that goes beyond general health apps.
-A customizable interface that accommodates individual preferences.
-A solution that prevents reliance on inefficient or incomplete tracking methods.
-Increased awareness and education on psoriasis, particularly its gender-specific aspects.

Challenges & Considerations

-Target Audience: The primary user base consists of individuals already diagnosed with psoriasis or other chronic conditions who are inclined to use tracking apps.
-Adoption Barriers: Encouraging non-tech-savvy individuals to consistently use the app for long-term tracking.
-Privacy & Security: Ensuring secure data storage and user confidentiality.

Goals & Impact

By addressing these challenges, this project aims to empower women with psoriasis to take control of their health through effective tracking and documentation, leading to improved patient advocacy, better treatment outcomes, and an overall enhanced quality of life.

How to Contribute

We welcome contributions from developers, healthcare professionals, designers, and patients. If you're interested in contributing, please check out our contribution guidelines and open an issue or pull request.

This project is open-source and committed to fostering better health outcomes through technology. Join us in making a meaningful impact!

