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
import { withRouter } from 'react-router-dom'
import axiosInstance from '../client';

import {UPDATE_USER_ENDPOINT_PUT} from "../endpoints";
import {renderDropdownList} from "../common/forms/input-types/index";
import {Gen} from "../helpers/gen";
import {clearUserDetails, fetchOtherUserDetails} from "../actions";

class UserProfile extends Component {

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

    logout(e) {
        e.preventDefault();
        this.props.clearUserDetails();
        this.props.history.push(`/login`);
    }

    submit(data){
        this.toggle();
        console.log(data);
        const {id} = this.props.user;

        axiosInstance.put(UPDATE_USER_ENDPOINT_PUT + '/' + id, data)
            .then((success) => {
                console.log(success.data.success.message);
                notify.show(success.data.success.message, 'success');
                this.setState({
                    loading: false,
                    showForm: false
                })
            })
            .catch((error) => {
                this.setState({
                    loading: false,
                    showForm: true
                })

                if(error.response.data && error.response.data.message) {
                    console.log(error.response.data.error.message);
                    notify.show(error.response.data.error.message, 'error');
                }

            });

  }

  head(){
    return (
        <Helmet bodyAttributes={{class: "contactPage"}}>
          <title>{`User Profile - ${appName}`}</title>
        </Helmet>
    );
  }

    render() {
      const { handleSubmit } = this.props;

      return (

          <section className="contactPage_wrap">
          {this.head()}
            <InternalTextBanner Heading="User Profile" wrapperClass="contact" />
            <ReactCSSTransitionGroup transitionName="anim" transitionAppear={true}  transitionAppearTimeout={5000} transitionEnter={false} transitionLeave={false}>
            <div className="main anim-appear">
                  <div className="grid">
                      <div className="column column_12_12">
                        <div className="content_block">

                             <form className="user-profile-container" onSubmit={handleSubmit(this.submit.bind(this))}>

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
                                                name="sex"
                                                component={renderDropdownList}
                                                label="Sex:"
                                                data={[ 'male', 'female' ]}/>
                                        </div>

                                        <div className="form_row">
                                            <Field
                                                name="role"
                                                component={renderDropdownList}
                                                label="User Type:"
                                                data={[ 'admin', 'realtor', 'consumer' ]}/>
                                        </div>

                                        {
                                            Gen.isUserAdmin() ?  <div className="form_row">
                                                <Field
                                                    name="status"
                                                    component={renderDropdownList}
                                                    label="Status:"
                                                    data={[ 'active', 'inactive' ]}/>
                                            </div>: ''
                                        }


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
                                                Update Profile
                                            </LaddaButton>
                                        </div>

                                        <Link className="logout-link" to="/" onClick={this.logout.bind(this)}>Logout</Link>
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


UserProfile = reduxForm({
      form: 'userProfileForm',
      validate,
      enableReinitialize: true,
  })(UserProfile);


function mapStateToProps(state){
    return {
        user: state.user,
        initialValues: state.user
    };
};

export default {
  component: withRouter(connect(mapStateToProps, {clearUserDetails})(UserProfile))
};