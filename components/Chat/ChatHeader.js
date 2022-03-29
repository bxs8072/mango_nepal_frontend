import React, { useState } from 'react'
import { Avatar, Button, Row, Space, Card } from 'antd'
import { SmallLoading } from '../Loading'
import ViewProfile from '../../modal/ViewProfile'

function ChatHeader({ user }) {
    const [viewProfile, setViewProfile] = useState(false)
    return (
        <div>
            <ViewProfile visible={viewProfile} onCancel={() => setViewProfile(false)} user={user._id} />
            <Card
                style={{
                    borderTopLeftRadius: '25px',
                    borderTopRightRadius: '25px',
                    backgroundColor: '#474741'
                }}>
                <Row
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}>
                    <Row>
                        {user.image ?
                            <Avatar
                                style={{
                                    width: 45, height: 45
                                }}
                                size="large"
                                src={user.image}
                            /> :
                            user.first_name ?
                                <Avatar style={{
                                    background: "red",
                                    textAlign: "center",
                                    fontWeight: 700, width: 45, height: 45
                                }}>
                                    <p style={{ fontSize: 16, textAlign: 'center', marginTop: 6 }}>
                                        {user.first_name.substr(0, 1)}
                                    </p>
                                </Avatar> : <SmallLoading />}
                        <a style={{
                            width: "30px"
                        }} />
                        <p style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: 'white'
                        }}>
                            {user.first_name + " " + user.last_name}
                        </p>
                    </Row>
                    <Button
                        onClick={() => {
                            setViewProfile(true)
                        }}>
                        View Profile
                    </Button>
                </Row>
            </Card>

        </div>
    )
}

export default ChatHeader
