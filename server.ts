import express from 'express';
import dotenv from 'dotenv';
import { ApolloServer } from "@apollo/server";
import { execute, subscribe } from "graphql/index";
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from "../config/db";
import { makeExecutableSchema } from '@graphql-tools/schema';
import { expressMiddleware } from "@apollo/server/express4";
import { createServer } from "http";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { WebSocketServer } from 'ws';
import {
    categoryTypeDefs,
    chatRoomTypeDefs,
    messageTypeDefs,
    reportTypeDefs,
    sectionTypeDefs,
    sessionSecretTypeDefs,
    userTypeDefs,
    achievementTypeDefs,
    reviewTypeDefs,
    productTypeDefs,
    paymentTypeDefs,
    purchaseProductTypeDefs,
    webStatsTypeDefs
} from "./typeDefs/_indexTypeDefs";
import { authService } from "./services/AuthService";
import imageRoutes from "./routes/imageRoutes";
import { resolversArray } from "./resolvers/_indexResolvers";
import payPalRouter from "../routes/payPalRouter";
import userRouter from "./routes/userRouter";
import userService from "./services/UserService";

dotenv.config();

connectDB();

const app: express.Application = express();
const PORT: string | number = process.env.PORT || 4000;
app.use(bodyParser.json());
app.use('/api', imageRoutes);
app.use('/users', userRouter);
app.use('/paypal', payPalRouter);

const httpServer = createServer(app);

const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
});

const schema = makeExecutableSchema({
    typeDefs: userTypeDefs
        .concat(sessionSecretTypeDefs)
        .concat(messageTypeDefs)
        .concat(chatRoomTypeDefs)
        .concat(categoryTypeDefs)
        .concat(reportTypeDefs)
        .concat(sectionTypeDefs)
        .concat(achievementTypeDefs)
        .concat(sectionTypeDefs)
        .concat(productTypeDefs)
        .concat(reviewTypeDefs)
        .concat(paymentTypeDefs)
        .concat(purchaseProductTypeDefs)
        .concat(webStatsTypeDefs),
    resolvers: {
        Query: {...resolversArray.Query},
        Mutation: {...resolversArray.Mutation},
        Subscription: {...resolversArray.Subscription}
    },
});

const serverCleanup = useServer({
    schema,
    execute: execute,
    subscribe: subscribe,
    context: (connectionParams: any) => {
        const token =
            connectionParams.connectionParams.Authorization ?
                connectionParams.connectionParams.Authorization.split(' ')[1] : '';
        let currentUser = null;

        if (token) {
            currentUser = authService.getDataFromToken(token);
        }

        return {token, currentUser};
    }
}, wsServer);

const server = new ApolloServer({
    schema,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            },
        },
    ],
});

async function startServer() {
    await server.start();

    app.use('/graphql', cors(),
        expressMiddleware(server, {
            context: async ({ req }) => {
                const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';
                let currentUser = null;

                if (token) {
                    currentUser = authService.getDataFromToken(token);
                }

                if (currentUser) {
                    await userService.updateLastActivity(currentUser.id);
                }

                return { token, currentUser };
            },
        }),
    );
}

startServer().then(r => console.log(`Server is running on http://localhost:${ PORT }`));

httpServer.listen(PORT, () => {
    console.log(`Subscriptions ready at ws://localhost:${PORT}/graphql`);
});
