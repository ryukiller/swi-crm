'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'

const inter = Inter({ subsets: ['latin'] })

function calculateTimePassed(startTimestamp, endTimestamp) {
  // Convert timestamps to Date objects
  const startDate = new Date(startTimestamp);
  const endDate = new Date(endTimestamp);

  // Calculate total milliseconds difference between start and end dates
  const totalMilliseconds = endDate - startDate;

  // Calculate total days difference, excluding weekends
  const daysDifference = Math.floor(totalMilliseconds / (1000 * 60 * 60 * 24));
  const weekendsCount = Math.floor((daysDifference + startDate.getDay()) / 7) * 2;

  // Calculate total non-working hours in milliseconds (assuming non-working hours are 9:00 PM to 8:00 AM)
  const nonWorkingStart = new Date().setHours(18, 0, 0, 0); //6:00 PM
  const nonWorkingEnd = new Date().setHours(9, 0, 0, 0); // 8:00 AM
  const nonWorkingHours = (nonWorkingEnd - nonWorkingStart + 24 * 60 * 60 * 1000) % (24 * 60 * 60 * 1000);

  const lunchBreak = 60 * 60 * 1000;

  // Calculate time difference in milliseconds, excluding weekends and non-working hours
  const timeDifference = totalMilliseconds - (weekendsCount * 24 * 60 * 60 * 1000) - (daysDifference * nonWorkingHours) - lunchBreak;

  // Convert the final time difference to minutes
  const minutesDifference = Math.floor(timeDifference / (1000 * 60));

  return minutesDifference;
}




export default function Home() {

  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    const res = await fetch("/api/zendesk", {
      method: "GET",
    });
    const data = await res.json();

    setTickets(data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Example usage:

  let totalMinutes = 0;
  const filteredData = tickets.filter(ticket => ticket.closed_at !== null);

  for (const ticket of filteredData) {
    const { created_at, closed_at } = ticket;
    const minutesPassed = calculateTimePassed(created_at, closed_at);
    totalMinutes += minutesPassed;
  }

  const averageCompletionTime = totalMinutes / filteredData.length;



  return (
    <main className={styles.main}>
      <div>Tempo di risoluzione contando solo ore/giorni lavorativi:
        <ul>
          <li>Numero ticket: {tickets.length}</li>
          <li>Ticket completati: {filteredData.length}</li>
          <li>Ticket non risolti: {tickets.length - filteredData.length}</li>
          <li>Minuti in media: {averageCompletionTime.toFixed(2)}</li>
          <li>Ore in media: {(averageCompletionTime / 60).toFixed(2)}</li>
        </ul>
      </div>
    </main >
  )
}
