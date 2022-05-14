
import React from 'react';
import './style.scss';

const CustomDropdown = ({ theme, options, onAddItem, onChange, value }) => {

    return (
        <div className="position-relative d-inline-block">
            <button type="button" className={`btn btn-${theme} cdrp--button`}> {toLocalMonth(value)} <i className="fas fa-chevron-down ml-1"></i> </button>
            <div className="position-absolute shadow bg-white rounded p-2 cdrp--list">
                {
                    options.map((option, index) =>
                        <button type="button" onClick={() => onChange(option)} key={index} className="btn btn-link btn-block text-left text-dark m-0"> {toLocalMonth(option)} </button>
                    )
                }
                <button type="button" onClick={onAddItem} className="btn btn-link btn-block m-0"> Adicionar </button>
            </div>
        </div>
    );

    

};


export const toLocalMonth = (value = '') => {

    if (value) {
        const v = (value + '').split('-');
        const month = v[0];
        const year = v[1];

        switch (Number(month)) {
            case 1: return `Janeiro/${year}`;

            case 2: return `Fevereiro/${year}`;

            case 3: return `Março/${year}`;

            case 4: return `Abril/${year}`;

            case 5: return `Maio/${year}`;

            case 6: return `Junho/${year}`;

            case 7: return `Julho/${year}`;

            case 8: return `Agosto/${year}`;

            case 9: return `Setembro/${year}`;

            case 10: return `Outubro/${year}`;

            case 11: return `Novembro/${year}`;

            case 12: return `Dezembro/${year}`;

            default:
                return `${month}/${year}`;
        }

    }

    return 'Err';
}


export default CustomDropdown;