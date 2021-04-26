import React from 'react';
import { Label, Panel } from 'react-bootstrap';
import ProductTable from './inventoryTable.jsx';
import ProductAdd from './inventoryAdd.jsx';
import graphQLFetch from './graphQLFetch.js';
import Toast from './Toast.jsx';

export default class ProductList extends React.Component {
  constructor() {
    super();
    this.state = { myProducts: [],
      toastVisible: false,
      toastMessage: '',
      toastType: 'info',
    };
    this.createProduct = this.createProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
        productList {
          id product_category product_name product_price product_image
        }
      }`;

    await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    }).then(response => {
      response.json().then(result => {
        this.setState({ myProducts: result.data.productList });
      })
    }).catch(err => {
      alert("Error in sending data to server: " + err.message);
    });

  }

  async createProduct(myProduct) {
    const query = `mutation productAdd($myProduct: productInputs!) {
    productAdd(product: $myProduct) {
      _id
    }
  }`;
    const variables = {myProduct}
    await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables })
    }).then(response => {
      this.loadData()
    }).catch(err => {
      alert("Error in sending data to server: " + err.message);
    });
  }

  async deleteProduct(id) {
      const query = `mutation productDelete($id: Int!) {
        productDelete(id: $id)
      }`;
      console.log(id);
    const variables =  { id };
      await fetch(window.ENV.UI_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query,  variables  }),
      });
      alert('Product deleted product successfully!');
      this.loadData();
  }

  showSuccess(message) {
    this.setState({
      toastVisible: true, toastMessage: message, toastType: 'success',
    });

  }
  showError(message) {
    this.setState({
      toastVisible: true, toastMessage: message, toastType: 'danger',
    });
  }
  dismissToast() {
    this.setState({ toastVisible: false });
  }

  render() {
      const { myProducts } = this.state;
      const { toastVisible, toastType, toastMessage } = this.state;
      return (
        <React.Fragment>
        <Panel>
           <Panel.Heading>
             <Panel.Title toggle>Product List</Panel.Title>
           </Panel.Heading>
           <Panel.Body >
             <ProductTable myProducts={myProducts} deleteProduct={this.deleteProduct} />
           </Panel.Body>
         </Panel>
         <Panel>
           <Panel.Heading>
             <Panel.Title toggle>Add a new product</Panel.Title>
           </Panel.Heading>
           <Panel.Body >
             <ProductAdd createProduct={this.createProduct} />
           </Panel.Body>
         </Panel>
         <Toast showing={toastVisible} onDismiss={this.dismissToast} bsStyle={toastType}> {toastMessage} </Toast>
        </React.Fragment>
      );
    }
  }
