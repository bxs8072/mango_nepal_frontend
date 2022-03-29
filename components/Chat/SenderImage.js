import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { Avatar } from 'antd'
import { baseUrl } from '../../api/apis'
import { SmallLoading } from '../Loading'

function SenderImage({ user }) {
    return (
        <div style={{
            padding: '10px'
        }}>
            {
                user.image ?
                    <Avatar
                        style={{
                            width: 45, height: 45
                        }}
                        src={user.image}
                    /> :
                    user.first_name ?
                        <Avatar style={{
                            background: "red",
                            textAlign: "center",
                            fontWeight: 700, width: 45, height: 45
                        }}>
                            <p style={{ fontSize: 16, textAlign: 'center', marginTop: 6 }}>{user.first_name.substr(0, 1)}</p>
                        </Avatar> : <SmallLoading />}

        </div>
    )
}

export default SenderImage
