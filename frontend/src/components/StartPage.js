import React, { Component, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import { Parallax, Background } from "react-parallax";
import emailjs, { init } from "emailjs-com";
import "../../static/css/startpage.css";
import "../../static/css/icofont.min.css";
import styled, { css } from "styled-components";
import Typewriter from "typewriter-effect";

const image1 =
  "https://www.sponser.com/media/catalog/product/h/e/header_pre_workout_booster.png";
const image2 =
  "https://cdn.shopify.com/s/files/1/1333/5043/articles/home-remedies-face_1600x.jpg?v=1594755799";
const image3 =
  "https://hibbettblog.com/wp-content/uploads/2020/01/Weights-on-rack-at-gym.jpg";
const image4 =
  "https://www.socialseo.com/wp-content/uploads/2018/11/black-brick.jpg";

const parallax = () => {
  return (
    <div>
      <div style={{ textAlign: "center" }}>
        {renderHeader()}
        <a id="HOME" color="none"></a>
        <Parallax bgImage={image1} strength={-300}>
          <div className="headingg" justifyContent="center">
            WORKIT
          </div>
          <br/>
          <div className="sub-headingg" justifyContent="center">
            It's for
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString("The Dedicated")
                  .pauseFor(1000)
                  .deleteAll()
                  .typeString("The Inspired")
                  .pauseFor(1000)
                  .deleteAll()
                  .typeString("The Ambigious")
                  .pauseFor(1000)
                  .deleteAll()
                  .typeString("The Herculean")
                  .pauseFor(1000)
                  .deleteAll()
                  .typeString("YOU")
                  .start();
                <br />;
              }}
            />
          </div>
          <br />
          <Link to="/signup">
            <button type="button" className="sp-bttn-join">
              Join!
            </button>
          </Link>
          <div
            style={{
              width: 250,
              height: 550,
            }}
          ></div>
          <a id="ABOUT" color="none"></a>
        </Parallax>
        <Parallax
          bgImage={image2}
          strength={200}
          renderLayer={() => (
            <div
              style={{
                width: "700px",
                height: "200px",
                marginLeft: "5%",
                fontSize: "23px",
                background: "orange",
                borderRadius: "30px",
                opacity: "80%",
              }}
            >
              <h1>
                Madav AB <br />
              </h1>
              <h3>
                For our clients and instructors at Madav AB, we create powerful
                muscles. With 24/7 service and intense training.
              </h3>
            </div>
          )}
        >
          <div style={{ height: "350px" }}></div>
        </Parallax>

        <Parallax blur={{ min: -15, max: 15 }} bgImage={image3} strength={-100}>
          <a id="PRICING" color="none"></a>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "140px",
            }}
          >
            <PriceCard1 />
            <PriceCard3 />
            <PriceCard2 />
          </div>

          <div style={{ height: "250px" }} />
        </Parallax>
        <a id="CONTACT" color="none"></a>
        <Parallax bgImage={image4} strength={-300}>
          {contactUs()}
          <div
            style={{
              width: 50,
              height: 75,
            }}
          ></div>
        </Parallax>
      </div>
    </div>
  );
};

const gradient = () => css`
  background: var(--grayDefault);
`;

const gradient2 = () => css`
  background: var(--orangeGradiant2);
`;

const Card = styled.div`
  position: relative;
  overflow: hidden;
  width: 300px;
  padding: 3rem 0 2rem;
  border-radius: 0.5rem;
  color: white;
  opacity: 90%;
  ${gradient()};
  box-shadow: 0 24px 38px 3px rgba(0, 0, 0, 0.25),
    0 9px 46px 8px rgba(0, 0, 0, 0.25), 0 11px 15px -7px rgba(0, 0, 0, 0.25);
`;

const Content = styled.div`
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  flex: 0 0 auto;
  margin-bottom: 2rem;
  border-radius: 50%;
  font-size: 40px;
  color: white;
  ${gradient2()};
  box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.25);
`;

const PlanTitle = styled.div`
  font-size: 4rem;
`;

const PlanCost = styled.div`
  font-size: 3rem;
`;

const PlanText = styled.div`
  font-size: 2rem;
  color: red;
`;

const FeaturesListItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.325rem;
`;

const ActionButton = styled.button`
  flex: 0 0 auto;
  height: 40px;
  padding: 0 2rem;
  border: 0;
  margin-top: 20px;
  border-radius: 15px;
  color: rgba(0, 0, 0, 0.85);
  background: rgba(248, 148, 6, 1);
  box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.25);
  transition: background 0.25s;
