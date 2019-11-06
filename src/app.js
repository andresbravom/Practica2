import  {GraphQLServer} from 'graphql-yoga'
import * as uuid from 'uuid'

//Autor
const authorData = [{
  name : "Andrés Bravo",
  email: "yo@correo.com",
  id: "0f995037-71ce-42f3-a9c6-8e03a07d9e76",
  
},
{
  name: "Laura Rodríguez",
  email: "ella@.com",
  id: "abde6470-293e-459f-ac01-e66f8e57d191",
}
];
//Receta
const recipesData = [{
  id: "f9ce5671-ced5-49f0-9d95-b805107e4307",
  title: "receta1",
  description: "descripcion1",
  author: "0f995037-71ce-42f3-a9c6-8e03a07d9e76",
  ingredient: ["2cf2c8e2-9c20-4d9e-88d3-0e3854362301", "9f28c050-0ca6-4ac3-9763-79b3a4a323f2"],
  date: 4,
   
},
{
  id: "c35b0de5-69b3-44eb-b92e-f66346bcba8f",
  title: "receta2",
  description: "descripcion2",
  author: "0f995037-71ce-42f3-a9c6-8e03a07d9e76",
  ingredient: ["fb466cc5-973d-44dc-b838-ce2dae423f90", "2cf2c8e2-9c20-4d9e-88d3-0e3854362301"],
  date: 4,
},
{
  id: "e97382fd-0283-48e9-b76e-96c97524939d",
  title: "receta3",
  description: "descripcion3",
  author: "abde6470-293e-459f-ac01-e66f8e57d191",
  ingredient: ["2cf2c8e2-9c20-4d9e-88d3-0e3854362301", "9f28c050-0ca6-4ac3-9763-79b3a4a323f2"],
  date: 4,
}
];
//Ingredientes
const ingredientsData = [{
  id: "2cf2c8e2-9c20-4d9e-88d3-0e3854362301",
  name: "tomate",
  recipe: ["f9ce5671-ced5-49f0-9d95-b805107e4307", "c35b0de5-69b3-44eb-b92e-f66346bcba8f"],
},
{
  id: "9f28c050-0ca6-4ac3-9763-79b3a4a323f2",
  name: "zanahoria",
  recipe: ["f9ce5671-ced5-49f0-9d95-b805107e4307", "e97382fd-0283-48e9-b76e-96c97524939d"],
},
{
  id: "fb466cc5-973d-44dc-b838-ce2dae423f90",
  name: "lechuga",
  recipe: ["f9ce5671-ced5-49f0-9d95-b805107e4307", "c35b0de5-69b3-44eb-b92e-f66346bcba8f"]
}
];

const typeDefs = `
  type Author{
    name: String!
    email: String!
    recipe: [Recipes]!
    id: ID!
  }
  type Recipes{
    title: String!
    description: String!
    date: Int!
    author: Author!
    ingredient: [Ingredients]!
    id: ID!
  }
  type Ingredients{
    name: String!
    recipe: [Recipes]!
    id: ID!
  }
  type Query{
    author(id: ID!): Author
    recipe(id: ID!): Recipes
    ingredient(id: ID!): Ingredients
    showRecipes: [Recipes]
    showAuthors: [Author]
    showIngredients: [Ingredients]
    
    
  }
  type Mutation{
    
    addAuthor(name: String!, email: String!): Author!
    addRecipes(title: String!, description: String!, author: ID!, ingredient: [ID]!) : Recipes!
    addIngredients(name: String!): Ingredients!
    removeRecipe(id: ID): String!
   
  }
`
const resolvers = {
  Author:{
    recipe: (parent, args, ctx, info) =>{
      const authorID = parent.id;
      const result = recipesData.filter(obj => obj.author === authorID);
      return result;
    }
  },

  Recipes:{
    author: (parent, args, ctx, info) => {
      const authorID = parent.author;
      const result = authorData.find(obj => obj.id === authorID);
      return result;
      },
    
    ingredient: (parent, args, ctx, info) =>{
      const result = parent.ingredient.map(element =>{ 
        const ingredientInfo = ingredientsData.find(obj => obj.id === element);
        return ingredientInfo;
      });
      return result;
      } 
    },
  Ingredients:{
    recipe: (parent, args, ctx, info)=>{
      const result = parent.recipe.map(element =>{
        const recipeInfo = recipesData.find(obj => obj.id === element);
        return recipeInfo;
      });
      return result;
    }
  },

  Query: {
    author: (parent, args, ctx, info) => {
      const result = authorData.find(obj => obj.id === args.id);
      return result;
    },
    recipe: (parent, args, ctx, info) => {
      if(!recipesData.some(obj => obj.id === args.id)){
        throw new Error(`Unknow recipe with id ${args.id}`);
      }
      const result = recipesData.find(obj => obj.id === args.id);
      return result;
    },
  
    ingredient: (parent, args, ctx, info) =>{
      if(!ingredientsData.some(obj => obj.id === args.id)){
        throw new Error(`Unknow ingredient with id ${args.id} `);
      }
      const result = ingredientsData.find(obj => obj.id === args.id);
      return result;
    },
    showRecipes: (parent, args, ctx, info) =>{
      const result = recipesData.map(element =>{
        return element;
      });
      return result;
    },
    showAuthors: (parent, args, ctx, info) =>{
      const result = authorData.map(element =>{
        return element;
      });
      return result;
    },
    showIngredients: (parent, arg, ctx, info) =>{
      const result = ingredientsData.map(element =>{
        return element;
      });
      return result;
    }
  },
  Mutation: {
    addAuthor: (parent, args, ctx, info) => {
      const {name, email} = args;
      if(authorData.some(obj => obj.email === email)){
        throw new Error(`User email ${email} already in use`);
      }
      const id = uuid.v4();
      const author = {
        name, email, id, recipe,
      }
      authorData.push(author);
      return author;
    
    },
    addRecipes: (parent, args, ctx, info) => {
      const {title, description, author, ingredient} = args;
      if(recipesData.some(obj=> obj.title === title)){
        throw new Error(`Recipe ${recipe} don´t exist`);
      }
      if(!authorData.some(obj => obj.name === author)){
        throw new Error(`User ${email} don´t exist`);
      }

      const date = new Date().getDate();
      const id = uuid.v4();
      const recipe = {
        title, description, author, date, id, ingredient
      };
      const aux = authorsData.find(obj => obj.id === author);
      aux.recipes.push(id);
      ingredient.map(element => {
        const ingredientInfo = ingredientsData.find(obj => obj.id === element);
        ingredientInfo.recipes.push(id);
      });
      recipesData.push(recipe);
      return recipe;
    },
    addIngredients: (parent, args, ctx, info) => {
      const { name} = args;
      const id = uuid.v4();
      const ingredient = {
        name,
        id, 
        
      };

      ingredientsData.push(ingredient);
      return ingredient;
    },
    removeRecipe:(parent, args, ctx, info) =>{
      const {id} = args;
      const menssage = "Se ha eliminado correctamente";
      if(recipesData.some(obj => obj.id === id)){
        const auxRecipe = recipesData.find(obj => obj.id === id);
        recipesData.splice(recipesData.indexOf(auxRecipe), 1);
      
        const auxIngredient = ingredientsData.find(obj => id.obj === obj);
        ingredientsData.splice(ingredientsData.indexOf(auxIngredient), 1);

      }else{
        return "Recipe don´t exist"
      }
    
   return menssage;
     }

   
  }
}
const server = new GraphQLServer({typeDefs, resolvers});
server.start(() => console.log("Server started"));