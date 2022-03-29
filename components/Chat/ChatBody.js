import React, { useEffect } from 'react'
import { Card, Avatar } from 'antd'
import moment from 'moment'
import SenderImage from './SenderImage';

function ChatBody({ data }) {
    const [innerHeight, setInnerHeight] = React.useState(0);
    useEffect(() => {
        setInnerHeight(window.innerHeight)
    }, [innerHeight])

    return (
        <div>
            <Card
                style={{
                    maxHeight: innerHeight * 0.55,
                    minHeight: innerHeight * 0.55,
                    overflowY: 'scroll',
                }}
                id='message'>
                {data && data.map((item, index) => {
                    var isOwner = JSON.parse(localStorage.getItem("data")).id == item.sender._id
                    return (
                        <div key={index.toString()}>
                            <div style={{
                                flexDirection: !isOwner ? 'row' : 'row-reverse',
                                display: 'flex',
                            }}>
                                <p>{moment(item.createdAt).format('LLLL')}</p>
                            </div>
                            {
                                <div style={{
                                    flexDirection: !isOwner ? 'row' : 'row-reverse',
                                    display: 'flex',
                                    marginBottom: '10px',
                                }}>
                                    <SenderImage user={item.sender} />
                                    <Card style={{
                                        borderTopRightRadius: !isOwner ? '0px' : '30px',
                                        borderBottomLeftRadius: !isOwner ? '30px' : '0px',
                                        width: '35%',
                                        backgroundColor: !isOwner ? 'grey' : 'blue',
                                    }}>
                                        <p style={{ fontSize: '16px', color: 'white', wordWrap: 'break-word' }}>{item.message}</p>
                                    </Card>
                                </div>
                            }
                        </div>
                    )
                })}
            </Card>

        </div>
    )
}

export default ChatBody
