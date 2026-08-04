import { 
  Body, 
  Button, 
  Container, 
  Head, 
  Heading, 
  Html, 
  Preview, 
  Section, 
  Text, 
} from "@react-email/components";
import * as React from "react";

interface AnnouncementEmailProps {
  recipientName: string;
  schoolName: string;
  title: string;
  description: string;
  link?: string;
}

export const AnnouncementEmail: React.FC<AnnouncementEmailProps> = ({
  recipientName,
  schoolName,
  title,
  description,
  link,
}) => {
  return (
    <Html>
      <Head />
      <Preview>New Announcement from {schoolName}: {title}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>📢 New Announcement</Heading>
          <Text style={text}>Dear {recipientName},</Text>
          <Text style={text}>
            {schoolName} has an important announcement for you.
          </Text>
          <Section style={section}>
            <Text style={text}><strong>Title:</strong> {title}</Text>
            <Text style={text}><strong>Description:</strong></Text>
            <Text style={text}>{description}</Text>
          </Section>
          {link && (
            <Button style={button} href={link}>
              View Full Announcement
            </Button>
          )}
          <Text style={text}>
            Please check your dashboard for more details and updates.
          </Text>
          <Text style={footer}>
            © {new Date().getFullYear()} {schoolName}. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default AnnouncementEmail;

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
