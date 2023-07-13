'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'

import MainLayout from '@/components/layout/MainLayout';
import ZenTimeChart from '../components/charts/ZenTimeChart'

const inter = Inter({ subsets: ['latin'] })

function calculateTimePassed(startTimestamp, endTimestamp) {
  // Check if start date is after end date, if so, swap them
  if (startTimestamp > endTimestamp) {
    let temp = startTimestamp;
    startTimestamp = endTimestamp;
    endTimestamp = temp;
  }

  // Convert timestamps to Date objects
  const startDate = new Date(startTimestamp);
  const endDate = new Date(endTimestamp);

  if (startDate.toDateString() === endDate.toDateString() && startDate.getHours() === 0 && endDate.getHours() === 0) {
    startDate.setHours(9);
    endDate.setHours(13); // assume it's an 8 hour workday
  }

  let totalMinutes = 0;

  // Iterate over each day in the range
  for (let d = new Date(startDate); d <= endDate; d.setHours(d.getHours() + 1)) {
    // If it's a working day (not Saturday or Sunday)
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      // If it's working hours (from 9:00 AM to 12:00 PM and from 1:00 PM to 6:00 PM)
      if ((d.getHours() >= 9 && d.getHours() < 13) || (d.getHours() >= 14 && d.getHours() < 18)) {
        // Add this hour to the total
        totalMinutes += 60;
      }
    }
  }

  return totalMinutes;
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
  let avgZen = []
  let closedDates = []

  for (const ticket of filteredData) {


    const { created_at, closed_at } = ticket;

    const date1 = new Date(created_at); // Replace this with your desired date
    const date2 = new Date(closed_at);

    const options = {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    };

    const formatDate1 = date1.toLocaleDateString(undefined, options);
    const formatDate2 = date2.toLocaleDateString(undefined, options);


    const minutesPassed = calculateTimePassed(created_at, closed_at);
    closedDates.push(formatDate1 + ' ' + formatDate2)
    avgZen.push(minutesPassed)
    totalMinutes += minutesPassed;
  }

  console.log(avgZen, closedDates)

  const averageCompletionTime = totalMinutes / filteredData.length;

  return (
    <MainLayout className="mx-10" >
      <main className='w-full'>
        <div className="flex flex-row items-start justify-start">
          <div className="stats stats-vertical shadow">
            <div className="stat">
              <div className="stat-title">Numero ticket</div>
              <div className="stat-value">{tickets.length}</div>
              <div className="stat-desc">3 Apr 23 - Oggi</div>
            </div>

            <div className="stat">
              <div className="stat-title">Ticket completati</div>
              <div className="stat-value">{filteredData.length}</div>
            </div>

            <div className="stat">
              <div className="stat-title">Ticket non risolti</div>
              <div className="stat-value">{tickets.length - filteredData.length}</div>
            </div>

            <div className="stat">
              <div className="stat-title">Minuti in media</div>
              <div className="stat-value">{averageCompletionTime.toFixed(2)}</div>
            </div>

            <div className="stat">
              <div className="stat-title">Ore in media</div>
              <div className="stat-value">{(averageCompletionTime / 60).toFixed(2)}</div>
            </div>
          </div>
          <div className="w-[80%]">
            <ZenTimeChart averageCompletionTime={avgZen} closedDates={closedDates} />
          </div>
        </div>
      </main >
    </MainLayout>
  )
}
