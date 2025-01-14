function FormatTime(firebaseTimeStamp) {
    const milliseconds =
      firebaseTimeStamp.seconds * 1000 + firebaseTimeStamp.nanoseconds / 1000000;
  
    // create a date object
    const date = new Date(milliseconds);
  
    const readableDate = date.toLocaleString();
  
    return readableDate;
  }
  
  export default FormatTime;