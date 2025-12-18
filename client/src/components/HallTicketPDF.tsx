import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register fonts (using standard fonts for simplicity in this environment)
// Ideally you would register custom fonts here

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#0F172A',
    paddingBottom: 10,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  universityName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 10,
    color: '#64748B',
    marginLeft: 10,
  },
  badge: {
    backgroundColor: '#0F172A',
    color: 'white',
    padding: '4 8',
    fontSize: 10,
    borderRadius: 4,
  },
  content: {
    flexDirection: 'row',
    gap: 20,
  },
  leftCol: {
    flex: 2,
  },
  rightCol: {
    flex: 1,
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#E2E8F0',
    paddingLeft: 20,
  },
  studentInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  infoItem: {
    width: '50%',
    marginBottom: 10,
  },
  label: {
    fontSize: 8,
    color: '#64748B',
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    padding: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    padding: 8,
  },
  col1: { width: '20%', fontSize: 10 },
  col2: { width: '20%', fontSize: 10 },
  col3: { width: '40%', fontSize: 10, fontWeight: 'bold' },
  col4: { width: '20%', fontSize: 10, color: '#64748B' },
  
  photoBox: {
    width: 100,
    height: 120,
    backgroundColor: '#E2E8F0',
    marginBottom: 10,
    borderRadius: 4,
  },
  qrBox: {
    width: 100,
    height: 100,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 5,
    padding: 5,
  },
  seatInfo: {
    textAlign: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    width: '100%',
  },
  seatLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  seatValue: {
    fontSize: 10,
    color: '#64748B',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#94A3B8',
  }
});

interface HallTicketPDFProps {
  studentName: string;
  rollNumber: string;
  dept: string;
}

export const HallTicketPDF = ({ studentName, rollNumber, dept }: HallTicketPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoSection}>
          <View>
            <Text style={styles.universityName}>Nexus University</Text>
            <Text style={styles.subtitle}>Semester End Examinations - Winter 2025</Text>
          </View>
        </View>
        <Text style={styles.badge}>OFFICIAL HALL TICKET</Text>
      </View>

      <View style={styles.content}>
        {/* Left Column: Info & Schedule */}
        <View style={styles.leftCol}>
          <View style={styles.studentInfoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Student Name</Text>
              <Text style={styles.value}>{studentName}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Roll Number</Text>
              <Text style={styles.value}>{rollNumber}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Department</Text>
              <Text style={styles.value}>{dept}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Semester</Text>
              <Text style={styles.value}>VI</Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.col1}>Date</Text>
              <Text style={styles.col2}>Time</Text>
              <Text style={styles.col3}>Subject</Text>
              <Text style={styles.col4}>Code</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.col1}>15 Dec</Text>
              <Text style={styles.col2}>10:00 AM</Text>
              <Text style={styles.col3}>Data Structures</Text>
              <Text style={styles.col4}>CS301</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.col1}>17 Dec</Text>
              <Text style={styles.col2}>10:00 AM</Text>
              <Text style={styles.col3}>Database Mgmt</Text>
              <Text style={styles.col4}>CS302</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.col1}>19 Dec</Text>
              <Text style={styles.col2}>10:00 AM</Text>
              <Text style={styles.col3}>Op. Systems</Text>
              <Text style={styles.col4}>CS303</Text>
            </View>
          </View>
        </View>

        {/* Right Column: Photo & QR */}
        <View style={styles.rightCol}>
          <View style={styles.photoBox}></View>
          <View style={styles.qrBox}>
              <Text style={{fontSize: 8, textAlign: 'center', marginTop: 40}}>QR CODE PLACEHOLDER</Text>
          </View>
          <Text style={{fontSize: 8, color: '#64748B', textAlign: 'center', marginBottom: 10}}>Scan for verification</Text>
          
          <View style={styles.seatInfo}>
            <Text style={styles.seatLabel}>ROOM: 304</Text>
            <Text style={styles.seatValue}>Seat: A-12</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Generated on Dec 18, 2025</Text>
        <Text style={styles.footerText}>Controller of Examinations | Principal</Text>
      </View>
    </Page>
  </Document>
);
