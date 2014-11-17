# ![image alt text](image_0.png)

# General Information:

**Name of System:** Pinndit

**Authors:** Dylan Terry, Steve Jones, Stephen Collins, Ariel Reches, Ryan Herlihy, Derek Costigan (Team Pinndit)

*This file was last revised on: November 12, 2014*

# Project Summary

PinndIt is the social event broadcasting app where users can drop a Pinn at the location of an event. Users are able to view this on a map interface where each Pinn represents an event. Users at the location are able to "upvote" or “downvote” each Pinn depending on the experience of the event. As the event accumulates votes the Pinn may change color from the default red to green if the event is highly regarded. This gives prospective event attendees an idea of if they are interested in going to the event. For example if Sigma Phi Epsilon has a barbecue to raise money for cancer research, someone can drop a Pinn at the event and people can vote on if the event is enjoyable. 

As a user selects an event a window will pop up with the capability to read and write comments. Each individual comment will have the same rating system applied to the Pinns and will enable users to post valuable information about the event. For example a comment saying, "Free food!" might convince someone to come to an event over a simple green Pinn icon.

Written by Derek Costigan - 11/12/2014* * *


# Revision History

<table>
  <tr>
    <td>Date</td>
    <td>Name</td>
    <td>Revision</td>
  </tr>
  <tr>
    <td>11/11</td>
    <td>Dylan</td>
    <td>Created doc, added headers</td>
  </tr>
  <tr>
    <td>11/12</td>
    <td>Derek</td>
    <td>Project Summary</td>
  </tr>
  <tr>
    <td>11/12</td>
    <td>Dylan</td>
    <td>External Libraries</td>
  </tr>
</table>


Written by Team - 11/12/2014* * *


# External Libraries

Google Maps Embed API

	Basic embedding of Google Maps

Google Maps Javascript API

	Allows coding over Google Maps

Google Maps Geolocation API

	Allows requests for user location 

pg

	Communicating with our PostgreSQL DB to send Pinn data

serve-favicon

	Custom favicon

express

express-session

	Handles sessions

cookie-parser

	Handles cookies and required for sessions

body-parser

	Express uses this

debug

	Helps with debugging on the server side, comes with express

jQuery

	Integrates with Ajax to provide communication between the client and server.

Written by Dylan Terry - 11/12/2014* * *


# Bird’s Eye

	**Embedded map** 

Provides the general view for all users who use the application. The map displays all the dropped Pinns in a given location, and houses all user interactions.

**Pinns on Google Map**

The Pinns are represented on the map as markers with a specific location. The Pinns will persist for a certain period of time before they are deleted and are no longer visible to users on the map. Pinns will store information associated with the event it represents. When clicked, a Pinn will display an Info Window containing the event’s description and comments.

	

	**New Pinn Button**

Located in the map interface as a map control. When clicked down, the button will create and display a new Pinn. The Pinn’s drag functionality will allow the user to drag and drop the Pinn immediately after creation.

**Pinn Info Windows**

Info Windows will display a Pinn’s information to the user in a clear, easy to understand visual representation. A Pinn’s Info Window will be updated regularly as information in the database is added or removed to provide the user with the most current information.

	**Comments** 

Inside the Info Window of a Pinn, a user can post their thoughts and comments about the event. If they decide their comment is irrelevant or forever reason deem it unsatisfactory they can remove it with the delete button. Other users who click on a Pinn and view the Info Window will see other users’ comments displayed. Comments will also have an upvote and downvote functionality.

	**Up and Downvote Functionality for Comments and Events**

Both events and event comments will have an upvote and downvote functionality. Users will be allowed to click a button to give an upvote or downvote to an event or comment. The Pinn for each event will store and update the data of upvotes and downvotes for the event itself as well as the event’s comments.

	**Database for Pinns and Comments**

A Database will store all current Pinn information including the event description, comments, Pinn location, age of Pinn, etc. User actions will update database, and information will be received by the user from the database. The database will allow the web application’s essential information to persist.

Written by Ryan Herlihy - 11/12/2014* * *


# Components

### Embedded map

**_Person(s) Responsible: _**Team

**_How does it connect and communicate to other parts of the system?:_**

This is the interface over which we’ll write most of our front-end code.

**_How does it relate and implement aspects that were mentioned in our functional specification?:_**** **

	Standard Google Maps API embedded map

### Comments

**_Person(s) Responsible:_** Derek Costigan

**_How does it connect and communicate to other parts of the system?: _**

Comments are visible to other clients and displays user input text. Each client user can create new comments or delete their own comments under the info window of a Pinn. These comments are integrated with the up and downvote functionality for easy identification of a good or bad comment. 

**_Please predict any implementation challenges_**: 

Comments may not have the option to be deleted but instead disappear similarly to how the Pinns disappear. Also using the google maps api may be more difficult than expected.

### Up and Downvote functionality for comments and events

**_Person(s) Responsible: _**Steve Jones / Stephen Collins

**_How does it connect and communicate to other parts of the system and how does it relate and implement aspects that were mentioned in our functional specification?:_**

The up/down votes will be used to track the popularity of Pinns and comments. If either is downvoted a certain amount then it should disappear.

**_Please predict any implementation challenges:_** Setting this up to work with AJAX

### Pinns on Google Map

**_Person(s) Responsible:_** Ariel Reches / Ryan Herlihy

**_How does it connect and communicate to other parts of the system?:_** A user drops a pin on the map, gives that pin information and then informs the DB of the Pinns existence. A user should then be able to move or delete that pinn

**_How does it relate and implement aspects that were mentioned in our functional specification?_**: It must communicate with the Pinn database. It must also give access to comments and the info box.

**_Please predict any implementation challenges:_**

-Dragging and dropping to create a pinn

-ensuring only pinn dropper can modify the pinn

-sending the pinn info to the server

### Database for Pinns and Comments

**_Person(s) Responsible: _**Dylan Terry

**_How does it connect and communicate to other parts of the system?: _**

Requests from the webpage for Pinns in the local area, up and downvote information about those Pinns, comments associated with those Pinns and up and downvote information about those comments will go to our database.	

**_Please predict any implementation challenges:_**

Deciding definitively on a database schema and going forward with that will be difficult considering the changes that we’ll most likely encounter to our code base going forward.

### Pinn Info Windows

**_Person(s) Responsible:_** Steve Jones

**_How does it connect and communicate to other parts of the system and how does it relate and implement aspects that were mentioned in our functional specification?: _**

Each Pinn will have an info window that displays the information associated with the Pinn. This includes the name of the event, the up/down votes, time since Pinn was posted, and comments. The comments will also have their own individual up/down vote functionality as well as time. The info window will also provide the user with the ability to post a comment.

**_Please predict any implementation challenges:_**

	Google’s javascript map api

Written by Team - 11/12/2014* * *


