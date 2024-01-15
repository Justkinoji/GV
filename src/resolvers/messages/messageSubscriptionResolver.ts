import MessageService from "../../services/MessageService";
import { authService } from "../../services/AuthService";

const messageSubscriptionResolver = {
    Subscription: {
        lastMessage: {
            subscribe: (parent: any, args: any, context: any) => {
                try {
                    const token = authService.checkToken(context.token);

                    return MessageService.lastMessageSubscription(token);
                } catch (err) {
                    console.log(err);
                }

            }
        }
    }
};

export default messageSubscriptionResolver;