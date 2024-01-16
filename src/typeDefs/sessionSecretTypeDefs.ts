export const sessionSecretTypeDefs = `

input ScanQrcodeInput {
    userId: ID!
    token: String!
}

type QrcodeResponse {
    qrCodeUrl: String,
    message: String
}

type ScanResponse {
    message: String
    user: UserDTO
}

type Mutation {
    sessionGenerateQrcode: QrcodeResponse!
    sessionScanQrcode(input: ScanQrcodeInput): ScanResponse!
}
`;
