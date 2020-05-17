const formatInputChart = ({ output, effectOnKey, effectOn }) => {
  let result = output[effectOnKey][effectOn];
  if (result && Object.keys(result).length !== 2) {
    result = result[Object.keys(result)[0]];
  }
  if(!result){
    result={magnitude:0,phase:0}
  }
  return result
};
export default formatInputChart;
