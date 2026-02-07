import React, { useEffect, useRef, useState } from "react";
import { Slider, Input, Button, Stack, Typography } from "@mui/material";
import { toast } from 'react-toastify'
import { FilterListAPI } from "../../API/FilterAPI/FilterListAPI";

const resetRangeFilter = async ({
    filterName,
    setSliderValue,
    setTempSliderValue,
    handleRangeFilterApi,
    prodListType,
    cookie,
    setIsShowBtn,
    show, setShow,
    setAppliedRange,
}) => {
    try {
        const res1 = await FilterListAPI(prodListType, cookie);
        const optionsRaw = res1?.find((f) => f?.Name === filterName)?.options;

        if (optionsRaw) {
            const { Min = 0, Max = 100 } = JSON.parse(optionsRaw)?.[0] || {};
            const resetValue = [Min, Max];
            setSliderValue(resetValue);
            setTempSliderValue(resetValue);
            setAppliedRange(["", ""])
            // handleRangeFilterApi(resetValue);
            setIsShowBtn?.(false);
            if (show) setShow(false)
        }
    } catch (error) {
        console.error(`Failed to reset filter "${filterName}":`, error);
    }
};

const RangeFilter = ({
    ele,
    sliderValue,
    setSliderValue,
    handleRangeFilterApi,
    prodListType,
    cookie,
    show,
    setShow,
    filterName,
    setAppliedRange,
    appliedRange
}) => {
    const parsedOptions = JSON.parse(ele?.options || "[]")?.[0] || {};
    const min = Number(parsedOptions.Min ?? 0);
    const max = Number(parsedOptions.Max ?? 100);

    const [tempSliderValue, setTempSliderValue] = useState(sliderValue);
    const [isShowBtn, setIsShowBtn] = useState(false);

    const inputRefs = useRef([]);

    useEffect(() => {
        inputRefs.current = tempSliderValue.map((_, i) => inputRefs.current[i] ?? React.createRef());
    }, [tempSliderValue]);

    const handleKeyDown = (index) => (e) => {
        if (e.key === 'Enter') {
            if (index < tempSliderValue.length - 1) {
                inputRefs.current[index + 1]?.current?.focus();
            } else {
                handleSave(); // last input triggers apply
            }
        }
    };

    useEffect(() => {
        if (Array.isArray(sliderValue) && sliderValue.length === 2) {
            setTempSliderValue(sliderValue);
        }
    }, [sliderValue]);

    const handleInputChange = (index) => (event) => {
        const newValue = event.target.value === "" ? "" : Number(event.target.value);
        const updated = [...tempSliderValue];
        updated[index] = newValue;
        setTempSliderValue(updated);
        setIsShowBtn(updated[0] !== sliderValue[0] || updated[1] !== sliderValue[1]);
    };

    const handleSliderChange = (_, newValue) => {
        setTempSliderValue(newValue);
        setIsShowBtn(newValue[0] !== sliderValue[0] || newValue[1] !== sliderValue[1]);
    };


    const handleSave = () => {
        const [minVal, maxVal] = tempSliderValue;

        // Empty or undefined
        if (minVal == null || maxVal == null || minVal === '' || maxVal === '') {
            toast.error('Please enter valid range values.', {
                hideProgressBar: true,
                duration: 5000,
            });
            return;
        }

        // Not a number
        if (isNaN(minVal) || isNaN(maxVal)) {
            toast.error('Please enter valid range values.', {
                hideProgressBar: true,
                duration: 5000,
            });
            return;
        }

        // Negative values
        if (minVal < 0 || maxVal < 0) {
            toast.error('Please enter valid range values.', {
                hideProgressBar: true,
                duration: 5000,
            });
            return;
        }

        // Equal values
        if (Number(minVal) === Number(maxVal)) {
            toast.error('Please enter valid range values.', {
                hideProgressBar: true,
                duration: 5000,
            });
            return;
        }

        // Min > Max
        if (Number(minVal) > Number(maxVal)) {
            toast.error("Please enter valid range values.", {
                hideProgressBar: true,
                duration: 5000,
            });
            return;
        }

        // Below actual min
        if (minVal < min) {
            toast.error('Please enter valid range values.', {
                hideProgressBar: true,
                duration: 5000,
            });
            return;
        }

        // Above actual max
        if (maxVal > max) {
            toast.error('Please enter valid range values.', {
                hideProgressBar: true,
                duration: 5000,
            });
            return;
        }

        setSliderValue(tempSliderValue);
        setTempSliderValue(tempSliderValue);
        handleRangeFilterApi(tempSliderValue);
        setIsShowBtn(false);
        setAppliedRange([min, max])
        setShow(true)
    };

    return (
        <div style={{ position: "relative" }}>

            {appliedRange && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "4px",
                        position: "absolute",
                        top: "-12px",
                        width: "100%",
                    }}
                >
                    <Typography variant="caption" color="text.secondary" fontSize="11px">
                        {appliedRange[0] !== "" ? `Min: ${appliedRange[0]}` : ""}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontSize="11px">
                        {appliedRange[1] !== "" ? `Max: ${appliedRange[1]}` : ""}
                    </Typography>
                </div>
            )}

            <Slider
                value={tempSliderValue}
                onChange={handleSliderChange}
                min={min}
                max={max}
                step={0.001}
                disableSwap
                valueLabelDisplay="off"
                sx={{ marginTop: "5px", transition: "all 0.2s ease-out" }}
            />
            <div style={{ display: "flex", gap: "10px", justifyContent: "space-around" }}>
                {tempSliderValue.map((val, index) => (
                    <Input
                        key={index}
                        value={val}
                        inputRef={inputRefs.current[index]}
                        onKeyDown={handleKeyDown(index)}
                        onChange={handleInputChange(index)}
                        inputProps={{ step: 0.001, min, max, type: "number" }}
                        sx={{ textAlign: "center" }}
                    />
                ))}
            </div>
            <Stack direction="row" justifyContent="flex-end" gap={1} mt={1}>
                {show && (
                    <Button
                        variant="outlined"
                        sx={{ paddingBottom: "0" }}
                        onClick={() =>
                            resetRangeFilter({
                                filterName,
                                setSliderValue,
                                setTempSliderValue,
                                handleRangeFilterApi,
                                prodListType,
                                cookie,
                                setIsShowBtn,
                                show,
                                setShow,
                                setAppliedRange
                            })
                        }
                        color="error"
                    >
                        Reset
                    </Button>
                )}
                {isShowBtn && (
                    <Button variant="outlined" sx={{ paddingBottom: "0" }} onClick={handleSave} color="success">
                        Apply
                    </Button>
                )}
            </Stack>
        </div>
    );
};

export default RangeFilter;
