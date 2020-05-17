const formatInputChart = ({ inputs,value,key }) => {
  const formattedData = {
    v_magnitude: inputs.voltageValue.magnitude,
    v_phase: inputs.voltageValue.phase,
    z_load_magnitude: inputs.ImpedanceLoadValue.magnitude,
    z_load_phase: inputs.ImpedanceLoadValue.phase,
    z_tl_magnitude: inputs.ImpedanceTRValue.magnitude,
    z_tl_phase: inputs.ImpedanceTRValue.phase,
  };
  formattedData[key]=value
  return {
    voltageValue:{magnitude:formattedData.v_magnitude,phase:formattedData.v_phase},
    ImpedanceLoadValue:{magnitude:formattedData.z_load_magnitude,phase:formattedData.z_load_phase},
    ImpedanceTRValue:{magnitude:formattedData.z_tl_magnitude,phase:formattedData.z_tl_phase},
    connection:inputs.connection
  };
};
export default formatInputChart;
