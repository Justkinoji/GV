export const userTypeDefs = `
type User {
    id: ID!
    userName: String
    email: String!
    emailConfirm: EmailConfirm
    passwordHash: String!
    resetPassword: ResetPassword
    phoneConfirm: PhoneConfirm
    avatarURL: String
    backgroundColor: String
    backgroundImage: String
    confidentLvl: Int
    bonuses: Int
    level: Int
    experience: Int
    role: String
    achievements: [String]
    ratingsStats: RatingStats
    isTwoFactorEnabled: Boolean
    qrCode: String
    address: Address
    subscribed: Boolean
    banned: Boolean
    stripeId: String
}

type RatingStatsEntry {
    key: Int!
    value: Float!
}

type RatingStats {
    entries: [RatingStatsEntry]
}

type PaypalInfo {
    paypalId: String
    confirmed: Boolean
}

type UserDTO {
    id: ID!
    userName: String
    email: String!
    emailConfirmDate: String
    avatarURL: String
    backgroundColor: String
    backgroundImage: String
    confidentLvl: Int
    bonuses: Int
    level: Int
    experience: Int
    role: String
    achievements: [String]
    ratingsStats: RatingStats
    isTwoFactorEnabled: Boolean
    qrCode: String
    address: Address
    phoneConfirmDate: String
    subscribed: Boolean
    banned: Boolean
    stripeId: String
    paypalInfo: PaypalInfo
    lastActivity: String
    createdAt: String

    soldORBoughtProducts: Int
}

enum UserRole {
    ADMIN
    SELLER
    BUYER
    MODERATOR
}

type EmailConfirm {
    confirmationCode: Int
    expire: String
    confirmed: String
}

type ResetPassword {
    resetCode: Int
    expire: String
}

type PhoneConfirm {
    code: Int
    expire: String
    confirmed: String
}

type Address {
    city: String
    zipCode: Int
    street: String
    phoneNumber: String
}

input AddressInput {
    city: String
    zipCode: Int
    street: String
    phoneNumber: String
}

input RegisterSellerInput {
    email: String!
    password: String!
    userName: String
    address: AddressInput
}

input RegisterBuyerInput {
    email: String!
    password: String!
}

input LoginUserInput {
    email: String!
    password: String!
}

input LoginInput {
    login: String!
    password: String!
}

type RegisterOrLoginResponse {
    user: UserDTO
    userId: ID
    message: String!
    token: String!
}

input changePasswordInput {
    login: String!
    resetCode: Int!
    newPassword: String!
}

input changeUserInput {
    userId: ID!
    userName: String
    avatarURL: String
    backgroundColor: String
    backgroundImage: String
    confidentLvl: Int
    bonuses: Int
    level: Int
    experience: Int
    role: UserRole
    achievements: [String]
    isTwoFactorEnabled: Boolean
    qrCode: String
    address: AddressInput
    subscribed: Boolean
}

type UserResponse {
    user: User!
    message: String
}

type newPasswordResponse {
    message: String
    password: String
}

input ConfirmPhoneInput {
    phoneNumber: String!
    code: Int!
}

input SignupDateFilter {
    from: String
    to: String
}

input GetAllWithFilters {
    name: String
    signupDate: SignupDateFilter
}

input banUnBanInput{
    userId: ID
    text: String
}

type Mutation {
    registerSeller(input: RegisterSellerInput): RegisterOrLoginResponse!
    registerBuyer(input: RegisterBuyerInput): RegisterOrLoginResponse!
    loginUser(input: LoginInput): RegisterOrLoginResponse!
    sendPasswordResetCode(login: String!): String!
    sendEmailConfirmCode(email: String!): String!
    confirmEmail(code: Int!): String!
    changePassword(input: changePasswordInput!): String!
    changeUser(input: changeUserInput): UserResponse!
    addModerator(email: String!): String!
    sendPhoneConfirm(phoneNumber: String!): String!
    confirmPhone(input: ConfirmPhoneInput!): String!
    sendEmailConfirmLink(email: String!): String!
    newPassword(oldPassword: String!, newPassword: String!): newPasswordResponse
    banUser(input: banUnBanInput): User!
    unBanUser(input: banUnBanInput): User!
}

type Query {
    getUsers: [UserDTO!]!
    getUserByToken: UserDTO
    getUserById(id: ID!): UserDTO
    getUserByRole(role: UserRole!): [UserDTO!]!
    getAllSellers(input: GetAllWithFilters): [UserDTO!]!
    getAllBuyers(input: GetAllWithFilters): [UserDTO!]!
    getSellerForAdmin(id: ID!): User
}
`;
