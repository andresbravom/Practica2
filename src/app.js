import  {GraphQLServer} from 'graphql-yoga'
import * as uuid from 'uuid'

const authorData = [{
  name: String,
  email: String,
  listaRecetas: [recetas],
  id: "ksvopvkspaokvopkv"
}];

const recetas = [{
  id: uuid,
  titulo: String,
  descripcion: String,
  fechaIntroduccion: 122345,
  autor: "amskadkjakpdja",
  ingredientes: [ingredientes]
}];

const ingredientes = [{
  nombre: String,
  recetasQueAparecen
}];

const typeDefs = `
  type Author{
    name: STring!
    email: String!
    listaRecetas[Recetas!]!
    id: ID!
  }

  type Recetas{
    titulo: String!
    descripcion: String!
    fechaIntroduccion: Int!
    autor: Author!
    ingredientes: [Ingredientes]!
    id = ID!
  }

  type Ingredientes{
    nombre: String!
    recetasQueAparecen: [Recetas]
  }

  type Query{

  }

  type Mutation{
    
  }
`
