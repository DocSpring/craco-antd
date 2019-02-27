import React, { Component } from "react";
import { Layout, Menu, Breadcrumb, Button, Alert } from "antd";

import logo from "./logo.svg";
import "./style/index.less";
const { Header, Content, Footer } = Layout;

type State = {
  counter: number;
};

class App extends Component<any, State> {
  state: State;

  constructor(props: any) {
    super(props);
    this.state = {
      counter: 0
    };
  }

  render() {
    return (
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            style={{ lineHeight: "64px" }}
          >
            <Menu.Item key="1">Nav 1</Menu.Item>
            <Menu.Item key="2">Nav 2</Menu.Item>
            <Menu.Item key="3">Nav 3</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Foo</Breadcrumb.Item>
            <Breadcrumb.Item>Bar</Breadcrumb.Item>
            <Breadcrumb.Item>Baz</Breadcrumb.Item>
          </Breadcrumb>

          <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
            <img src={logo} className="App-logo" alt="logo" />

            <Alert message={`Counter: ${this.state.counter}`} type="success" />

            <Button
              type="primary"
              style={{ marginTop: "20px" }}
              onClick={() => this.setState({ counter: this.state.counter + 1 })}
            >
              Increment Counter
            </Button>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>Ant Design Example</Footer>
      </Layout>
    );
  }
}

export default App;
