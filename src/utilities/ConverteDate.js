import { EthDateTime } from "ethiopian-calendar-date-converter";

export const ConvertedDate = () => {
     let currentDate = new Date();
     const ethDateTime = EthDateTime.fromEuropeanDate(currentDate)

     const date = ethDateTime.date.toString()
     const month = ethDateTime.month.toString()
     const year = ethDateTime.year.toString()

     const formatedDate = `${date}-${month}-${year}`;
     // console.log(formatedDate)
     return (formatedDate)
}