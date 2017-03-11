import React from 'react';
import AddFishForm from './AddFishForm.js';
import base from '../base';

class Inventory extends React.Component {
  constructor() {
    super();
    this.renderInventory = this.renderInventory.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.authHandler = this.authHandler.bind(this);
    this.logout = this.logout.bind(this);

    this.state = {
      uid: null,
      owner: null,
    }
  }

  componentDidMount() {
    base.onAuth((user) => {
      if (user) {
        this.authHandler(null, {user})
      }
    });
  }

  handleChange(e, key) {
    const fish = this.props.fishes[key];
    // Take a copy of the the fish and update it with the new data
    const updatedFish = {
      ...fish,
      [e.target.name]: e.target.value
    };
    this.props.updateFish(key, updatedFish);
  }

  authenticate(provider) {
    base.authWithOAuthPopup(provider, this.authHandler);
  }

  logout() {
    base.unauth();
    this.setState({
      uid: null
    })
  }

  authHandler(err, authData) {
    if (err) {
      console.log(err);
      return;
    }

    // Grab the store information
    const storeRef = base.database().ref(this.props.storeId);
    // Query Firebase once for the store data
    storeRef.once('value', (snapshot) => {
      const data = snapshot.val() || {};

      if (!data.owner) {
        storeRef.set({
          owner: authData.user.uid
        })
      }

      this.setState({
        uid: authData.user.uid,
        owner: data.owner || authData.user.uid,
      })
    })
  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button className="github" onClick={() => this.authenticate('github')}>Log In with Github</button>
      </nav>
    )
  }

  renderInventory(key) {
    const fish = this.props.fishes[key];
    return(
      <div className="fish-edit" key={key}>
        <input
          name="name"
          onChange={(e) => this.handleChange(e, key)}
          placeholder="Fish name"
          type="text"
          value={fish.name}
        />
        <input
          name="price"
          onChange={(e) => this.handleChange(e, key)}
          placeholder="Fish price"
          type="text"
          value={fish.price}
        />
        <select
          name="status"
          onChange={(e) => this.handleChange(e, key)}
          value={fish.status}
        >
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea
          name="desc"
          onChange={(e) => this.handleChange(e, key)}
          placeholder="Fish desc"
          type="text"
          value={fish.desc}
        ></textarea>
        <input
          name="image"
          onChange={(e) => this.handleChange(e, key)}
          placeholder="Fish image"
          type="text"
          value={fish.image}
        />
        <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
      </div>
    )
  }
  render() {
    const logout = <button onClick={this.logout}>Log Out!</button>

    // Check if they are not logged in at all
    if (!this.state.uid) {
      return <div>{this.renderLogin()}</div>
    }

    // Check if they are the owner of the current store
    if (this.state.uid !== this.state.owner) {
      return(
        <div>
          <p>Sorry you aren't the owner of the store!</p>
          { logout }
        </div>
      )
    }

    return (
      <div>
        <h2>Inventory</h2>
        { logout }
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm addFish={this.props.addFish} />
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    )
  }
}

Inventory.propTypes = {
  fishes: React.PropTypes.object.isRequired,
  updateFish: React.PropTypes.func.isRequired,
  removeFish: React.PropTypes.func.isRequired,
  addFish: React.PropTypes.func.isRequired,
  loadSamples: React.PropTypes.func.isRequired,
  storeId: React.PropTypes.string.isRequired,
}

export default Inventory;
