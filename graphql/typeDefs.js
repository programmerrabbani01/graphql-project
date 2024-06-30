export const typeDefs = `#graphql

type User {
    id: ID
    name: String!
    userName: String!
    email: String!
    phone: String!
    password: String!
    conformPassword: String!
    status: Boolean
    trash: Boolean
    createdAt: String
    updatedAt: String
}

type Query {
    getAllUsers: [User]
    loggedInUser: User
}

type Mutation {
    userRegistration(
        name: String!,
        userName: String!,
        email: String!,
        phone: String!,
        password: String!,
        conformPassword: String!,
    ): UserRegistrationResponse!

    userVerification(token: String!): User
    userLogin(email: String, phone: String, password: String!): UserLoginResponse!
    userLogout: LogoutResponse!
     
}

type UserRegistrationResponse {
    user: User!
    message: String!
}
type UserLoginResponse {
    user: User!
    token: String!
    message: String!
}

type LogoutResponse {
    message: String!
  }

`;
