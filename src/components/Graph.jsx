import { db } from "@/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function Graph({ userId }) {
  const [graphData, setGraphData] = useState([]);

  async function fetchGraphData() {
    try {
      const q = query(
        collection(db, "accounts"),
        where("userId", "==", userId)
      );

      const querySnapShot = await getDocs(q);

      const data = [];
      querySnapShot.forEach((doc) => {
        data.push(doc.data());
      });

      setGraphData(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchGraphData();
  }, [userId]);

  const graph = graphData[0]?.monthlyAccountSavings?.map((data) => {
    return {
      savingTarget: graphData[0]?.savingTarget,
      month: data.month,
      DepositAmount: graphData[0].DepositAmount,
      MonthlyTarget: data.MonthlyTarget,
    };
  });

  return (
    <div>
      <div style={{ height: "900", overflowX: "auto" }}>
        <BarChart
          width={500}
          height={300}
          data={graph}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="33" />
          <YAxis datakey={"savingTarget"} />
          <XAxis dataKey={"month"} />
          <Tooltip />
          <Legend />

          <Bar
            dataKey="DepositAmount"
            fill="#8884d8"
            activeBar={<Rectangle fill="pink" stroke="blue" />}
          />

          <Bar
            dataKey="MonthlyTarget"
            fill="#82ca9d"
            activeBar={<Rectangle fill="gold" stroke="#82ca9d" />}
          />

          <Bar
            dataKey="savingTarget"
            fill="blue"
            activeBar={<Rectangle fill="blue" stroke="#blue" />}
          />
        </BarChart>
      </div>
    </div>
  );
}