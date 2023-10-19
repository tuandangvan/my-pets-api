# API_Pets_App
API for pet apps. This is the app to find and adopt pets

# Project Title: Found and Adoption Pets API Development

## Project Description:
The "Found and Adoption Pets" API Development project involves creating the backend infrastructure for an application that connects users with pets available for adoption. The primary goal of this project is to develop a robust and secure API that allows users to browse and adopt pets, as well as post information about pets they have found. The project is undertaken by Đặng Văn Tuấn and Đỗ Thị Mỹ Lan.

## Project Scope:

**User Authentication:** Implement user authentication and authorization to ensure secure access to the application's features. Users should be able to register, log in, and maintain their profiles.

**Pets Management:** Develop functionalities for managing pet listings, including creating, updating, and deleting pet profiles. Each pet profile should include details such as name, breed, age, and adoption status.

**Lost and Found Pets:** Create a feature for users to report and search for lost or found pets. Users can post information about a pet they've found or search for their lost pets based on various criteria.

**Favorites:** Implement a favorites feature that allows users to add pets to their favorites list for easy access.

**User Profiles:** Develop user profiles where users can view and update their information, including contact details, preferences, and pet ownership history.

**Notifications:** Integrate notifications to keep users informed about their activities, such as receiving messages from other users or updates on their pet adoption inquiries.

**Search and Filters:** Implement search and filter options to enable users to refine their pet search based on various attributes like species, size, and location.

**Messaging:** Create a messaging system that enables users to communicate with each other. This is essential for pet adoption inquiries and exchanging information.

## Technologies and Tools:

- Programming Languages: Node.js, JavaScript
- Database: MongoDB
- Framework: Express.js
- Authentication: JWT (JSON Web Tokens)
- API Documentation: Swagger
- Version Control: Git
- Project Management: Agile (Scrum)
- Roles and Responsibilities:

## Performed by:
- ***Đặng Văn Tuấn: Backend development, API design, and database integration.***
- ***Đỗ Thị Mỹ Lan: Frontend development, user interface design, and user experience optimization.***
## Project Timeline:
The project is planned to be completed in approximately six months, with ongoing maintenance and updates as needed.

## Conclusion:
The "Found and Adoption Pets" API Development project aims to provide a seamless and user-friendly experience for individuals looking to adopt pets or find their lost furry companions. By implementing a comprehensive set of features and adhering to best practices in API development, the project strives to make a positive impact on the pet adoption community.

## Run Locally

Clone the project

```bash
  git clone https://github.com/tuandangvan/found-and-adoption-pet-api-be.git
```

Go to the project directory

```bash
  cd found-and-adoption-pet-api-be
```

Install dependencies

```bash
  npm install yarn
```

Create the `.env` file from folder src with content
```bash
MONGODB_URI="mongodb+srv://vantuan:12345@cluster0.pvrmqmz.mongodb.net/?retryWrites=true&w=majority"
DATABASE_NAME='API_PET_TEST'
APP_HOST='localhost'
APP_PORT=8050
AUTHOR="Tuan Dang"
JWT_SECRET="tuandang"
```

Start the server

```bash
  yarn dev
```

# Description API



## API for Account
#### Sign up Account

```http
  POST /api/v1/auth/sign-up
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `emmail` | `string` | **Required**   |
| `password` | `string` | **Required**       |
| `role` | `string` | **Required, default:** user     |

#### POST Sign in

```http
  POST /api/v1/auth/sign-in
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`   | `string` | **Required**                      |
| `password`| `string` | **Required**                      |

#### POST Send code otp to email

```http
  POST /api/v1/auth/send-code-authencation
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`   | `string` | **Required**                      |

#### POST verify code otp to email

```http
  POST /api/v1/auth/verify-code-authencation
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`   | `string` | **Required**                      |
| `code`   | `string` | **Required**                      |

#### POST forgot password

```http
  POST /api/v1/auth/forgot-password
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`   | `string` | **Required**                      |

#### POST change password

```http
  POST /api/v1/auth/change-password
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`   | `string` | **Required**                      |
| `password`   | `string` | **Required**                      |
| `newPassword`   | `string` | **Required**                      |

## API for user

#### POST Create user for role user

```http
  POST /api/v1/user/add-information
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`   | `string` | **Required**                      |
| `firsName`   | `string` | **Required**                      |
| `lastName`| `string` | **Required**                      |
| `phoneNumber`| `string` | **Required**                      |
| `address`| `string` |    Not Required                  |
| `experience`| `number` | **Required, value: 0 or 1**     |

## API for center


```http
  POST /api/v1/center/add
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`   | `string` | **Required**                      |
| `name`   | `string` | **Required**                      |
| `phoneNumber`| `string` | **Required**                      |
| `address`| `string` |    Not Required                  |

```http
  POST /api/v1/center/update
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`   | `string` | **Required**                      |
| `name`   | `string` | **Required**                      |
| `phoneNumber`| `string` | **Required**                      |
| `address`| `string` |    Not Required                  |

## API for pet 

```http
  POST /api/v1/pet/add
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `centerId`   | `string` | **Required**                      |
| `namePet`   | `string` | **Required**                      |
| `species`| `string` | **Required**                      |
| `breed`| `string` |    Not Required                  |
| `gender`| `string` |    **Required**                  |
| `color`| `string` |    **Required**                  |
| `description`| `string` |    Not Required                  |
| `level`| `string` |   **Required, value: Bình thường or Khẩn cấp** |
| `healthInfo`| `string` |    Not Required                  |


```http
  POST /api/v1/pet/update/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `centerId`   | `string` | **Required**                      |
| `namePet`   | `string` | **Required**                      |
| `species`| `string` | **Required**                      |
| `breed`| `string` |    Not Required                  |
| `gender`| `string` |    **Required**                  |
| `color`| `string` |    **Required**                  |
| `description`| `string` |    Not Required                  |
| `level`| `string` |   **Required, value: Bình thường or Khẩn cấp** |
| `healthInfo`| `string` |    Not Required                  |
| `foundOwner`| `string` |    Not Required                  |

#### Delete Pet

```http
  POST api/v1/pet/delete/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of pet to fetch |
| `centerId`| `string` | **Required**. Id of center to fetch |


## API for ARTICLE

#### Add a article

```http
  POST /api/v1/post/add
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`  | `string` | **Required**. Id of user to fetch |
| `title`| `string` | **Required**. Title of an article |
| `content`| `string` | **Required**. Content of an article |
| `images`| `string` | **Not Required**. Images of an article |

#### Add a article

```http
  POST /api/v1/post/change-status/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of article to fetch |
| `status`  | `string` | **Required**. Status of an article |

#### Find an article

```http
  GET /api/v1/post/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of article to fetch |


#### Add a comment for article

```http
  POST /api/v1/post/comment/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of article to fetch |
| `userId`  | `string` | **Required**. Id of user to fetch |
| `content`| `string` | **Required**. Content of an comment |

#### Find comment an article

```http
  GET /api/v1/post/comment/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of article to fetch |

#### Reaction article

```http
  POST /api/v1/post/reaction/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of article to fetch |
| `userId`  | `string` | **Required**. Id of user to fetch |

#### Get Reaction article

```http
  GET /api/v1/post/reaction/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of article to fetch |