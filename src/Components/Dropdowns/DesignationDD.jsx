// import React from 'react'
// import AsyncSelect from 'react-select/async';

// const colourOptions = [
//     { label: 'purple', value: 'purple' },
//     { label: 'red', value: 'red' },
//     { label: 'orange', value: 'orange' },
// ];
// export default function DesignationDD() {
//     const filterColors = (inputValue) => {
//         return colourOptions.filter((i) =>
//             i.label.toLowerCase().includes(inputValue.toLowerCase())
//         );
//     };

//     const promiseOptions = (inputValue) =>
//         new Promise((resolve) => {
//             setTimeout(() => {
//                 resolve(filterColors(inputValue));
//             }, 1000);
//         });
//     return (
//         <AsyncSelect
//             // cacheOptions
//             isClearable
//             defaultOptions
//             className='react-select-dd mr-2'
//             classNamePrefix='react-select-dd'
//             placeholder="Designation"
//             loadOptions={promiseOptions} />)
// }
