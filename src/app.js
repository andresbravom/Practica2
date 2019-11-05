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
  ingredient: ["f9ce5671-ced5-49f0-9d95-b805107e4307", "f9ce5671-ced5-49f0-9d95-b805107e4307"],
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
  }
  type Mutation{
    
    addAuthor(name: String!, email: String!): Author!
    addRecipes(title: String!, description: String!, author: ID!) : Recipes!
    addIngredients(name: String!, recipe: [ID]!): Ingredients!
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
        return{
          name: ingredientInfo.name,
          id: ingredientInfo.id
        };
      });
      return result;
      } 
    },
  Ingredients:{
    recipe: (parent, args, ctx, info)=>{
      const result = parent.recipe.map(element =>{
        const recipeInfo = recipesData.find(obj => obj.id === element);
        return{
          title: recipeInfo.title,
          id: recipeInfo.id
        };
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
      const {title, description, author} = args;
      if(!authorData.some(obj => obj.id === author)){
        throw new Error(`Author ${author} not found`);
      }
      const date = new Date().getDate();
      const id = uuid.v4();
      const recipe = {
        title, description, author, date, id
      };
      recipesData.push(recipe);
      return recipe;
    },
    addIngredients: (parent, args, ctx, info) => {
      const { name, recipe} = args;
      const id = uuid.v4();
      const ingredient = {
        name,
        id, 
        recipe,
      };

      ingredientsData.push(ingredient);
      return ingredient;
    }
  }
}
const server = new GraphQLServer({typeDefs, resolvers});
server.start(() => console.log("Server started"));