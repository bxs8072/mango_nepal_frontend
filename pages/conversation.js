import React, { useState, useEffect } from 'react'
import { execFetchConversation } from '../api/apis'
import { Card } from 'antd'
import ChatHeader from '../components/Chat/ChatHeader'
import ListTile from '../components/Conversation/ListTile'
import { useRouter } from 'next/router'

export default function conversation() {
    const router = useRouter()
    const [list, setList] = useState(false)

    useEffect(() => {
        execFetchConversation().then((res) => {
            console.log(res)
            setList(res.data)
        })
    }, [])

    return (
        <div>
            <Card
                style={{
                    marginLeft: '20%',
                    marginRight: '20%',
                    borderRadius: '20px'
                }}>
                <h1>Conversations</h1>
                <hr />
                {list && list.map((item, index) => {
                    return (
                        <ListTile user={item.hero} key={index} router={router} message={item.message} />
                    )
                })}
            </Card>
        </div>
    )
}


