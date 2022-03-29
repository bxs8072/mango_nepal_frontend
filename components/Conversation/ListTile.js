import React, { useState } from 'react'
import { Card, Avatar, Button, Row } from 'antd'
import { SmallLoading } from '../Loading'
import Column from 'antd/lib/table/Column'
import ViewProfile from '../../modal/ViewProfile'

function ListTile({ user, router, message }) {
    const [viewProfile, setViewProfile] = useState(false)
    const handleViewProfile = () => {
        setViewProfile(true)
    }

    return (
        <div>
            <ViewProfile visible={viewProfile} onCancel={() => setViewProfile(false)} user={user._id} />
            <div
                style={{
                    marginLeft: '2%',
                    marginRight: '2%',
                    marginTop: '20px',
                    marginBottom: '20px',
                }}>
                <Row
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}>
                    <Row>
                        <div
                            onClick={handleViewProfile}>
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
                        </div>
                        <a style={{
                            width: "30px"
                        }} />
                        <div>
                            <p style={{
                                fontSize: '17px',
                                fontWeight: 'bold',
                            }}>
                                {user.first_name + " " + user.last_name}
                            </p>
                            <p>{message.sender._id == JSON.parse(localStorage.getItem("data")).id ? "Me: " : message.sender.first_name + ": "}{message.message}</p>
                        </div>
                    </Row>
                    <Button
                        onClick={() => {
                            router.push('/chat/' + user._id)
                        }}>
                        Send Message
            </Button>
                </Row>
            </div>

        </div>
    )
}

export default ListTile
