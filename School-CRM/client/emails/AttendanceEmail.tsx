import { 
  Body, 
  Container, 
  Head, 
  Heading, 
  Html, 
  Preview, 
  Section, 
  Text, 
} from "@react-email/components";
import * as React from "react";

interface AttendanceEmailProps {
  studentName: string;
  parentName: string;
  date: string;
  status: "Present" | "Absent" | "Late";
  schoolName: string;
}

export const AttendanceEmail: React.FC<AttendanceEmailProps> = ({
  studentName,
  parentName,
  date,
  status,
  schoolName,
}) => {
  const statusColor = status === "Present" ? "#10b981" : status === "Absent" ? "#ef4444" : "#f59e0b";
  
  return (
    <Html>
      <Head />
      <Preview>Attendance Update for {studentName} - {date}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Attendance Update</Heading>
          <Text style={text}>Dear {parentName},</Text>
          <Text style={text}>
            This is to inform you about the attendance of your child, {studentName}, 
            for {date}.
          </Text>
          <Section style={statusSection}>
            <Text style={text}><strong>Status:</strong></Text>
            <Text style={{ ...statusText, color: statusColor }}>{status}</Text>
          </Section>
          <Text style={text}>
            If you have any questions about this attendance record, please contact 
            the school administration.
          </Text>
          <Text style={footer}>
            © {new Date().getFullYear()} {schoolName}. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default AttendanceEmail;

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

const statusSection = {
  margin: "32px 0",
  padding: "20px",
  backgroundColor: "#f0f4f8",
  borderRadius: "8px",
  textAlign: "center" as const,
};

const statusText = {
  fontSize: "24px",
  fontWeight: "bold",
  marginTop: "8px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  marginTop: "32px",
};
