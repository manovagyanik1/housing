import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import {Link, NavLink} from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import LaddaButton, { XL, SLIDE_UP } from 'react-ladda';
import {notify} from 'react-notify-toast';
import { validate_registerForm as validate }  from './../common/forms/validation';
import { renderTextField, renderTextarea } from './../common/forms/input-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import InternalTextBanner from './../components/banners/internalTextBanner';
import {appName} from '../constants';

import axios from 'axios';
import {SIGN_UP_ENDPOINT_POST} from "../endpoints";
import {renderDropdownList} from "../common/forms/input-types/index";

class RegisterPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            showForm: true,
        };
    }

    toggle() {
        this.setState({
            loading: !this.state.loading,
            progress: 0.5,
            showForm: this.state.showForm,
        });
    }

    submit(data){
        this.toggle();
        console.log(data);
        const {name, email, password} = data;

        axios.post(SIGN_UP_ENDPOINT_POST, {name, email, password, sex: "male"})
            .then((success) => {
                console.log(success.data.success.message);
                this.toggle();
                notify.show(success.data.success.message, 'success');
                this.setState({
                    loading: false,
                    showForm: false
                })
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
          <title>{`Register - ${appName}`}</title>
        </Helmet>
    );
  }

    render() {
      const { handleSubmit } = this.props

      return (

          <section className="contactPage_wrap">
          {this.head()}
            <InternalTextBanner Heading="Register" wrapperClass="contact" />
            <ReactCSSTransitionGroup transitionName="anim" transitionAppear={true}  transitionAppearTimeout={5000} transitionEnter={false} transitionLeave={false}>
            <div className="main anim-appear">
                  <div className="grid">
                      <div className="column column_12_12">
                        <div className="content_block">

                            {
                                !this.state.showForm ? <div className="confirm_email_block">
                                    <div className="confirm_email_check">
                                        Sign up successful, Check your email and verify
                                    </div>
                                    <Link className="proceed-to-link" to="/login">Proceed to login</Link>

                                </div> : <form onSubmit={handleSubmit(this.submit.bind(this))}>

                                    <div className="form_wrap">


                                        <div className="form_row">
                                            <Field
                                                name="name"
                                                component={renderTextField}
                                                label="Name:"
                                            />
                                        </div>


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

                                        <div className="form_row">
                                            <Field
                                                name="sex"
                                                component={renderDropdownList}
                                                label="Sex:"
                                                data={[ 'male', 'female' ]}/>
                                        </div>

                                        <div className="form_row">
                                            <Field
                                                name="type"
                                                component={renderDropdownList}
                                                label="User Type:"
                                                data={[ 'normal user', 'realtor' ]}/>
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
                                                Send
                                            </LaddaButton>
                                        </div>

                                        <Link to="/login">Already have account? Login </Link>

                                    </div>

                                </form>

                            }

                        </div>
                      </div>
                  </div>
              </div>
              </ReactCSSTransitionGroup>

          </section>

      );
    }
  }


  RegisterPage = reduxForm({
      form: 'contactForm',
      validate,
      enableReinitialize: true,
  })(RegisterPage);


function mapStateToProps(state){
    return {
        user: state.user
    };
};

export default {
  component: connect(mapStateToProps)(RegisterPage)
};