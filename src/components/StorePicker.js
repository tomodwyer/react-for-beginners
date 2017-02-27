import React from 'react';
import { getFunName } from '../helpers.js';

class StorePicker extends React.Component {
  // constructor() {
  //   super();
  //   this.goToStore = this.goToStore.bind(this);
  // }

  goToStore(e) {
    // Prevent default form behaviour
    e.preventDefault();

    // Get the Store DI
    const storeId = this.storeInput.value;
    console.log(`Going to ${storeId}`);

    // Transition from / to /store/:storeId
    this.context.router.transitionTo(`/store/${storeId}`)
  }

  render() {
    return (
      <form className="store-selector" onSubmit={ (e) => this.goToStore(e) }>
        <h2>Please enter a store</h2>
        <input
          type="text"
          required
          placeholder="Store Name"
          defaultValue={ getFunName() }
          ref={
            (input) => {
              this.storeInput = input;
            }
          }
        />
        <button type="submit">Visit Store</button>
      </form>
    )
  }
}

StorePicker.contextTypes = {
  router: React.PropTypes.object
}

export default StorePicker;
