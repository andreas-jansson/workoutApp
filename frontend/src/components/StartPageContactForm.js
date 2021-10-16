import React from "react";
import emailjs, { init } from "emailjs-com";
import "../../static/css/startpage-contact.css";

export const StartPagecontactUsForm = () => {
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
        <form id="form">
      <div className="startpage-MOVE-INPUT">
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
          </div>
          <br />
                <div className="startpage-MOVE-TEXTAREA">
          <div class="field">
            <label for="message" className="label-textarea">
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
          <div  className="startpage-MOVE-BUTTON">
            <input
              type="submit"
              id="button"
              value="Send Email"
              className="sp-btttn-join"
              />
          </div>
              </div>
        </form>
          <br /> 
      <script
        type="text/javascript"
        src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"
      ></script>
    </div>
  );
};
