import React from "react";
import { Parallax } from "react-parallax";
import Typewriter from "typewriter-effect";
import { Link } from "react-router-dom";

import {
  PriceCardBasic,
  PriceCardPremium,
  PriceCardDeluxe,
} from "./StartPagePriceCards";
import { StartPagecontactUsForm } from "./StartPageContactForm";

const image1 =
  "https://www.sponser.com/media/catalog/product/h/e/header_pre_workout_booster.png";
const image2 =
  "https://cdn.shopify.com/s/files/1/1333/5043/articles/home-remedies-face_1600x.jpg?v=1594755799";
const image3 =
  "https://hibbettblog.com/wp-content/uploads/2020/01/Weights-on-rack-at-gym.jpg";
const image4 =
  "https://www.socialseo.com/wp-content/uploads/2018/11/black-brick.jpg";

export const renderHeader = () => {
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
            <div className="header-btn-btn4">Login</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const StartPageParallax = () => {
  return (
    <div>
      <div className="sp-container">
        <div className="sp-section">
          <div style={{ textAlign: "center" }}>
            {renderHeader()}

            <a id="HOME" color="none"></a>
            <Parallax
              bgImage={image1}
              strength={-300}
              bgImageStyle={{
                opacity: "0.35",
              }}
            >
              <div
                className="headingg"
                justifyContent="center"
                initial-scale="1.0"
              >
                WORKIT
              </div>
              <br />
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
                      .typeString("The Ambitious")
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
                  height: 350,
                }}
              ></div>
                <a id="ABOUT" color="none"></a>
            </Parallax>
          </div>
          <Parallax
            bgImage={image2}
            strength={1000}
            renderLayer={() => (
              <div className="renderlayer-parallax-about-us">
                <h1>
                  About WORKIT <br />
                </h1>
                <h3>
                  With a 24-hour service and intense training, Madav AB not only
                  develops strong muscles, but also bonds between our clients
                  and their coaches. Our team fitness crew is comprised of
                  seasoned athletes that have coaching expertise with
                  individuals of all ages and body types.
                </h3>
                <br /> 
                  <h1>
                    Why choose us? <br />
                  </h1>
                  <h3>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse interdum risus massa, eget gravida metus feugiat
                    et. Mauris vel est at neque gravida malesuada ut at mi.
                    Suspendisse et diam eu dui condimentum lacinia ac non risus.
                    Pellentesque fermentum feugiat odio vitae luctus. Praesent
                    nibh justo, suscipit et ultrices et, ullamcorper eget
                    ligula. Vestibulum nec sollicitudin justo. Nunc ultricies
                    placerat auctor. Integer eget eleifend sapien. 
                  </h3>
                </div>
            )}
            >
              <br/>
              <br/>
            <div className='parallax-image2'></div>
          </Parallax>
              <a id="PRICING" color="none"></a>
          <Parallax
            blur={{ min: -15, max: 15 }}
            bgImage={image3}
            strength={1300}
          >
            <div
              className='price-cards' 
            >

              <div className='left-card'> 
              <PriceCardBasic />
              </div>


              <div className='middle-card'> 
              <PriceCardDeluxe />
              </div>

              <div className='right-card'> 
              <PriceCardPremium />
              </div>

            </div>

            <div className='parallax-image3' />
            
          </Parallax>
          <a id="CONTACT" color="none"></a>
          <Parallax bgImage={image4} strength={-300}>
            {StartPagecontactUsForm()}
            <div
              style={{
                width: 50,
                height: 155,
              }}
            ></div>
          </Parallax>
        </div>
      </div>
    </div>
  );
};
