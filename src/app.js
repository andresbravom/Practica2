import  {GraphQLServer} from 'graphql-yoga'
import * as uuid from 'uuid'

const authorData = [{
  name : "Andrés Bravo",
  email: "yo@correo.com",
  id: "0f995037-71ce-42f3-a9c6-8e03a07d9e76"

}];

const recipesData = [{
  id: "1",
  title: "title1",
  description: "descripcion1",
  author: "0f995037-71ce-42f3-a9c6-8e03a07d9e76",
  date: 123456
}];

const ingredients = [];

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
    id: ID!
  }

  type Ingredients{
    name: String!
    shownRecipes: [Recipes]!
  }

  type Query{
    author(id: ID!): Author
    recipe(id: ID!): Recipes
    ingredients(id: ID!): Ingredients
  }

  type Mutation{
    addRecipes(title: String!, description: String!, author: ID!) : Recipes!
    addAuthor(name: String!, email: String!): Author!
    addIngredients(name: String!): Ingredients!

  }
`
const resolvers = {
  Author:{
    recipe: (parent, args, ctx, info) =>{
      const authorID = parent.id;
      return recipesData.filter(obj => obj.author === authorID);
    }
  },

  Recipes:{
    author: (parent, args, ctx, info) => {
      const authorID = parent.author;
      const result = authorData.find(obj => obj.id === authorID);
      return result;
    }
  },

  Query: {
    author: (parents, args, ctx, info) => {
      const result = authorData.find(obj => obj.id === args.id);
      return result;
    },
    recipe: (parents, args, ctx, info) => {
      if(!recipesData.some(obj => obj.id === args.id)){
        throw new Error(`Unknow recipe whith id ${args.id}`);
      }
      const result = recipesData.find(obj => obj.id === args.id);
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
  }
}
const server = new GraphQLServer({typeDefs, resolvers});
server.start(() => console.log("Server started"));
