import React from 'react';
import {Link} from 'react-router-dom';
import {observer} from "mobx-react";
import { Carousel } from 'react-responsive-carousel';
import ReactLoading from "react-loading";

@observer
export default class GameDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state ={amount:1};
        this.amountChanged = this.amountChanged.bind(this);
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.addToCart = this.addToCart.bind(this);
    }
    componentDidMount(){
        fetch('/api/games/game/' + this.props.gameID)
        .then(res => res.json())
        .then(res => this.setState(res))
        .catch(err => this.state._id = err)
    }

    addToCart(){
      var self = this;
      fetch('/api/games/addCart', {
        method: 'POST', 
        body: JSON.stringify({id: this.state._id, 
          image: "/images/games/" + this.state.mainImage,
          name: this.state.name, 
          price: this.state.price, 
          amount: this.state.amount, 
        }), 
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(() => self.props.cartStore.pullCart())
    }

    amountChanged(e){
      this.setState({amount:e.target.value})
    }
    add(){
      this.setState({amount: this.state.amount + 1})
    }
    remove(){
      if (this.state.amount > 1)
        this.setState({amount: this.state.amount - 1})
    }

    render(){
        return (
            <section className="sec-product-detail bg0 p-t-65 p-b-60">
            {this.state._id === undefined && <ReactLoading type={"spin"} className="center pad-bot" color={"#428bca"} height={100} width={100}/>}
            {this.state._id && <div className="container">
                <div className="row">
                  <div className="col-md-6 col-lg-7 p-b-30">
                    <Carousel showArrows={true} interval={4000} transitionTime={1000} autoPlay={true} showThumbs={true} showStatus={false} infiniteLoop={true}>
                        <img src={"/images/games/" + this.state.mainImage}/>
                        {this.state.extraImages.map( (img, index) => (
                            <img src={"/images/games/" + img} key={index}/>
                        ))}
                    </Carousel>
                  </div>
                  <div className="col-md-6 col-lg-5 p-b-30">
                    <div className="p-r-50 p-t-5 p-lr-0-lg">
                      <h4 className="mtext-105 cl2 js-name-detail p-b-14">
                        {this.state.name}
                      </h4>
                      <span className="mtext-106 cl2">
                        ${this.state.price}
                      </span>
                      <p className="stext-102 cl3 p-t-23">
                        {this.state.description}
                      </p>
                      {/*  */}
                      <div className="p-t-33">
                        <div className="flex-w flex-r-m p-b-10">
                          <div className="size-204 flex-w flex-m respon6-next">
                            <div className="wrap-num-product flex-w m-r-20 m-tb-10">
                              <div className="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m" onClick={this.remove}>
                                <i className="fs-16 zmdi zmdi-minus" />
                              </div>
                              <input className="mtext-104 cl3 txt-center num-product" type="number" name="num-product" value={this.state.amount} onChange={this.amountChanged} />
                              <div className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m" onClick={this.add}>
                                <i className="fs-16 zmdi zmdi-plus" />
                              </div>
                            </div>
                            <button className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04 js-addcart-detail" onClick={this.addToCart}>
                              Add to cart
                            </button>
                          </div>
                        </div>	
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
            </section>
          );
    }
}
