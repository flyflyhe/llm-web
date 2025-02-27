import Chat from './Chat'
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Input, Button, message } from 'antd';
const { Header, Content, Footer, Sider } = Layout;


function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}


const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [items, setItems] = useState([])
  const [requestId, setRequestId] = useState(0)
  const [number, setNumber] = useState(0)

  useEffect(() => {
    setItems([getItem('新建对话', '0', <PieChartOutlined />)])
  }, [])


  function menuClieck({ key, domEvent }) {
    console.log(key)
    if (key == 0) {
      
      const newNumber = number+1
      setNumber(newNumber)
      const cKey = uuidv4()

      const newItems = [...items, getItem('对话'+newNumber, cKey, <PieChartOutlined />)]
      setItems(newItems)
      console.log(newItems)
      setRequestId(cKey)
    } else {
      setRequestId(key)
    }
  }

  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['0']} selectedKeys={[requestId]} mode="inline" items={items} onClick={menuClieck}>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}

        >
        </Header>
        <Content
          style={{
            margin: '0 16px',
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 600,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
                {requestId != 0 && <Chat requestId={requestId}/>}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          河南外服-科技中心 ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};
export default App;