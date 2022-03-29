import { useRouter } from "next/router";
import { execFetchUser, execFetchMessages, execSendMessage } from "../../api/apis";
import { useEffect, useState } from "react";
import ChatHeader from "../../components/Chat/ChatHeader";
import ChatBody from "../../components/Chat/ChatBody";
import ChatMessageSender from "../../components/Chat/ChatMessageSender";

export default function chat({ id, socket }) {
    const router = useRouter()
    const [initFetchUser, setInitFetchUser] = useState(true)
    const [initFetchMsg, setInitFetchMsg] = useState(true)
    const [data, setData] = useState([])
    const [message, setMessage] = useState('')
    const [scroll, setScroll] = useState(true)
    const [user, setUser] = useState({})
    const [chatId, setChatId] = useState('')


    var fetchUser = () => {
        execFetchUser(id)
            .then((res) => {
                setUser(res)
            })
            .then(() => {
                setInitFetchUser(false)
            })
    }

    var fetchMessage = () => {
        execFetchMessages({ reciever: id })
            .then(res => {
                if (res) {
                    setData(res.data.messages)
                    setChatId(res.chatId)
                }
            }).then(() => {
                if (socket)
                    socket.emit('joinRoom', { chatId })
                setInitFetchMsg(false)
            })
    }

    var sendMessage = () => {
        if (socket) {
            socket.emit('chatroomMessage',
                {
                    chatId,
                    message: message.trim(),
                    reciever: id
                })
            setMessage("")
            setScroll(true)
        }
    }

    var init = () => {
        if (initFetchUser) {
            fetchUser()
        }
        if (initFetchMsg) {
            fetchMessage()
        }
        if (scroll) {
            document.getElementById('message').scrollTop = 9999999
            setInterval(() => { setScroll(false) }, 2000)
        }
    }


    useEffect(() => {
        init()
    }, [chatId, user, scroll])


    useEffect(() => {
        if (socket) {
            socket.on('newMessage', (msg) => {
                setData([...data, msg])
                document.getElementById('message').scrollTop = 9999999
            })
        }
    }, [data])


    return (
        <div style={{
            marginLeft: '10%',
            marginRight: '10%'
        }}>
            <ChatHeader user={user} />
            <ChatBody data={data} />
            <ChatMessageSender
                message={message}
                onChangeText={(e) => {
                    setMessage(e.target.value)
                }}
                onSend={() => {
                    sendMessage()
                }}
            />
        </div>
    );
}

chat.getInitialProps = ({ query }) => {
    return { id: query.id }
};




