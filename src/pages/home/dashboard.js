import React, { useState } from 'react'
import { useQuery } from 'react-query';

import './style.scss';

const DashboardRoute = ({ history }) => {

    const [today, setToday] = useState({ done: 0, total: 0, toDo: 0 });
    const [general, setGeneral] = useState({ done: 0, total: 0, toDo: 0 });

    useQuery(
        ['loadList'],
        async () => await localStorage.getItem('list'),
        {
            onSuccess: data => {
                if (data) {
                    const parsed = JSON.parse(data);
                    format(parsed);
                }



            },
            onError: err => console.log(err.toString()),
        },
    );

    return <>
        <div className="section choose">
            <div className="d-flex w-100 align-items-center p-2 shadow">
                <button type="button" className="btn btn-link m-0" onClick={() => history.push('/')}>
                    <i className="fas fa-arrow-left"></i>
                </button>
                <p className="m-0 text-dark h5"> Relatório de tarefas </p>
            </div>

            <div className="choose--body pt-4">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h4 className="text-primary h3"> Hoje </h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4 col-sm-4 col-md-4">
                            <p className="text-primary m-0"> Lançadas </p>
                            <p> {today.total} </p>
                        </div>
                        <div className="col-4 col-sm-4 col-md-4">
                            <p className="text-primary m-0"> Concluídas </p>
                            <p> {today.done} </p>
                        </div>
                        <div className="col-4 col-sm-4 col-md-4">
                            <p className="text-primary m-0"> Para fazer </p>
                            <p> {today.toDo} </p>
                        </div>
                    </div>

                    <hr></hr>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h4 className="text-primary h3"> Geral </h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4 col-sm-4 col-md-4">
                            <p className="text-primary m-0"> Lançadas </p>
                            <p> {general.total} </p>
                        </div>
                        <div className="col-4 col-sm-4 col-md-4">
                            <p className="text-primary m-0"> Concluídas </p>
                            <p> {general.done} </p>
                        </div>
                        <div className="col-4 col-sm-4 col-md-4">
                            <p className="text-primary m-0"> Para fazer </p>
                            <p> {general.toDo} </p>
                        </div>
                    </div>
                    <hr></hr>
                </div>
            </div>
        </div>
    </>



    function format(data = []) {

        var totalDoneToday = 0;
        var totalNotDoneToday = 0;
        var totalToday = 0;

        var totalDoneGeneral = 0;
        var totalNotDoneGeneral = 0;
        var totalGeneral = 0;

        for (var i = 0; i < data.length; i++) {
            const item = data[i];

            if (item.done) {
                if (item.finishedAt) {
                    if(isEqualDate(new Date(),  new Date(item.finishedAt))) {
                        totalDoneToday++;
                    }
                }
            } else {
                if(isEqualDate(new Date(),  new Date(item.date))) {
                    totalNotDoneToday++;
                }
            }

            if(isEqualDate(new Date(),  new Date(item.date))) {
                totalToday++;
            }

            if(item.done) {
                totalDoneGeneral++;
            } else {
                totalNotDoneGeneral++;
            }

        }

        totalGeneral = data.length;

        setGeneral({ done: totalDoneGeneral, total: totalGeneral, toDo: totalNotDoneGeneral });
        setToday({ done: totalDoneToday, total: totalToday, toDo: totalNotDoneToday });

    }


    function isEqualDate(value = new Date(), compare = new Date()) {        

        const finishedDay = compare.getDate();
        const finishedYear = compare.getFullYear();
        const finishedMonth = compare.getMonth();

        const currentDay = value.getDate();
        const currentYear = value.getFullYear();
        const currentMonth = value.getMonth();

        if (currentDay === finishedDay) {
            if (currentMonth === finishedMonth) {
                if (currentYear === finishedYear) {
                    return true;
                }
            }
        }
    }
};


export default DashboardRoute;