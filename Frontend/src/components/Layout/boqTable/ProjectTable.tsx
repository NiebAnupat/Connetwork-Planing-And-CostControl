import React from "react";
import { useRouter } from "next/router";
import { Table, UnstyledButton } from "@mantine/core";

const ProjectData = [
  {
    projectNo: 1,
    projectName: "โปรเจค 1",
    custName: "ลูกค้า 1",
    custContact: "ช่องทางการติดต่อ 1",
    projectDetail: "รายละเอียด 1",
    other: "หมายเหตุ 1",
  },
  {
    projectNo: 2,
    projectName: "โปรเจค 2",
    custName: "ลูกค้า 2",
    custContact: "ช่องทางการติดต่อ 2",
    projectDetail: "รายละเอียด 2",
    other: "หมายเหตุ 2",
  },
  {
    projectNo: 3,
    projectName: "โปรเจค 3",
    custName: "ลูกค้า 3",
    custContact: "ช่องทางการติดต่อ 3",
    projectDetail: "รายละเอียด 3",
    other: "หมายเหตุ 3",
  },
];

export default function ProjectTable() {
  const router = useRouter();

  const rows = ProjectData.map((ProjectData) => (
    <tr key={ProjectData.projectNo}>
      <td>{ProjectData.projectName}</td>
      <td>{ProjectData.custName}</td>
      <td>{ProjectData.custContact}</td>
      <td>{ProjectData.projectDetail}</td>
      <td>{ProjectData.other}</td>
    </tr>
  ));

  return (
    <Table horizontalSpacing="md" verticalSpacing="md" highlightOnHover>
      <thead>
        <tr>
          <th>ชื่อโปรเจค</th>
          <th>ชื่อลูกค้า</th>
          <th>ช่องทางการติดต่อ</th>
          <th>รายละเอียด</th>
          <th>หมายเหตุ</th>
        </tr>
      </thead>
      <tbody
        onClick={() => {
          console.log("clicked");
          router.push("/AllProject/BoqTable");
        }}
      >
        {rows}
      </tbody>
    </Table>
  );
}
