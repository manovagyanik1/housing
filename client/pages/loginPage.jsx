import React, {Component} from 'react';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';
import {Link, NavLink} from 'react-router-dom';
import LaddaButton, { XL, SLIDE_UP } from 'react-ladda';
import { Field, reduxForm } from 'redux-form';
import {notify} from 'react-notify-toast';
import { validate_loginForm as validate }  from './../common/forms/validation';
import { renderTextField, renderTextarea } from './../common/forms/input-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import InternalTextBanner from './../components/banners/internalTextBanner';
import {appName} from '../constants';

import axios from 'axios';
import {LOG_IN_ENDPOINT_POST} from "../endpoints";

class LoginPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
        };
    }

    toggle() {
        this.setState({
            loading: !this.state.loading,
            progress: 0.5,
        });
    }

  submit(data){
      this.toggle();
      console.log(data);
      const {email, password} = data;

      axios.post(LOG_IN_ENDPOINT_POST, {email, password})
          .then((success) => {
              console.log(success.data.success.message);
              this.toggle();
              notify.show(success.data.success.message, 'success');
              this.props.history.push("/");
          })
          .catch((error) => {
              console.log(error.response.data.error.message);
              notify.show(error.response.data.error.message, 'error');
              this.toggle();
          });

  }

  head(){
    return (
        <Helmet bodyAttributes={{class: "contactPage"}}>
          <title>{`Login - ${appName}`}</title>
        </Helmet>
    );
  }

    render() {
      const { handleSubmit } = this.props

      return (
          
          <section className="contactPage_wrap">
          {this.head()}
            <InternalTextBanner Heading="Login" wrapperClass="contact" />
            <ReactCSSTransitionGroup transitionName="anim" transitionAppear={true}  transitionAppearTimeout={5000} transitionEnter={false} transitionLeave={false}>
            <div className="main anim-appear">
                  <div className="grid">
                      <div className="column column_12_12">
                        <div className="content_block">

                          <form onSubmit={handleSubmit(this.submit.bind(this))}>

                            <div className="form_wrap">


                              <div className="form_row">
                                <Field
                                  name="email"
                                  component={renderTextField}
                                  label="Email:"
                                />
                              </div>

                                <div className="form_row">
                                    <Field
                                        name="password"
                                        component={renderTextField}
                                        label="Password:"
                                        type="password"
                                    />
                                </div>

                              <div className="form_buttons">
                                  <LaddaButton
                                      type="submit"
                                      className="btn first"
                                      loading={this.state.loading}
                                      data-color="#eee"
                                      data-size={XL}
                                      data-style={SLIDE_UP}
                                      data-spinner-size={30}
                                      data-spinner-color="#ddd"
                                      data-spinner-lines={12}
                                  >
                                      LogIn
                                  </LaddaButton>
                              </div>

                                <Link to="/register">Don't have account? Register </Link>

                            </div>

                          </form>

                        </div>
                      </div>
                  </div>
              </div>
              </ReactCSSTransitionGroup>
          
          </section>
        
      );
    }
  }


  LoginPage = reduxForm({
      form: 'contactForm',
      validate,
      enableReinitialize: true,
  })(LoginPage);

export default {
  component: LoginPage
};