import React from 'react'
import { Button, Input, Card } from 'antd'

function ChatMessageSender({ onChangeText, onSend, message }) {

    return (
        <Card style={{
            backgroundColor: '#474741',
            borderBottomRightRadius: '25px',
            borderBottomLeftRadius: '25px',
        }}>
            <div
                style={{
                    scrollbarColor: 'black',
                    flexDirection: 'row',
                    display: 'flex',
                }}>
                <Input
                    height="40px"
                    type="text"
                    placeholder="Enter your message..."
                    value={message}
                    onChange={onChangeText}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault()
                            event.stopPropagation()
                            onSend()
                        }
                    }}
                />
                <Button
                    style={{ backgroundColor: '#479140', marginLeft: '10px', borderRadius: '30px' }}
                    onClick={onSend}><a style={{ color: 'white' }}>Send</a></Button>
            </div>
        </Card>
    )
}

export default ChatMessageSender
