import React from 'react';
import AddFishForm from './AddFishForm.js';

class Inventory extends React.Component {
  constructor() {
    super();
    this.renderInventory = this.renderInventory.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
    return (
      <div>
        <h2>Inventory</h2>
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm addFish={this.props.addFish} />
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    )
  }
}

export default Inventory;
