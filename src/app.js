import  {GraphQLServer} from 'graphql-yoga'
import * as uuid from 'uuid'


const authorData = [{
  name : "Andrés Bravo",
  email: "yo@correo.com",
  id: "0f995037-71ce-42f3-a9c6-8e03a07d9e76",
  
}];

const recipesData = [{
  id: "f9ce5671-ced5-49f0-9d95-b805107e4307",
  title: "title1",
  description: "descripcion1",
  author: "0f995037-71ce-42f3-a9c6-8e03a07d9e76",
  ingredient: ["2cf2c8e2-9c20-4d9e-88d3-0e3854362301"],
  date: 4
   
}];

const ingredientsData = [{
  id: "2cf2c8e2-9c20-4d9e-88d3-0e3854362301",
  name: "tomate",
  recipe: "f9ce5671-ced5-49f0-9d95-b805107e4307",
}];

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
    recipe: Recipes!
    id: ID!
  }
  type Query{
    author(id: ID!): Author
    recipe(id: ID!): Recipes
    ingredient(id: ID!): Ingredients
  }
  type Mutation{
    
    addAuthor(name: String!, email: String!): Author!
    addRecipes(title: String!, description: String!, author: ID!, ingredient: [ID]!) : Recipes!
    addIngredients(name: String!, recipe: ID): Ingredients!
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
    // ingredient: (parent, args, ctx, info) => {
    //   const ingredientID = parent.ingredient;
    //   const result = ingredientsData.find(obj => obj.id === ingredientID);
    //   return result;
    //   }
    
    ingredient: (parent, args, ctx, info) =>{
      const result = parent.ingredient.map(element =>{ const ingredientInfo = ingredientsData.find(obj => obj.id === element);
        return{
          name: ingredientInfo.name,
          id: ingredientInfo.id
        };
      });
      return result;
      } 
    },
  Ingredients:{
    recipe: (parent,args, ctx, info)=>{
      const recipeID = parent.recipe;
      const result = recipesData.find(obj => obj.id === recipeID);
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
    },//aqui faltaria hacer lo mismo pero con ingredient 
  
    ingredient: (parent, args, ctx, info) =>{
      if(!ingredientsData.some(obj => obj.id === args.id)){
        throw new Error(`Unknow ingredient with id ${args.id} `);
      }
      const result = ingredientsData.find(obj => obj.id === args.id);
      return result;
    }
  },
  Mutation: {
    addAuthor: (parent, args, ctx, info) => {
      const {name, email} = args;
      if(authorData.some(obj => obj.email === email)){
        throw new Error(`User email ${email} already in use`);
      }
      const author = {
        name,
        email,
        id: uuid.v4()
      }
      authorData.push(author);
      return author;
    
    },
    addRecipes: (parent, args, ctx, info) => {
      const {title, description, author, ingredient} = args;
      if(!authorData.some(obj => obj.id === author)){
        throw new Error(`Author ${author} not found`);
      }
      const date = new Date().getDate();
      const id = uuid.v4();
      const recipe = {
        title, description, author, date, id, ingredient
      };
      recipesData.push(recipe);
      return recipe;
    },
    addIngredients: (parent, args, ctx, info) =>{
      const {name,recipe} = args;
      if(!recipesData.some(obj => obj.id === recipe)){
        throw new Error(`Recipe ${recipe} not found`);
      }
      const id = uuid.v4();
      const ingredient = {
        name, recipe, id
      };
      ingredientsData.push(ingredient);
      return ingredient;
    }
  }
}
const server = new GraphQLServer({typeDefs, resolvers});
server.start(() => console.log("Server started"));