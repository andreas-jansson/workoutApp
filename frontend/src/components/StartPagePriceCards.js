import React, { useState } from "react";
import "../../static/css/startpage.css";
import "../../static/css/icofont.min.css";
import styled, { css } from "styled-components";

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

export const PriceCardBasic = () => {
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
};

export const PriceCardPremium = () => {
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
};

export const PriceCardDeluxe = () => {
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
};
