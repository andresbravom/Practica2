# Recipe book  👨🏽‍🍳
Recipe book is a Node.js app. The user can add, edit and remove (authors, recipes and ingredients), the query is through graphql.
## Install 🛠️
For use this app is necessary install:
* npm
```sh
npm install
```
## Dependencies ⚙️
```sh
npm install graphql-yoga
```
GraphQL server will listen on `127.0.0.1:4000`
## Clone respository 👇🏽
For clone or download this repository copy this link:
```sh
https://github.com/andresbravom/Practica2.git
```

## Run ▶️
Use this command for start de ejecution
```js
npm start
```
## Features 💻
### Mutations
```js
addAuthor
addRecipes
addIngredients
removeRecipe
removeAuthors
removeIngredients
updateAuthor
updateRecipe
updateIngredients
```


#### Add Author 👩🏽‍🍳
```js
    mutation{
    addAuthor(name: "Andrés", email: "andres@gmail.com")
}
```
#### Add Recipe 📜
For add recipes is it necesary put the id in the `author:` and `ingredient:` fields

```js
    mutation{
  addRecipes(name: "Pizza", description: "How to make a vegetable pizza", author:"0f995037-71ce-42f3-a9c6-8e03a07d9e76", ingredient: ["2cf2c8e2-9c20-4d9e-88d3-0e3854362301", "9f28c050-0ca6-4ac3-9763-79b3a4a323f2","fb466cc5-973d-44dc-b838-ce2dae423f90"]), 
}
```
#### Add Ingredients 🍅🌽🥕
```js
mutation{
  addIngredients(name: "tomato"){
}
```
#### OUTPUT


### Queries
```js
showRecipes
showAuthors
showIngredients
```
#### INPUT
```js
query{
  showAuthors{
    name
    email
    recipe{
      title
    }
  }
}
```
#### OUTPUT
```js
"data": {
    "showAuthors": [
      {
        "name": "Andrés Bravo",
        "email": "andres@ilovejs.com",
        "recipe": [
          {
            "title": "Pizza"
          },
          {
            "title": "Burguer"
          }
        ]
      },
      {
        "name": "Laura Rodríguez",
        "email": "laura@ilovejs.com",
        "recipe": [
          {
            "title": "Hot dog"
          }
        ]
      }
    ]
  }
}
```

### Mutations
```js
showRecipes
showAuthors
showIngredients
```






