# Smart-Road-Trip-Planner

## Abstract
- Planning an itinerary before embarking on a road trip is one of the most important travel preparation activities. Recommender systems can ease this travel planning process by providing suggestions based on the user’s interests. However, most of the existing systems suffer from a cold-start problem and also do not account for changes in user’s interests with time. The goal of this project is to overcome these problems by building an AI that can be integrated into a web application that can act as a one-stop solution for its users by allowing them to plan all the aspects of a road trip with ease and comfort. This AI will be designed to capture the user’s mindset through various interactions on the website and personalize the website experience by providing recommendations that are in line with the user’s current interests.
- The web application will be designed to incorporate many of the core functionalities usually found separately in other applications. These include a route calculator that provides an optimal route by accounting for the various points of interest along the way and other functions that can meet the accommodation, food, drinks and other recreational requirements of the user. 

## The AI Recommender

- The AI recommender is broken down into three models, each one assisting a different functionality on the website. These three models are: Hotel recommender, POI (places of interest) recommender and Blog recommender. These models are built on top of the knowledge base gathered by the AI through the various interactions on the website
- The knowledge base of the AI is represented as a “user profile” in the database of the website. Every user on the website has an associated user profile. This profile contains all the information that the AI has gathered about the user. This user profile is made up of six attributes. *Hotels*, *POI* and *Blogs* store the all the interactions made by the user. *Interest Vector*, *POI Categories* and *Blog Interest* represent what the AI knows about the user based on these interactions and is updated every time after the user logs out of the website. These attributes are used by the AI to make recommendations. 
- These recommender models are made up of two smaller models: A Primary recommender and a Secondary recommender. The reason for this is that the Primary recommender relies entirely on the users’ interaction on the website; the more the number of users and more the number of interactions, the better the recommendations. This can lead to a cold start problem when the website is first launched due to insufficiency of users. This is where the Secondary recommender comes in. The Secondary recommender acts as a backup when there are insufficient users or when the similarity between users isn’t good enough. This recommender only takes into account the given user’s interest and uses just that to make recommendations. 

## System Design

### Use-case Diagram

![image](https://user-images.githubusercontent.com/63601038/179490592-93ef8cfd-363a-41bd-b828-7c48e0e4dfa4.png)

### Hotel Recommender

![image](https://user-images.githubusercontent.com/63601038/179490699-603e7c02-695d-438f-8f24-ab6d592c7df2.png)

### POI Recommender

![image](https://user-images.githubusercontent.com/63601038/179490755-3a92e01e-35a3-4e14-ae41-8047b8d7f6de.png)

### Blog Recommender

![image](https://user-images.githubusercontent.com/63601038/179490848-1dc9aa1f-247f-4af3-9388-4ae496a74c4b.png)

## Screenshots

![image](https://user-images.githubusercontent.com/63601038/179491618-eeef647f-b177-41f1-b5c5-e15f882d0d45.png)

![image](https://user-images.githubusercontent.com/63601038/179491638-f2ea77cb-623f-487f-a363-f352ee1d6fbf.png)

![image](https://user-images.githubusercontent.com/63601038/179491665-a14b739b-e066-4b2a-b6e2-2b61b14c5eff.png)

![image](https://user-images.githubusercontent.com/63601038/179491677-5202ca64-3b92-49fc-abad-7147e3fa9173.png)

![image](https://user-images.githubusercontent.com/63601038/179491699-ce55ccc1-f430-4bbb-abc1-1eca76554f2f.png)

![image](https://user-images.githubusercontent.com/63601038/179491734-11b5dabf-fc3f-43da-b3a8-940362dcf2fe.png)

![image](https://user-images.githubusercontent.com/63601038/179491792-11eca6e2-2cd6-4d5b-b7f3-d614358741e4.png)

![image](https://user-images.githubusercontent.com/63601038/179491773-d0061a14-5eb7-4b35-84d3-4205fe9bf525.png)



