
import React, { useEffect, useState } from 'react';
import './index.css';
import { Response2 } from '../config/Response2';



const ValidateAMsg = ({ msgTyp, CRYear, onClose }) => {
  const [responseData, setResponseData] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  let placeholderText = 'Enter the ' + msgTyp + ' message here...';

  const verifyInput = (input) => {
    let ermsg = '';
    if (!input || input.trim() === '') {
      return { "result": false, "ermsg": 'Input cannot be empty.' }
    }
    // Extract MT type from Block 2 (e.g., {2:O103...} → MT103)
    const match = input.match(/\{2:[OI]?(\d{3})/);
    const mtType = match ? `MT${match[1]}` : null;
    const isValidMTType = mtType === msgTyp;
    if (!mtType) {
      return { "result": false, "ermsg": 'Unable to find  Type of this message.' };
    }
    if (!isValidMTType) {
      ermsg = 'SWIFT type is ' + mtType + '. It should be ' + msgTyp + '.';
    }
    const hasBlock1 = /\{1:.*?\}/s.test(input);
    const hasBlock2 = /\{2:.*?\}/s.test(input);
    const hasBlock4 = /\{4:([\s\S]*?)\-}/.test(input);


    if (!(hasBlock1 && hasBlock2 && hasBlock4)) {
      ermsg = ermsg + ' Message must contain Block 1, Block 2, and Block 4.';
    }

    return { "result": hasBlock1 && hasBlock2 && hasBlock4 && isValidMTType, "ermsg": ermsg };
  }

  const handleSubmit = () => {
    const inputMessage = document.getElementById('Msg').value.trim();
    console.log('Submitted Message:', inputMessage);
    let output = verifyInput(inputMessage)
    if (!output.result) {
      setErrorMsg(output.ermsg);
      setResponseData([]);
      return;
    } else {
      setErrorMsg('');
      setResponseData(Response2.data.fields);
    }
  }

  const handlePrint = () => {
    document.getElementById('resultTable').classList.add('print_mode');
    document.getElementById('headerInfo').classList.add('print_mode');
    document.getElementById('resultTable').style.top = '70px';

    window.print();
    
    setTimeout(() => {
      document.getElementById('resultTable').classList.remove('print_mode');
      document.getElementById('headerInfo').classList.remove('print_mode');
    }, 1000);
  }

  useEffect(()=>{
    document.title = msgTyp+'_SR'+CRYear
    console.log('iam inside')
  })

  return (
    <div className="ValiudateMsgPopupContainer">
      <div className="ValiudateMsgPopup">
        <div className="header">
          <div className='headerInfo' id='headerInfo'>
            <span className="static">Msg Type: </span>
            <span className="dynamic">{msgTyp}</span>
            <span className="static"> SR Year: </span>
            <span className="dynamic">{CRYear}</span>
          </div>
          <button className='clsbtn' onClick={onClose}>X</button>
        </div>
        <div className='Comparebody'>
          <div className="MsgInput">
            <textarea className='msgInputTArea' name="Msg" id="Msg" placeholder={placeholderText}></textarea>
            <div className='btnAndNoteContainer'>
              <div className="errnote">{errorMsg}</div>
              <div className="subbtn">
                <button className="SubDtn" onClick={handleSubmit}>Submit</button>
              </div>
            </div>
          </div>
          <div className="MsgOutput">{responseData.length < 1 ? <><div className='NoResult'>Result Area</div></> : <>
            <div className='gotResult'>
              <div className='dlbtnContainer'>
                <span className='box' style={{ backgroundColor: '#ffd8d8' }}>Mandetory</span>
                <span className='box' style={{ backgroundColor: '#fff1bd' }}>Optional</span>
                <span className='box' style={{ backgroundColor: '#c5ffc5' }}>No Change</span>
                <button className="dlBtn" onClick={() => handlePrint()}>Download Result</button>
              </div>
              <table className='resultTable' id='resultTable'>
                <thead>
                  <tr >
                    <th>Tag</th>
                    <th>Before (From Input Msg)</th>
                    <th>After (As Per SR{CRYear})</th>
                    <th>Change Description</th>
                  </tr>
                </thead>
                <tbody>
                  {responseData && responseData.map((item) => (
                    <tr style={{ backgroundColor: `${item.hasChanged ? item.requirementType === 'Mandatory' ? '#ffd8d8' : '#fff1bd' : '#c5ffc5'}` }}>
                      <td>{item.field}</td>
                      <td>{item.current_Line}</td>
                      <td>{item.expected_Line_example}</td>
                      <td>{item.hasChanged ? item.Change_Description : '✅ No Change'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div></>}</div>
        </div>
      </div>
    </div>
  );
}

export default ValidateAMsg;