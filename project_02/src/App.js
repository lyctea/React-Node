import React, { Component } from 'react'
import axios from 'axios'

class App extends Component {

  state = {
    username: '',
    passworld: ''
  }

  click = () => {
    axios.post('/login', {
      id: this.state.username,
      password: this.state.passworld
    })
    .then((response) => {
        if (parseInt(response.status) === 200 ) {
          alert('登录成功！')
        }
    })
    .catch((error) => {
       console.log(error)
    })
  }

  render() {
    return (
      <div className="App">
        <span>账号：</span><input type="text" value={this.state.username} onChange={(event) => this.setState({ username: event.target.value })} /><br />
        <span>密码：</span><input type="password" value={this.state.passworld} onChange={(event) => this.setState({ passworld: event.target.value })} /><br />
        <button onClick={this.click}>登陆</button>
      </div>
    )
  }
}

export default App
