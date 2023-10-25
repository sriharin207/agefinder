"use client";
import Image from "next/image";
import React, { useState } from "react";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { Card } from "primereact/card";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";

export default function Home() {
  const [name, setname] = useState("");
  const [tableData, setTableData] = useState([{}]);
  const [showProgressBar, setshowProgressBar] = useState(false);
  const updateName = async () => {
    setshowProgressBar(true);
    let req1 = `https://api.agify.io?name=${name}`;
    let req2 = `https://api.nationalize.io?name=${name}`;
    let req3 = `https://api.genderize.io?name=${name}`;
    const [firstResponse, secondResponse, thirdResponse] = await Promise.all([
      axios.get(req1),
      axios.get(req2),
      axios.get(req3),
    ]);
    let newData = {
      num: "1",
      name: name,
      age: firstResponse.data?.age,
      nationality: secondResponse.data?.country?.sort(
        (
          a: { country: { probability: any } },
          b: { country: { probability: any } }
        ) => a?.country?.probability + b?.country?.probability
      )[0]?.country_id,
      gender: thirdResponse.data?.gender,
    };
    setTableData([newData]);
    setshowProgressBar(false);
  };
  return (
    <Card title="Age and Nationality Finder">
      <div className="">
        <div className="p-inputgroup flex-1">
          <InputText
            placeholder="Please enter name"
            value={name}
            onChange={(e) => setname(e.target.value)}
          />
          <Button
            label="Search"
            onClick={updateName}
            disabled={name?.length == 0 ? true : false}
          />
        </div>
        <br></br>
        {showProgressBar ? (
          <div className="card flex justify-content-center">
            <ProgressSpinner />
          </div>
        ) : (
          <div>
            {Object.keys(tableData[0])?.length > 0 ? (
              <DataTable
                value={tableData}
                showGridlines
                tableStyle={{ minWidth: "50rem" }}
              >
                <Column
                  field="num"
                  header="SI Number"
                  style={{ width: "15%" }}
                ></Column>
                <Column field="name" header="Name"></Column>
                <Column field="age" header="Age"></Column>
                <Column field="nationality" header="Nationality"></Column>
                <Column field="gender" header="Gender"></Column>
              </DataTable>
            ) : (
              ""
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
