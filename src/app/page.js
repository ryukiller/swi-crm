'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import "rsuite/dist/rsuite.min.css";


import MainLayout from '@/components/layout/MainLayout';
import ZenTimeChart from '../components/charts/ZenTimeChart'
import { DateRangePicker } from 'rsuite';


const inter = Inter({ subsets: ['latin'] })

function formatDate(date) {
  // Array of month names, shorten to 3 characters
  const monthNames = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

  // get day of the month, month, and year from the date
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear().toString().substr(-2);  // last 2 digits of year

  // return formatted date
  return `${day} ${monthNames[monthIndex]} ${year}`;
}

function calculateTimePassed(startTimestamp, endTimestamp) {
  // Convert timestamps to Date objects
  const startDate = new Date(startTimestamp);
  const endDate = new Date(endTimestamp);

  if (startDate === endDate) {
    endDate.setHours(13)
  }

  if (endDate.getHours() === 0) {
    endDate.setHours(13)
  }

  // Normalise the time to 9:00 on a working day if before/after working hours or on a weekend
  function normaliseDate(d) {
    if (d.getHours() < 9 || d.getHours() > 18 || d.getDay() === 0 || d.getDay() === 6) {
      if (d.getHours() < 9 || d.getDay() === 0 || d.getDay() === 6) {
        d.setHours(9);
        d.setMinutes(0);
        if (d.getDay() === 0) {
          d.setDate(d.getDate() + 1);
        } else if (d.getDay() === 6) {
          d.setDate(d.getDate() + 2);
        }
      } else if (d.getHours() > 18) {
        d.setHours(13);
        d.setMinutes(0);
        d.setDate(d.getDate() + 1);
      }
    }
    return d;
  }

  const start = normaliseDate(startDate);
  const end = normaliseDate(endDate);

  // Calculate total minutes
  let totalMinutes = 0;
  while (start <= end) {
    // If it's a working day (not Saturday or Sunday)
    if (start.getDay() !== 0 && start.getDay() !== 6) {
      // If it's working hours (from 9:00 AM to 6:00 PM)
      if (start.getHours() >= 9 && start.getHours() < 18) {
        totalMinutes++;
      } else if (start.getHours() >= 18) {
        start.setHours(9);
        start.setMinutes(0);
        start.setDate(start.getDate() + 1);
        continue;
      }
    } else {
      start.setDate(start.getDate() + 1);
      continue;
    }
    start.setMinutes(start.getMinutes() + 1);
  }
  return totalMinutes;
}



export default function Home() {
  const starD = new Date('2023-03-03')
  const today = new Date()

  const [tickets, setTickets] = useState([]);
  const [range, setRange] = useState([starD, today])
  const [filteredData, setFilteredData] = useState([]);
  const [averageCompletionTime, setAverageCompletionTime] = useState(0);
  const [avgZen, setAvgZen] = useState([]);
  const [closedDates, setClosedDates] = useState([]);
  const [numeroTickets, setNumeroTickets] = useState();
  const [completedTickets, setCompletedTickets] = useState();

  const fetchTickets = async () => {
    const res = await fetch("/api/zendesk", {
      method: "GET",
    });
    const data = await res.json();

    const sortedData = data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    setTickets(sortedData);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {


    let totalMinutes = 0;
    let filtered = tickets;

    if (range) {

      setNumeroTickets(filtered.length)

      filtered = filtered.filter(
        ticket =>
          new Date(ticket.created_at) >= new Date(range[0]) &&
          new Date(ticket.created_at) <= new Date(range[1])
      );
      let completed = filtered.filter(
        ticket =>
          new Date(ticket.created_at) >= new Date(range[0]) &&
          new Date(ticket.created_at) <= new Date(range[1]) &&
          ticket.closed_at !== null)

      console.log(completed.length)

      setNumeroTickets(filtered.length)
      setCompletedTickets(completed.length)

      filtered = tickets.filter(ticket => new Date(ticket.created_at) >= new Date(range[0]) &&
        new Date(ticket.created_at) <= new Date(range[1]) &&
        ticket.closed_at !== null);

    } else {

      setNumeroTickets(filtered.length)

      filtered = tickets.filter(ticket => ticket.closed_at !== null);
      setCompletedTickets(filtered.length)
    }




    let avgZenArray = [];
    let closedDatesArray = [];

    for (const ticket of filtered) {
      const { ticket_id, created_at, closed_at } = ticket;
      const date1 = new Date(created_at);
      const date2 = new Date(closed_at);

      const options = {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      };

      const formatDate1 = date1.toLocaleDateString(undefined, options);
      const formatDate2 = date2.toLocaleDateString(undefined, options);

      const minutesPassed = calculateTimePassed(created_at, closed_at);
      closedDatesArray.push(formatDate1 + ' ' + formatDate2 + ' ID:' + ticket_id)
      avgZenArray.push(minutesPassed)
      totalMinutes += minutesPassed;
    }
    console.log(filtered.length)
    setFilteredData(filtered);
    setAvgZen(avgZenArray);
    setClosedDates(closedDatesArray);
    setAverageCompletionTime(totalMinutes / filtered.length);
  }, [range, tickets])

  // Example usage:



  return (
    <MainLayout className="mx-10" >
      <main className='w-full'>
        <div className="flex flex-row items-start justify-start">
          <div className="stats stats-vertical shadow w-[10%]">
            <div className="stat">
              <div className="stat-title">Numero ticket</div>
              <div className="stat-value">{numeroTickets}</div>
              <div className="stat-desc">{range ? formatDate(range[0]) + ' - ' + formatDate(range[1]) : '3 Apr 23 - Oggi'}</div>
            </div>

            <div className="stat">
              <div className="stat-title">Ticket completati</div>
              <div className="stat-value">{completedTickets}</div>
            </div>

            <div className="stat">
              <div className="stat-title">Ticket non risolti</div>
              <div className="stat-value">{numeroTickets - completedTickets}</div>
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
          <div className="w-[90%]">
            <DateRangePicker onChange={value => setRange(value)} />
            <ZenTimeChart averageCompletionTime={avgZen} closedDates={closedDates} />
          </div>
        </div>
      </main >
    </MainLayout>
  )
}
