'use client'
import { useSession } from "next-auth/react";
import { use, useEffect, useState } from "react";

import { ArrowDownRight, ArrowUpRight, Eye, LogIn, Users } from "lucide-react"
import SimpleLineChart from "@/components/charts/SimpleLineChart";

function formatDate(date) {
    const year = date.getFullYear();

    // getMonth() returns month index starting from 0, so add 1 to get the actual month number
    let month = (date.getMonth() + 1).toString();

    // getDate() returns the day of the month
    let day = date.getDate().toString();

    // Pad single-digit months and days with a leading zero
    month = month.length === 1 ? '0' + month : month;
    day = day.length === 1 ? '0' + day : day;

    return `${year}-${month}-${day}`;
}

const MiniStats = ({ property }) => {

    const { data: session } = useSession();

    // data for charts
    const [charts, setCharts] = useState(0)

    //sessioni
    const [visite, setVisite] = useState(0)
    const [visitePast, setVisitePast] = useState(0)
    const [monthPercent, setMonthPercent] = useState(0)
    const [activeBtn, setActiveBtn] = useState()
    //visualizzazioni
    const [pageViews, setPageViews] = useState(0)
    const [pageViewsPast, setPageViewsPast] = useState(0)
    const [monthPercentPageViews, setMonthPercentPageViews] = useState(0)
    //newUsers
    const [newUsers, setNewUsers] = useState(0)
    const [newUsersPast, setNewUsersPast] = useState(0)
    const [monthPercentNewUsers, setMonthPercentNewUsers] = useState(0)
    //activeUsers
    const [activeUsers, setActiveUsers] = useState(0)
    const [activeUsersPast, setActiveUsersPast] = useState(0)
    const [monthPercentActiveUsers, setMonthPercentActiveUsers] = useState(0)

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    function shortenNumber(num) {
        if (Math.abs(num) >= 1.0e+9) {
            return (Math.abs(num) / 1.0e+9).toFixed(2) + "B";
        } else if (Math.abs(num) >= 1.0e+6) {
            return (Math.abs(num) / 1.0e+6).toFixed(2) + "M";
        } else if (Math.abs(num) >= 1.0e+3) {
            return (Math.abs(num) / 1.0e+3).toFixed(2) + "K";
        } else {
            return Math.abs(num).toString();
        }
    }


    const fetchAnalytics = async (days) => {
        setActiveBtn(days);
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);

        const prevEndDate = new Date(startDate);
        const prevStartDate = new Date(startDate);
        prevStartDate.setDate(prevEndDate.getDate() - days);

        const fetchDataForPeriod = async (start, end) => {
            const response = await fetch(`/api/analytics?start=${start}&end=${end}&property=${property}`, {
                method: "GET",
                headers: {
                    authorization: `bearer ${session?.user.accessToken}`,
                },
            });
            if (!response.ok) {
                // handle error
                console.error("API request failed");
                return;
            }
            const data = await response.json();

            if (!data.row1 || !data.row1.sessions) {
                // handle error
                console.error("Data not in expected format");
                return;
            }
            console.log(data)
            const totalSessions = data.row1.sessions.reduce((acc, curr) => acc + parseInt(curr, 10), 0);
            const totalPageViews = data.row1.screenPageViews.reduce((acc, curr) => acc + parseInt(curr, 10), 0);
            const totalActiveUsers = data.row1.activeUsers.reduce((acc, curr) => acc + parseInt(curr, 10), 0);
            const totalNewUsers = data.row1.newUsers.reduce((acc, curr) => acc + parseInt(curr, 10), 0);

            const charts = data.row1;

            console.log(totalActiveUsers)

            return { totalSessions, totalPageViews, totalActiveUsers, totalNewUsers, charts };
        };



        const currentPeriodData = await fetchDataForPeriod(formatDate(startDate), formatDate(endDate));
        setVisite(currentPeriodData?.totalSessions);
        setPageViews(currentPeriodData?.totalPageViews);
        setActiveUsers(currentPeriodData?.totalActiveUsers)
        setNewUsers(currentPeriodData?.totalNewUsers)

        setCharts(currentPeriodData?.charts)

        const prevPeriodData = await fetchDataForPeriod(formatDate(prevStartDate), formatDate(prevEndDate));
        setVisitePast(prevPeriodData?.totalSessions);
        setPageViewsPast(prevPeriodData?.totalPageViews)
        setActiveUsersPast(prevPeriodData?.totalActiveUsers)
        setNewUsersPast(prevPeriodData?.totalNewUsers)

        const percentageChangeSessions = ((currentPeriodData.totalSessions - prevPeriodData.totalSessions) / prevPeriodData.totalSessions) * 100;
        setMonthPercent(percentageChangeSessions);

        const percentageChangePageViews = ((currentPeriodData.totalPageViews - prevPeriodData.totalPageViews) / prevPeriodData.totalPageViews) * 100;
        setMonthPercentPageViews(percentageChangePageViews);

        const percentageChangeActiveUsers = ((currentPeriodData.totalActiveUsers - prevPeriodData.totalActiveUsers) / prevPeriodData.totalActiveUsers) * 100;
        setMonthPercentActiveUsers(percentageChangeActiveUsers);

        const percentageChangeNewUsers = ((currentPeriodData.totalNewUsers - prevPeriodData.totalNewUsers) / prevPeriodData.totalNewUsers) * 100;
        setMonthPercentNewUsers(percentageChangeNewUsers);

    };


    useEffect(() => {
        console.log(property)
        if (session?.user) fetchAnalytics(7);
    }, [session]);

    return (
        <div className="stats max-w-[95%] shadow">

            <div className="stat">

                <div className="stat-title flex flex-row items-center justify-start">Sessioni
                    <span className={`ml-3 text-xs flex flex-row items-center justify-center ${monthPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {monthPercent >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        {shortenNumber(visite - visitePast)}
                    </span>
                </div>
                <div className={`stat-value flex flex-row items-center justify-between ${monthPercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {shortenNumber(visite)}
                    <div className="stat-figure text-primary mr-3">
                        <LogIn className={`${monthPercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`} size={42} />
                    </div>
                </div>
                <div className="stat-desc">
                    <div className="flex flex-row">
                        <span className={`flex flex-row mr-2 ${monthPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>{monthPercent >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />} {monthPercent.toFixed(0)}%</span> periodo precedente
                    </div>
                    <div className="mt-3 gap-1 flex flex-row items-start justify-start">
                        <span
                            className={`btn btn-xs ${activeBtn === 7 ? 'btn-primary text-white' : ''}`}
                            onClick={() => fetchAnalytics(7)}
                        >
                            7gg
                        </span>
                        <span
                            className={`btn btn-xs ${activeBtn === 30 ? 'btn-primary text-white' : ''}`}
                            onClick={() => fetchAnalytics(30)}
                        >
                            30gg
                        </span>
                        <span
                            className={`btn btn-xs ${activeBtn === 90 ? 'btn-primary text-white' : ''}`}
                            onClick={() => fetchAnalytics(90)}
                        >
                            90gg
                        </span>
                        <span
                            className={`btn btn-xs ${activeBtn === 120 ? 'btn-primary text-white' : ''}`}
                            onClick={() => fetchAnalytics(120)}
                        >
                            120gg
                        </span>
                    </div>
                </div>
            </div>

            <div className="stat">
                <div className="stat-title flex flex-row items-center justify-start">Visual. Pagina
                    <span className={`ml-3 text-xs flex flex-row items-center justify-center ${monthPercentPageViews >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {monthPercentPageViews >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        {shortenNumber(pageViews - pageViewsPast)}
                    </span>
                </div>
                <div className={`stat-value flex flex-row items-center justify-between ${monthPercentPageViews >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {shortenNumber(pageViews)}
                    <div className="stat-figure text-primary mr-3">
                        <Eye className={`${monthPercentPageViews >= 0 ? 'text-emerald-500' : 'text-red-500'}`} size={42} />
                    </div>
                </div>
                <div className="stat-desc">
                    <div className="flex flex-row">
                        <span className={`flex flex-row mr-2 ${monthPercentPageViews >= 0 ? 'text-green-500' : 'text-red-500'}`}>{monthPercentPageViews >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />} {monthPercentPageViews.toFixed(0)}%</span> periodo precedente
                    </div>
                    <div className="mt-3 gap-1 flex flex-row items-start justify-start min-w-[200px] min-h-[24px]">
                        <SimpleLineChart data={charts.screenPageViews} dates={charts.dates} color={monthPercentPageViews >= 0 ? '#1ebc88' : '#ef4444'} />
                    </div>
                </div>
            </div>

            <div className="stat">
                <div className="stat-title flex flex-row items-center justify-start">Nuovi Utenti
                    <span className={`ml-3 text-xs flex flex-row items-center justify-center ${monthPercentNewUsers >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {monthPercentNewUsers >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        {shortenNumber(newUsers - newUsersPast)}
                    </span>
                </div>
                <div className={`stat-value flex flex-row items-center justify-between ${monthPercentNewUsers >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {shortenNumber(newUsers)}
                    <div className="stat-figure text-primary mr-3">
                        <Users className={`${monthPercentNewUsers >= 0 ? 'text-emerald-500' : 'text-red-500'}`} size={42} />
                    </div>
                </div>
                <div className="stat-desc">
                    <div className="flex flex-row">
                        <span className={`flex flex-row mr-2 ${monthPercentNewUsers >= 0 ? 'text-green-500' : 'text-red-500'}`}>{monthPercentNewUsers >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />} {monthPercentNewUsers.toFixed(0)}%</span> periodo precedente
                    </div>
                    <div className="mt-3 gap-1 flex flex-row items-start justify-start min-w-[200px] min-h-[24px]">
                        <SimpleLineChart data={charts.newUsers} dates={charts.dates} color={monthPercentNewUsers >= 0 ? '#1ebc88' : '#ef4444'} />
                    </div>
                </div>
            </div>

            <div className="stat">
                <div className="stat-title flex flex-row items-center justify-start">Utenti Attivi
                    <span className={`ml-3 text-xs flex flex-row items-center justify-center ${monthPercentActiveUsers >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {monthPercentActiveUsers >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        {shortenNumber(activeUsers - activeUsersPast)}
                    </span>
                </div>
                <div className={`stat-value flex flex-row items-center justify-between ${monthPercentActiveUsers >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {shortenNumber(activeUsers)}
                    <div className="stat-figure text-primary mr-3">
                        <Users className={`${monthPercentActiveUsers >= 0 ? 'text-emerald-500' : 'text-red-500'}`} size={42} />
                    </div>
                </div>
                <div className="stat-desc">
                    <div className="flex flex-row">
                        <span className={`flex flex-row mr-2 ${monthPercentActiveUsers >= 0 ? 'text-green-500' : 'text-red-500'}`}>{monthPercentActiveUsers >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />} {monthPercentActiveUsers.toFixed(0)}%</span> periodo precedente
                    </div>
                    <div className="mt-3 gap-1 flex flex-row items-start justify-start min-w-[200px] min-h-[24px]">
                        <SimpleLineChart data={charts.activeUsers} dates={charts.dates} color={monthPercentActiveUsers >= 0 ? '#1ebc88' : '#ef4444'} />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default MiniStats