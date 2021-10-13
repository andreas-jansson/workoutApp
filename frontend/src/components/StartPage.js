import React, { Component, useEffect, useState } from "react";
import { Parallax, Background } from "react-parallax";
import emailjs from "emailjs-com";
import "../../static/css/startpage.css";
import "../../static/css/icofont.min.css";
import styled, { css } from "styled-components";
import Typewriter from 'typewriter-effect'

const image1 =
  "https://www.sponser.com/media/catalog/product/h/e/header_pre_workout_booster.png";
const image2 =
  "https://cdn.shopify.com/s/files/1/1333/5043/articles/home-remedies-face_1600x.jpg?v=1594755799";
const image3 =
  "https://hibbettblog.com/wp-content/uploads/2020/01/Weights-on-rack-at-gym.jpg";
const image4 =
  "https://www.socialseo.com/wp-content/uploads/2018/11/black-brick.jpg";

const inlineStyle = {
  background: "#fff",
  left: "50%",
  top: "50%",
  position: "absolute",
  padding: "20px",
  transform: "translate(-50%, -50%)",
};

const parallax = () => {
  return (
    <div>
      <div style={{ textAlign: "center" }}>
          
        <Parallax bgImage={image1} strength={-300}>
            <div className='headingg' justifyContent='center'>WORKIT</div>
            <br/> 
        <div className='sub-headingg' justifyContent='center'>
           It's for the
            
            <Typewriter
            onInit={(typewriter) => {
                typewriter.typeString("Dedicated").pauseFor(2000).deleteAll().typeString("Inspired").pauseFor(2000).deleteAll().typeString("Excited").pauseFor(2000).deleteAll().start();
            }}
            />
                </div>
          <div
            style={{
              width: 250,
              height: 750,
            }}
          >
              
          </div>
        </Parallax>
        <Parallax
          bgImage={image2}
          strength={300}
          renderLayer={(precentage) => (
            <div
              style={{
                position: "absolute",
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                left: "50%",
                top: "50%",
                background: `rgba(255, 123, 23, ${precentage * 1})`,
                transform: `translate(-50%, -50%) scale(${precentage * 5})`,
              }}
            ></div>
          )}
        >
          <div style={{ height: "750px" }} align="center"></div>
        </Parallax>

        <Parallax
          blur={{ min: -15, max: 15 }}
          bgImage={image3}
          bgImageAlt="the dog"
          strength={-200}
        >
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
      <Card background="#4f9deb">
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

const contactUs = () => {
  function sendEmail(e) {
    e.preventdefault();

    emailjs
      .sendForm(
        "service_3yncdof",
        "template_hte4ibb",
        e.target,
        "user_JKn0SxPW0K2IyVQxkRJfu"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  }

  return (
    <div
      className="container border"
      style={{
        marginTop: "150px",
        width: "50%",
        backgroundImage: `url('https://cutewallpaper.org/21/fitness/Mens-Fitness-Workouts-Exercise-Health-Nutrition-GQ.png')`,

        backgroundPosition: "center",
        backgroundSize: "cover",
        borderRadius: "20px",
      }}
    >
      <div align="center">
        <h1 style={{ marginTop: "25px" }}>Contact Form</h1>
      </div>
      <form onSubmit={sendEmail} align="left" width="20px">
        <label>Name</label>
        <input type="text" name="name" className="form-control" />

        <label>Email</label>
        <input type="email" name="email" className="form-control" />

        <label>Message</label>
        <textarea name="message" rows="4" className="form-control" />

        <input
          style={{ marginTop: "30px" }}
          type="submit"
          value="Send"
          className="form-control btn btn-primary"
          style={{ marginTop: "30px" }}
        />
      </form>
      <br /> <br />
    </div>
  );
};

function StartPage() {
  return <div>{parallax()}</div>;
}

export default StartPage;
