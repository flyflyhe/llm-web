import React, { useState, useEffect, useContext } from 'react';
import {
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Input, Button, message } from 'antd';
import { XStream } from '@ant-design/x';

import {useXChat, Bubble, Sender, useXAgent, XRequest } from '@ant-design/x';



const roles = {
  assistant: {
    placement: 'end',
    avatar: {
      icon: <UserOutlined />,
      style: {
        background: '#fde3cf',
      },
    },
    typing: {
      step: 5,
      interval: 20,
    },
    // style: {
    //   maxWidth: 600,
    // },
  },
  user: {
    placement: 'start',
    avatar: {
      icon: <UserOutlined />,
      style: {
        background: '#87d068',
      },
    },
  },
};

const reqRef = {request_id : 0}


const messageHistory = {}

const Chat = ({requestId}) => {

  const [agent] = useXAgent({
    request: async (info, { onSuccess, onUpdate }) => {

      console.log("info-----", info)
      const { messages, message } = info
      let response = await myFetch(message, reqRef.request_id)

      let fullcontent = ''

      for await (const chunk of XStream({
        readableStream: response.body,
      })) {
        fullcontent += chunk.data
        onUpdate(fullcontent);
        if (chunk.event == 'done') {
          onSuccess(fullcontent)
          messageHistory[reqRef.request_id] = [...messages, fullcontent]
        }

        console.log(chunk);
      }
    },
  });

  function myFetch(message, requestId) {
    return fetch('http://127.0.0.1:9990/public/ds', {
      method: 'POST',
      body: JSON.stringify({
        prompt: message,
        chat_session_id: requestId,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  const { messages, onRequest, setMessages } = useXChat({ agent });



  useEffect(() => {
    console.log("requestId发生了变化", requestId)
    let newMessages = []

    reqRef.request_id = requestId
    console.log('消息历史', messageHistory)

    if (messageHistory[requestId] && messageHistory[requestId].length > 0) {
      for (let index = 0; index < messageHistory[requestId].length; index++) {
        const element = messageHistory[requestId][index];
        if ((index % 2) == 0) {
          newMessages.push({
            status: 'local',
            message: element
          })
        } else {
          newMessages.push({
            status: 'ai',
            message: element
          })
        }
      }
    }

    console.log('命中消息', newMessages)

    setMessages(newMessages)
  }, [requestId])


  const chatItems = messages.map(({ id, message, status }) => ({
    key: id,
    content: message,
    role: status == 'local' ? 'user' : 'assistant',
  }));

  return (
    <div>
      <Bubble.List items={chatItems} roles={roles} style={{
        maxHeight: '68vh',
      }} />

      <div style={{

      }}>
        <Sender onSubmit={onRequest}></Sender>
      </div>
    </div>
  );
};
export default Chat;