import { Navigate } from "react-router-dom";
import ChatsContent from "./Main/ChatsContent";
import WelcomeChat from "./Main/WelcomeChat";

const chatRoutes = () => {
    return [
        {
            id: "chat-welcome",
            dest: "chats/users",
            index: true,
            element: <WelcomeChat />,
        },
        {
            id: "chat-user",
            title: 'userChat',
            path: 'chat/:chatId',
            dest: 'chat/chatId',
            element: <ChatsContent />,
        },
        {
            id: "chat-patient",
            title: 'patientChat',
            path: 'patient/:patientId',
            dest: 'patient/patientId',
            element: <ChatsContent />,
        },
        {
            id: "chat-category",
            title: 'categoryChat',
            path: 'category/:categoryId',
            dest: 'category/categoryId',
            element: <ChatsContent />,
        },
        {
            id: "chat-tab-*",
            path: "*",
            element: <Navigate to="/chats" />,
            dest: "chats",
        }
    ]
};

export default chatRoutes;