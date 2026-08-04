import { 
  Body, 
  Button, 
  Container, 
  Head, 
  Heading, 
  Html, 
  Link, 
  Preview, 
  Section, 
  Text, 
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  principalName: string;
  schoolName: string;
  subdomain: string;
  username: string;
  loginUrl: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  principalName,
  schoolName,
  subdomain,
  username,
  loginUrl,
}) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to {schoolName} - Your Principal Account is Ready</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to {schoolName}!</Heading>
          <Text style={text}>Dear {principalName},</Text>
          <Text style={text}>
            Congratulations! Your school has been successfully created in our system. 
            You are now the Principal of {schoolName}.
          </Text>
          <Section style={section}>
            <Text style={text}>Here are your account details:</Text>
            <Text style={text}><strong>Username:</strong> {username}</Text>
            <Text style={text}><strong>School Subdomain:</strong> {subdomain}.localhost</Text>
            <Text style={text}><strong>Role:</strong> Principal</Text>
          </Section>
          <Text style={text}>
            As Principal, you can now:
          </Text>
          <ul style={list}>
            <li style={listItem}>Add and manage teachers</li>
            <li style={listItem}>Add and manage students</li>
            <li style={listItem}>Manage timetables and classes</li>
            <li style={listItem}>Handle day-to-day school operations</li>
          </ul>
          <Button style={button} href={loginUrl}>
            Login to Your Dashboard
          </Button>
          <Text style={footer}>
            If you have any questions, please contact our support team.
          </Text>
          <Text style={footer}>
            © {new Date().getFullYear()} School CRM. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "Arial, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  textAlign: "left" as const,
};

const section = {
  margin: "32px 0",
  padding: "20px",
  backgroundColor: "#f0f4f8",
  borderRadius: "8px",
};

const list = {
  margin: "16px 0",
  paddingLeft: "20px",
};

const listItem = {
  margin: "8px 0",
  color: "#333",
};

const button = {
  backgroundColor: "#5469d4",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "12px",
  margin: "32px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  marginTop: "32px",
};
