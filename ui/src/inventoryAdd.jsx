import React from 'react';
import {
    NavItem, Glyphicon, Modal, Form, FormGroup, FormControl, ControlLabel,
    Button, ButtonToolbar, Tooltip, OverlayTrigger,
} from 'react-bootstrap';
import Toast from './Toast.jsx';

export default class ProductAdd extends React.Component {
    constructor() {
        super();
        this.state = {
            showing: false,
            toastVisible: false,
            toastMessage: '',
            toastType: 'success',
        };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showError = this.showError.bind(this);
        this.dismissToast = this.dismissToast.bind(this);
    }

    showModal() {
        this.setState({ showing: true });
    }

    hideModal() {
        this.setState({ showing: false });
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = document.forms.productAddForm
        const price = form.price.value
        const product = { product_name: form.product.value, product_price: parseFloat(price.substring(1, price.length)), product_category: form.productCategory.value, product_image: form.image.value }
        const { createProduct } = this.props;
        this.showSuccess('Product Added Successfully');
        this.hideModal();
        createProduct(product);
        form.product.value = "";
        form.price.value = "$";
        form.image.value = "";
    }

    showSuccess(message) {
        this.setState({
          toastVisible: true,
          toastMessage: message,
          toastType: 'success',
        });
    }

    showError(message) {
        this.setState({
          toastVisible: true,
          toastMessage: message,
          toastType: 'danger',
        });
    }

    dismissToast() {
        this.setState({ toastVisible: false });
    }

    render() {
      const { showing } = this.state;
      const { toastVisible, toastMessage, toastType } = this.state;
      return (
          <React.Fragment>
            <NavItem title = "Add Product" onClick={this.showModal}>
                    <OverlayTrigger
                    placement="left"
                    delayShow={1000}
                    overlay={<Tooltip id="add product">Add product</Tooltip>}
                    >
                    <Glyphicon glyph="plus" />
                    </OverlayTrigger> Add a product
                </NavItem>
                <Modal show={showing} onHide={this.hideModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form name="productAddForm" onSubmit={this.handleSubmit}>
                  {/* <div className="row">
                      <div className="column">
                          <h4 className="addFormTitle">Product Category</h4> */}
                          <FormGroup>
                            <ControlLabel htmlFor="category">Category</ControlLabel>
                            <select name="productCategory">
                              <option >Shirt</option>
                              <option >Jeans</option>
                              <option >Sweater</option>
                              <option >Jacket</option>
                              <option >Accessories</option>
                            </select>
                          </FormGroup>

                          <FormGroup>
                            <ControlLabel htmlFor="product">Name</ControlLabel>
                            <input type="text" name="product" />
                          </FormGroup>

                          <FormGroup>
                            <ControlLabel htmlFor="price">Price</ControlLabel>
                            <input defaultValue="$" type="text" name="price" />
                          </FormGroup>

                          <FormGroup>
                            <ControlLabel htmlFor="image">Image URL</ControlLabel>
                            <input type="text" name="image" />
                          </FormGroup>
                  </form>
                </Modal.Body>
                <Modal.Footer>
                          <ButtonToolbar>
                          <Button type="button" bsStyle="primary" onClick={this.handleSubmit}> Submit </Button>
                          <Button bsStyle="link" onClick={this.hideModal}>Cancel</Button>
                          </ButtonToolbar>
                </Modal.Footer>
                </Modal>
                <Toast

          showing={toastVisible}
          onDismiss={this.dismissToast}
          bsStyle={toastType}
        >
          {toastMessage}
        </Toast>
          </React.Fragment>
        );
    }
  }
