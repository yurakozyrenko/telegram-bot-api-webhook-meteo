const convertTimeToCron = (time: string): string => {
    const [hours, minutes] = time.split(':');
    return `${minutes} ${hours} * * *`;
  };
  
  export default convertTimeToCron;