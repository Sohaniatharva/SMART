import { VALID_MT_TYPES } from '../config/MTType';
import { Response1 } from '../config/Response1';
import ValidateAMsg from '../ValidateAMsg';
import './index.css'
import { useState, useRef, useEffect } from "react";

const Utility = () => {

    const [crYear, setcrYear] = useState('');
    const [submittedSRYear, setSubmittedSRYear ] = useState('');
    const [tags, setTags] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [response, setResponse] = useState([]);
    const [showCompareScreen, setShowCompareScreen] = useState(false);
    const [comparemsgType, setComparemsgType] = useState('');
    const containerRef = useRef(null);
    const curyear = new Date().getFullYear();
    const options = [curyear, curyear - 1, curyear - 2]

    const showOptions = () => {
        const selectbox = document.getElementById("selectionBox");
        selectbox.style.visibility = 'visible'
    }
    const hideOptions = () => {
        const selectbox = document.getElementById("selectionBox");
        selectbox.style.visibility = 'hidden'

    }


    const handleSubmit = (e) => {
        e.preventDefault();
        if (crYear === '' || tags.length === 0) {
            alert("Please select CR Year and at least one Msg Type");
            return;
        }
        document.title = 'Report_SR'+crYear;
        setSubmittedSRYear(crYear)
        setResponse(Response1.data)
    }

    const handleReset = () => {
        setcrYear('');
        setSubmittedSRYear('')
        setTags([]);
        setInputValue('');
        setFilteredSuggestions([]);
        setShowDropdown(false);
        setResponse([])
        setResponse([])
        document.title = 'SMART';
        const checkboxes = document.querySelectorAll('.checkbox');
        checkboxes.forEach(checkbox => checkbox.checked = false);
    }

    const handleOptionClick = (e) => {
        const selectedValue = e.target.getAttribute('value');
        setcrYear(selectedValue);
        hideOptions();
    }

    {/* ------------------------------------------------------------------------------------------------------------------------------------ */ }


    const handleInputChange = (e) => {
        let value = e.target.value;
        setInputValue(value);
        value = value.trim(); // Trim whitespace
        if (value) {
            const filtered = VALID_MT_TYPES.filter((s) =>
                s.toLowerCase().includes(value.toLowerCase())
            ).filter(s => !tags.includes(s)); // Exclude already selected tags
            if (filtered.length === 0) {
                filtered.push("No Match found");
            }
            setFilteredSuggestions(filtered);
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    };

    const handleSuggestionClick = (item) => {
        if (item === "No Match found") {
            return;
        }
        setTags([...tags, item]);
        setInputValue("");
        setShowDropdown(false);
        document.getElementById("msgTypeSearch").focus();
    };

    const handleClickOutside = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
            setShowDropdown(false);
        }
    };
    const handleSpecialKeys = (e) => {
        if (e.key === "Backspace" && inputValue === "") {
            setTags(tags.slice(0, -1)); // Remove the last tag when Backspace is pressed
        } else if (e.key === "Enter" && inputValue.trim() !== "") {
            console.log("Enter key pressed with input:", inputValue);
            const trimmedInput = inputValue.trim();
            const MTInputArr = trimmedInput.split(',').map(item => item.trim().toUpperCase()).filter(item => VALID_MT_TYPES.includes(item)).filter(item => !tags.includes(item));
            if (MTInputArr.length > 0) {
                setTags([...tags, ...MTInputArr]);
                setInputValue("");
                setShowDropdown(false);
            } else {
                alert("All entered types are either invalid or already selected");
                setInputValue("");
            }
        }
    }

    const handleCompareMsgClick = (msgType) => {
        setComparemsgType(msgType);
        setShowCompareScreen(true);
    }


    const handlePrint = () => {
        document.getElementById('responseTable').classList.add('print_mode');
        window.print();
        setTimeout(() => {
            document.getElementById('responseTable').classList.remove('print_mode');
        }, 1000);
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    {/* ------------------------------------------------------------------------------------------------------------------------------------ */ }

    return (
        <div className="utilityPage">
            <div className="formContainer">
                <form onSubmit={(e) => e.preventDefault()} onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}>
                    <div className="feilds">

                        <div className="feild msgTypefeild">
                            <div className="label">
                                <label htmlFor="msgtype">Msg Type :</label>
                            </div>
                            <div className='msgTypeInputContainerWrapper'>
                                <div className='msgTypeInputContainer' ref={containerRef}>
                                    <div className='tagsContainer'>
                                        {tags.map((tag, index) => (
                                            <span className='tag' key={index}>
                                                {tag}
                                                <span className='removeTag' onClick={() => setTags(tags.filter((_, i) => i !== index))}>X</span>
                                            </span>
                                        ))}
                                        <input id='msgTypeSearch' className='msgTypeInput' type="text" value={inputValue} onChange={handleInputChange} onKeyDown={e => handleSpecialKeys(e)} placeholder="Type to search..." />

                                    </div>
                                    <div></div>
                                    <div className='tagSearchInputContainer'>
                                        {showDropdown && filteredSuggestions.length > 0 && (
                                            <div className="dropdown">
                                                {filteredSuggestions.map((item, index) => (
                                                    <div key={index} onClick={() => handleSuggestionClick(item)} className="dropdown_item">
                                                        {item}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="feild">
                            <div className="label"><label htmlFor="msgtype">SR Year :</label></div>
                            <div className='CRinputContainer' >
                                <input onFocus={(e) => showOptions(e)} onBlur={e => { hideOptions() }} className='CRInput' name="msgtypes" id="msgtype" readOnly placeholder='--Select--' value={crYear}></input>
                                <div className="selectionBox" id='selectionBox' >
                                    {options.map((year) => (
                                        <div className="options" key={year} value={year} onMouseDown={(e) => handleOptionClick(e)}>{year}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="feild btns">
                            <button className="formBtn" onClick={handleSubmit}>Submit</button>
                            <button className="formBtn" onClick={handleReset}>Reset</button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="responseContainer">
                {response.length>0 && <div className='DRBtnContainer'><button className='DRBtn' onClick={()=>handlePrint()}>Download Report</button></div>}
                <table className='responseTable' id='responseTable'>
                    <tbody>
                    {response.map((item) => (
                        <>
                            
                                <tr>
                                    <th style={{ backgroundColor: `${item.hasChanges ? '#ffd8d8' : '#ddffd8'}`, }} colSpan={5}>
                                        <div className="headerContainer">
                                            <div className="MTName">- {item.messageType} -</div>
                                            <div className="respOpt">
                                                <div className='indicator'> {item.hasChanges ? "Non-Compliant" : "Compliant"}</div>
                                                <div className='tblbtnContainer'><button value={item.messageType} onClick={e => handleCompareMsgClick(e.target.value)} className='tblBtn'>Compare Msg<span className='arrowbtn'>{'>'}</span></button></div>
                                            </div>
                                        </div>
                                    </th>
                                </tr>
                                {item.hasChanges && (
                                    <tr>
                                        <th>Field</th>
                                        <th>Current Value</th>
                                        <th>Requirement Type</th>
                                        <th>Requirement</th>
                                        <th>suggestion</th>
                                    </tr>
                                )}
                            
                            {item.hasChanges && (
                             <>
                                    {item.changes.map((change, fieldIndex) => (
                                        <tr key={fieldIndex}>
                                            <td>{change.field}</td>
                                            <td>{change.current_value}</td>
                                            <td>{change.requirementType}</td>
                                            <td>{change.requirement}</td>
                                            <td>{change.suggestion}</td>
                                        </tr>
                                    ))}
                            </>
                            )}

                        </>))}
                        </tbody>
                </table>

            </div>
            {showCompareScreen && <ValidateAMsg msgTyp={comparemsgType} CRYear={submittedSRYear} onClose={() => {setShowCompareScreen(false); document.title = 'Report_SR'+submittedSRYear;}} />}
        </div>
    )
}

export default Utility