`;

function PriceCard1() {
  const [features] = useState([
    "1 Month Membership",
    "20 Exercises",
    "Workouts in the Calendar",
  ]);

  return (
    <div>
      <Card>
        <Content>
          <Icon className="icofont-gym-alt-1" />
          <PlanTitle>Basic</PlanTitle>
          <PlanCost>€35</PlanCost>
          {features.map((item) => (
            <FeaturesListItems>
              <span>{item}</span>
            </FeaturesListItems>
          ))}
          <ActionButton>Place order</ActionButton>
        </Content>
      </Card>
    </div>
  );
}

function PriceCard2() {
  const [features] = useState([
    "3 Month Membership",
    "45 Exercises",
    "+ All Benefits of the Previous Tier",
  ]);

  return (
    <div>
      <Card>
        <Content>
          <Icon className="icofont-gym-alt-2" />
          <PlanTitle>Premium</PlanTitle>
          <PlanCost>€50</PlanCost>
          {features.map((item) => (
            <FeaturesListItems>
              <span>{item}</span>
            </FeaturesListItems>
          ))}
          <ActionButton>Place order</ActionButton>
        </Content>
      </Card>
    </div>
  );
}

function PriceCard3() {
  const [features] = useState([
    "12 Month Membership",
    "+ All Benefits of the Previous Tier",
  ]);

  return (
    <div>
      <Card>
        <Content>
          <Icon className="icofont-muscle-weight" />
          <PlanTitle>Deluxe</PlanTitle>
          <PlanText>Save 15%</PlanText>
          <PlanCost>€200</PlanCost>
          {features.map((item) => (
            <FeaturesListItems>
              <span>{item}</span>
            </FeaturesListItems>
          ))}
          <ActionButton>Place order</ActionButton>
        </Content>
      </Card>
    </div>
  );
}

function contactUs() {
  window.onload = function () {
    emailjs.init("user_JKn0SxPW0K2IyVQxkRJfu");
    const btn = document.getElementById("button");

    document
      .getElementById("form")
      .addEventListener("submit", function (event) {
        event.preventDefault();

        btn.value = "Sending...";

        const serviceID = "default_service";
        const templateID = "template_hte4ibb";

        emailjs.sendForm(serviceID, templateID, this).then(
          () => {
            btn.value = "Send Email";
            this.reset();
            window.location.href = "#HOME";
            alert("Email sent!");
          },
          (err) => {
            btn.value = "Send Email";
            alert(JSON.stringify(err));
          }
        );
      });
  };

  return (
    <div
      justifyContent="center"
      className="startpage-email-box"
      style={{
        backgroundImage: `url('https://cutewallpaper.org/21/fitness/Mens-Fitness-Workouts-Exercise-Health-Nutrition-GQ.png')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        borderRadius: "20px",
      }}
    >
      <div align="center" className="startpage-email-TITLE">
        <h1> Contact Us </h1>
        <br />
      </div>
      <br /> <br /> <br />
      <div className="startpage-MOVE-INPUT">
        <form id="form" className="startpage-email-label">
          <div class="field">
            <label for="name" className="label-email ">
              Full Name
            </label>
            <br />
            <input
              type="text"
              name="name"
              className="input-email"
              maxlength="25"
              minLength="3"
              id="name"
              required
            />
          </div>
          <br />
          <div class="field">
            <label for="email" class="tooltip" className="label-email ">
              Email Address
            </label>
            <br />
            <input
              type="email"
              name="email"
              id="email"
              className="input-email"
              maxlength="30"
              minLength="10"
              size="30"
              required
            />
          </div>
          <br />
          <div class="field">
            <label for="message" className="label-email">
              Your Message
            </label>
            <br /> <br />
            <textarea
              type="text"
              name="message"
              id="message"
              className="textarea-email"
              minLength="10"
              required
            />
          </div>
          <br /> <br />
          <div>
            <input
              type="submit"
              id="button"
              value="Send Email"
              className="sp-btttn-join"
            />
          </div>
          <br /> <br />
          <br /> <br />
        </form>
      </div>
      <script
        type="text/javascript"
        src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"
      ></script>
    </div>
  );
}

const renderHeader = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });
  return (
    <div>
      <div className="header-container">
        <div className="header-btn-container">
          <div className="header-btn-btn1">
            <a href="#ABOUT">About</a>
          </div>
          <div className="header-btn-btn1">
            <a href="#PRICING">Pricing</a>
          </div>
          <div className="header-btn-btn2">
            <a href="#CONTACT">Contact</a>
          </div>
          <Link to="/login">
            <div className="header-btn-btn3">Login</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

function StartPage() {
  return <div>{parallax()}</div>;
}

export default StartPage;
