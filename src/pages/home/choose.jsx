
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import CustomDropdown, { toLocalMonth } from '../../components/dropdown';

import './style.scss';


const initialState = {
    value: '0,00',
    description: '',
    isPositive: false,
    idEdit: -1,
    isPaid: false,
};


const kindEnum = [
    'Geral',
    'Imposto',
    'Salário',
    'Serviços',
    'Saúde',
    'Investimentos',
    'Moradia',
    'Banco'
];

const ChooseRoute = ({ history }) => {


    const [selectedDate, setSelectedDate] = useState('');
    const [optionsDate, setOptionsDate] = useState([]);

    const [financesDate, setFinancesDate] = useState([]);

    const [displayModalAddFinance, setDisplayModalAddFinance] = useState(false);
    const [displayModalAddDate, setDisplayModalAddDate] = useState(false);

    const [dateField, setDateField] = useState(`${new Date().getMonth() + 1}-${new Date().getFullYear()}`)

    const [form, setForm] = useState(initialState);

    const handleChange = (event, maskCallback = null) => {
        setForm({ ...form, [event.target.name]: maskCallback ? maskCallback(event.target.value) : event.target.value });
    }

    const handleChangeToggle = (key) => {
        setForm({ ...form, [key]: !form[key] });
    }

    const handleChangePaid = (value) => {
        let paid = false;
        let onCredit = false;

        if (Number(value) === 2) {
            onCredit = true;
        }

        if (Number(value) > 0) {
            paid = true;
        }

        setForm({ ...form, isPaid: paid, credit: onCredit });
    }

    const handleChangeKind = (value) => {
        setForm({ ...form, kind: value});
    }


    useQuery(
        ['loadFinances'],
        async () => await localStorage.getItem('finances'),
        {
            onSuccess: data => {
                if (data) {
                    const parsed = JSON.parse(data);
                    let optionsResult = [];

                    for (var item in parsed) {
                        optionsResult.push(item);
                    }

                    if (optionsResult.length > 0) {
                        const lastOption = optionsResult[optionsResult.length - 1];
                        setSelectedDate(lastOption);
                        setOptionsDate(optionsResult);

                        if (parsed[lastOption]) {
                            setFinancesDate(parsed[lastOption]);
                        }
                    }
                }
            },
            onError: err => console.log(err.toString()),
        },
    );

    const handleClickFinanceCard = (item, index) => {
        const resultValue = Number(item.value) < 0 ? Number(item.value) * -1 : Number(item.value);
        setForm({
            value: resultValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }),
            description: item.description,
            isPositive: Number(item.value) > 0,
            idEdit: index,
            isPaid: item.isPaid,
            credit: item.credit ? item.credit : false,
            kind: item.kind >= 0 ? item.kind : (Number(item.value) > 0 ? 2 : 0)
        });
        setDisplayModalAddFinance(true);
    }

    const financeCardStyle = (item) => {
        const val = Number(item.value);
        const paid = item.isPaid;

        if (val > 0) {
            return { borderLeft: `4px solid var(--primary)` }

        } else {

            if (paid) {
                return { borderLeft: `4px solid var(--success)` }
            } else {
                return { borderLeft: `4px solid var(--danger)` }
            }
        }
    }


    const downloadCsv = () => {
        try {
            //financesDate
            //toLocalMonth(selectedDate)
            let csvData = toLocalMonth(selectedDate) + ';\n';

            csvData += 'Status;Descrição;Valor;Tipo;\n';

            for(let j = 0; j < financesDate.length; j++) {
                const item = financesDate[j];
                const status = item.isPaid ? (item.credit ? 'Pago c/ Crédito' : 'Pago') : 'Não Pago';
                const value = (Number(item.value) >= 0 ? '+' : '-') + (moneyMask(item.value))
                csvData += `${status};${item.description};${value};${item.kind >= 0 ? kindEnum[item.kind] : 'NA'};\n`;
            }

            csvData += ';\n';
            csvData += ` Entrada ${sumFinances(financesDate, '+')}; Saída ${sumFinances(financesDate, '-')};Total ${sumFinances(financesDate, '=')};\n`

        var blob = new Blob([
            new Uint8Array([0xEF, 0xBB, 0xBF]), // UTF-8 BOM
            csvData
            ],
            { type: "text/csv;charset=utf-8" });
    
        const url = window.URL.createObjectURL(blob); //'data:text/csv;charset=utf-8-BOM,' + encodeURIComponent(blob);
        const filename = `${selectedDate}-contas-${new Date().getTime()}.csv`;
    
        var downloadLink = document.createElement("a");
        document.body.appendChild(downloadLink);
    
        if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            downloadLink.href = url;
            downloadLink.download = filename;
            downloadLink.click();
        }
    
        document.body.removeChild(downloadLink);
        } catch (ex) {
            console.error('Não foi possível :(');
        }
    }


    return (
        <>
            {
                displayModalAddFinance || displayModalAddDate ? (
                    <div
                        onClick={() => {
                            setDisplayModalAddFinance(false);
                            setDisplayModalAddDate(false);
                        }}
                        className="bg-dark position-fixed section"
                        style={{ zIndex: 5, opacity: .5 }}></div>
                ) : null
            }

            {
                displayModalAddFinance ? (
                    <>
                        <div className="shadow bg-white position-fixed p-3 rounded" style={{ top: '10px', zIndex: 6, width: 'calc(100% - 20px)', margin: '0px 10px' }}>
                            <div className="form-group">
                                <label> Valor: </label>
                                <div className="d-flex align-items-center" style={{ gap: '5px' }}>
                                    <button style={{ minWidth: '35px' }} type="button" onClick={() => handleChangeToggle('isPositive')} className={`btn btn-${form.isPositive ? 'success' : 'danger'}`}>{form.isPositive ? '+' : '-'}</button>
                                    <input type="text" value={form.value}
                                        name="value"
                                        className="form-control"
                                        onChange={(event) => handleChange(event, floatMask)}
                                        onBlur={(event) => handleChange(event, moneyMask)}></input>
                                    <select style={{ width: '143px' }} onChange={(event) => handleChangePaid(event.target.value)} value={form.isPaid ? (form.credit ? 2 : 1) : 0} className="form-control">
                                        <option value={0}> Não Pago </option>
                                        <option value={1}> Pago </option>
                                        {
                                            !form.isPositive && <option value={2}> Pago c/ Crédito </option>
                                        }
                                    </select>
                                    {/* <button style={{ minWidth: '143px' }} type="button" onClick={() => } className={`btn btn-${form.isPaid ? 'success' : 'warning'} ml-1`}>{form.isPaid ? 'Pago' : 'Não Pago'}</button> */}
                                </div>
                                <div className="d-flex align-items-center justify-content-end mt-1">
                                    <select style={{ width: '143px' }} onChange={(event) => handleChangeKind(event.target.value)} value={form.kind} className="form-control">
                                        {
                                            form.isPositive ? 
                                            (
                                                <>
                                                    <option value={2}> {kindEnum[2]} </option>
                                                    <option value={0}> {kindEnum[0]} </option>
                                                    <option value={5}> {kindEnum[5]} </option>
                                                </>
                                            ):
                                            (kindEnum.map((value, index) => <option value={index}> {value} </option>))
                                        }                                      
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label> Descrição: </label>
                                <textarea value={form.description} name="description" onChange={handleChange} className="form-control" cols="10" rows="4"></textarea>
                            </div>
                            <div className="form-group text-center">
                                <button type="button" onClick={() => { setForm(initialState); setDisplayModalAddFinance(false) }} className="btn btn-link"> Cancelar </button>
                                <button type="button" onClick={() => addFinance()} className="btn btn-primary mr-2">
                                    {form.idEdit >= 0 ? 'Editar' : 'Adicionar'}
                                </button>
                                {
                                    form.idEdit >= 0 &&
                                    <button type="button" onClick={() => removeItem(form.idEdit)} className="btn btn-danger"> Remover </button>
                                }

                            </div>
                        </div>
                    </>
                ) : null
            }


            {
                displayModalAddDate ? (
                    <>
                        <div className="shadow bg-white position-fixed p-3 rounded" style={{ top: '10px', zIndex: 6, width: 'calc(100% - 20px)', margin: '0px 10px' }}>
                            <div className="form-group">
                                <label> Valor: </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={dateField}
                                    onChange={(event) => setDateField(numberMask(event.target.value))}
                                    onBlur={(event) => setDateField(dateMonthMask(event.target.value))} />
                            </div>
                            <div className="form-group text-center">
                                <button type="button" onClick={() => setDisplayModalAddDate(false)} className="btn btn-link"> Cancelar </button>
                                <button type="button" onClick={() => addMonth()} className="btn btn-primary mr-2">
                                    Adicionar
                                </button>
                            </div>
                        </div>
                    </>
                ) : null
            }

            <div className="section">
                <div className="bg-primary d-flex w-100 align-items-center p-2 justify-content-between shadow">
                    <p className="text-white m-0 h5"> Julius Finance </p>
                    <div>
                        <button type="button" className="btn btn-primary" onClick={downloadCsv}> <i className="fas fa-print"></i> </button>
                    <CustomDropdown
                        theme={'primary'}
                        options={optionsDate}
                        addButton={true}
                        value={selectedDate}
                        onAddItem={() => setDisplayModalAddDate(true)}
                        onChange={(value) => reloadFinancesFrom(value)}
                    ></CustomDropdown>
                    </div>
                </div>

                <div className="choose--body">
                    <div className="container my-4">
                        <div className="row">
                            <div className="col-md-6 col-xs-6 col-6">
                                <div className="bg-success rounded p-2">
                                    <h5 className="text-white"> Total entrada: </h5>
                                    <p className="text-white">{sumFinances(financesDate, '+')}</p>
                                </div>
                            </div>
                            <div className="col-md-6 col-xs-6 col-6">
                                <div className="bg-danger rounded p-2">
                                    <h5 className="text-white"> Total saída: </h5>
                                    <p className="text-white">{sumFinances(financesDate, '-')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container mt-4 mb-1">
                        <div className="row">
                            <div className="col-md-6 col-sm-6 col-6"></div>
                            <div className="col-md-6 col-sm-6 col-6">

                            </div>
                        </div>
                    </div>
                    <div className="container">

                        {
                            financesDate.map((item, index) =>
                                <div key={index}
                                    className="w-100 p-2 bg-info mb-1 position-relative d-flex align-items-center justify-content-between rounded"
                                    style={financeCardStyle(item)}
                                    onClick={() => handleClickFinanceCard(item, index)}
                                >
                                    <p className="m-0 d-inline-block" style={{ maxWidth: '65%' }}>
                                        <p className={`text-uppercase text-${item.isPaid ? 'success' : 'danger'} m-0 d-inline-lock small`}>{item.isPaid ? (item.credit ? 'Pago c/ Crédito' : 'Pago') : 'Não Pago'}</p>

                                        {item.description}
                                    </p>
                                    <div className="position-relative">
                                        <p className={`m-0 text-${Number(item.value) > 0 ? 'primary' : 'danger'} h5`}> {Number(item.value) >= 0 ? '+' : '-'} {moneyMask(item.value)} </p>
                                        {item.kind >= 0 && <small className="position-absolute text-secondary" style={{right: '0px'}}> {kindEnum[item.kind]} </small>}
                                    </div>
                                </div>
                            )
                        }


                    </div>
                </div>

                <div className="position-fixed bg-white w-100 d-flex shadow px-2 py-4 justify-content-between align-items-center" style={{ bottom: '0px', left: '0px', zIndex: '4' }}>
                    <p className="text-dark m-0 h5"> Total: </p>
                    <div>
                        <span className="bg-info text-dark mr-2 text-white rounded h5 py-2 px-4" onClick={() => setDisplayModalAddFinance(true)}>Novo</span>
                        <span className={`bg-${isFinancePositive(financesDate) ? 'success' : 'danger'} text-white rounded h5 py-2 px-4`}>{sumFinances(financesDate, '=')}</span>
                    </div>
                </div>
            </div>
        </>
    );


    function moneyMask(value) {
        if (value) {
            var v = value + '';
            v = v.replace(/[^0-9,.]/g, '');
            v = v.trim();
            v = v.replace(',', '.');
            return (isNaN(Number(v)) ? 0 : Number(v)).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })

        } else {
            return '0,00';
        }
    };

    function floatMask(value) {
        if (value) {
            var v = value + '';
            v = v.replace(/[^0-9,]/g, '');
            return v;
        }
        return '';
    }

    function numberMask(value) {
        if (value) {
            var v = value.replace(/\D/g, "");
            return v;
        }
        return '';
    };

    function dateMonthMask(value) {
        if (value) {
            var v = value + '';

            v = v.slice(0, 6);
            v = v.padStart(6, '0');

            var month = v.slice(0, 2);
            var year = v.slice(2, 6);

            if (Number(month) > 12 || Number(month) === 0) {
                month = '12';
            }

            v = (month + year).replace(/^(\d{0,2})(\d{0,4})/, "$1-$2");
            return v;
        } else {
            return '01-2000';
        }
    };

    function reloadFinancesFrom(dateMonth = '') {
        const financesStorage = localStorage.getItem('finances');

        if (financesStorage) {
            const financesParsed = JSON.parse(financesStorage);

            if (financesParsed[dateMonth]) {
                setFinancesDate(financesParsed[dateMonth]);
            }

            let optionsResult = [];

            for (var item in financesParsed) {
                optionsResult.push(item);
            }

            if (optionsResult.length > 0) {
                setOptionsDate(optionsResult);
            }
        }

        setSelectedDate(dateMonth);
    }


    function addMonth() {
        const stored = localStorage.getItem('finances');

        let parsed = {};
        if (stored) {
            parsed = JSON.parse(stored);
        }

        if (parsed[dateField]) {
            if (parsed[dateField].length > 0) {
                return;
            }
        }

        parsed[dateField] = [];
        localStorage.setItem('finances', JSON.stringify(parsed));

        const financesParsed = parsed;

        if (financesParsed[dateField]) {
            setFinancesDate(financesParsed[dateField]);
        }

        let optionsResult = [];

        for (var item in financesParsed) {
            optionsResult.push(item);
        }

        if (optionsResult.length > 0) {
            setOptionsDate(optionsResult);
        }

        setSelectedDate(dateField);

        setDisplayModalAddDate(false);

    }


    function addFinance() {

        if (form.value && form.description) {
            var v = form.value + '';
            v = v.replace(/[^0-9,]/g, '');
            v = v.replace(',', '.');

            const numbered = Number(v);

            const stored = localStorage.getItem('finances');
            let parsed = JSON.parse(stored);
            let clone = JSON.parse(JSON.stringify(financesDate));

            if (form.idEdit >= 0) {
                clone[form.idEdit] = {
                    description: form.description,
                    registred: new Date().toISOString(),
                    value: form.isPositive ? numbered : numbered * -1,
                    isPaid: form.isPaid,
                    credit: form.credit,
                    kind: form.kind
                };

                setFinancesDate(clone);
                parsed[selectedDate] = clone;

            } else {
                clone.push({
                    description: form.description,
                    registred: new Date().toISOString(),
                    value: form.isPositive ? numbered : numbered * -1,
                    isPaid: form.isPaid,
                    credit: form.credit,
                    kind: form.kind
                });

                setFinancesDate(clone);
                parsed[selectedDate] = clone;
            }


            localStorage.setItem('finances', JSON.stringify(parsed));

            setForm(initialState);
            setDisplayModalAddFinance(false);

        }

    }

    function removeItem(index) {
        const stored = localStorage.getItem('finances');
        let parsed = JSON.parse(stored);
        let clone = JSON.parse(JSON.stringify(financesDate));

        clone.splice(index, 1);

        setFinancesDate(clone);
        parsed[selectedDate] = clone;

        localStorage.setItem('finances', JSON.stringify(parsed));
        setForm(initialState);
        setDisplayModalAddFinance(false);
    }


    function sumFinances(items, op = '=') {

        let total = 0;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const value = Number(item.value);
            const paidOnCredit = item.credit ? item.credit : false;

            if (op === '-' && !paidOnCredit) {
                if (value < 0) {
                    total += (-1 * value);
                }
            } else if (op === '+') {
                if (value > 0) {
                    total += value;
                }
            } else if (op === '=' && !paidOnCredit) {
                total += value;
            }

        }

        if (op === '=') {
            return total > 0 ? '+' + moneyMask(total) : '-' + moneyMask(total);
        } else {
            return moneyMask(total);
        }
    }

    function isFinancePositive(items) {

        let total = 0;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const value = Number(item.value);

            total += value;
        }

        return (total > 0);
    }

}

export default ChooseRoute;